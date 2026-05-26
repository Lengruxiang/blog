import { getAllPhotos, addPhoto } from '@/lib/db';
import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';

const MAX_SIZE_MB = 3;

export async function GET() {
  const photos = await getAllPhotos();
  return NextResponse.json(photos);
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('photo');

    if (!file) {
      return NextResponse.json({ error: '请选择照片' }, { status: 400 });
    }

    const originalName = file.name;
    let filename;

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(file.name, file, { access: 'public' });
      filename = blob.url;
    } else {
      const bytes = await file.arrayBuffer();
      const sizeMB = bytes.byteLength / (1024 * 1024);
      if (sizeMB > MAX_SIZE_MB) {
        return NextResponse.json({ error: `图片不能超过 ${MAX_SIZE_MB}MB` }, { status: 400 });
      }

      const buffer = Buffer.from(bytes);
      const mime = file.type || 'image/jpeg';
      const base64 = buffer.toString('base64');
      filename = `data:${mime};base64,${base64}`;
    }

    await addPhoto(filename, originalName);
    return NextResponse.json({ success: true, filename }, { status: 201 });
  } catch (err) {
    console.error('Photo upload error:', err);
    return NextResponse.json({ error: '上传失败，请重试' }, { status: 500 });
  }
}
