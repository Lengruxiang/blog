import { getAllPhotos, addPhoto } from '@/lib/db';
import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export async function GET() {
  const photos = await getAllPhotos();
  return NextResponse.json(photos);
}

export async function POST(request) {
  const formData = await request.formData();
  const file = formData.get('photo');

  if (!file) {
    return NextResponse.json({ error: '请选择照片' }, { status: 400 });
  }

  let filename;
  let originalName = file.name;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(file.name, file, { access: 'public' });
    filename = blob.url;
  } else {
    const { writeFile, mkdir } = await import('fs/promises');
    const path = await import('path');
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const ext = path.extname(file.name) || '.jpg';
    const localName = Date.now() + ext;
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadsDir, { recursive: true });
    await writeFile(path.join(uploadsDir, localName), buffer);
    filename = localName;
  }

  await addPhoto(filename, originalName);
  return NextResponse.json({ success: true, filename }, { status: 201 });
}
