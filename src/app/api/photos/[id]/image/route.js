import { getPhotoById } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { id } = await params;
  const photo = await getPhotoById(Number(id));

  if (!photo) {
    return new NextResponse('Not Found', { status: 404 });
  }

  const filename = photo.filename;

  // data URL
  if (filename.startsWith('data:')) {
    const [header, base64] = filename.split(';base64,');
    const mime = header.replace('data:', '');
    const buffer = Buffer.from(base64, 'base64');
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': mime,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  }

  // external URL
  if (filename.startsWith('http')) {
    return NextResponse.redirect(filename);
  }

  return new NextResponse('Not Found', { status: 404 });
}
