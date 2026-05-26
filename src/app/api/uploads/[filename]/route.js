import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import client from '@/lib/db';

const MIME_TYPES = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.bmp': 'image/bmp',
  '.ico': 'image/x-icon',
};

export async function GET(request, { params }) {
  const { filename } = await params;

  const safeName = path.basename(filename);
  if (safeName !== filename || !safeName) {
    return new NextResponse('Invalid filename', { status: 400 });
  }

  const ext = path.extname(safeName).toLowerCase();
  const mimeType = MIME_TYPES[ext] || 'application/octet-stream';

  // 1. Check filesystem locations
  const root = path.resolve('.');
  const locations = [
    path.join(root, 'data', 'uploads', safeName),
    path.join(root, 'public', 'uploads', safeName),
  ];

  for (const loc of locations) {
    if (existsSync(loc)) {
      const buffer = await readFile(loc);
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': mimeType,
          'Cache-Control': 'public, max-age=86400',
        },
      });
    }
  }

  // 2. Check database for a photo record with this filename
  try {
    const result = await client.execute({
      sql: 'SELECT filename FROM photos WHERE filename = ? LIMIT 1',
      args: [safeName],
    });
    const row = result.rows[0];
    if (row && row.filename) {
      const f = row.filename;
      if (f.startsWith('data:')) {
        const [header, base64] = f.split(';base64,');
        const mime = header.replace('data:', '');
        const buffer = Buffer.from(base64, 'base64');
        return new NextResponse(buffer, {
          headers: {
            'Content-Type': mime,
            'Cache-Control': 'public, max-age=86400',
          },
        });
      }
      if (f.startsWith('http')) {
        return NextResponse.redirect(f);
      }
    }
  } catch {
    // db lookup failed, continue to 404
  }

  return new NextResponse('Not Found', { status: 404 });
}
