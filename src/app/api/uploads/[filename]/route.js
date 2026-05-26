import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

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

  // safety: prevent path traversal
  const safeName = path.basename(filename);
  if (safeName !== filename) {
    return new NextResponse('Invalid filename', { status: 400 });
  }

  const ext = path.extname(safeName).toLowerCase();
  const mimeType = MIME_TYPES[ext] || 'application/octet-stream';

  // Try multiple locations (relative to project root)
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

  return new NextResponse('Not Found', { status: 404 });
}
