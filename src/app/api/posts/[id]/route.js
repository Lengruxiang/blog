import { getPostById, updatePost, deletePost } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { id } = await params;
  const post = await getPostById(id);
  if (!post) {
    return NextResponse.json({ error: '帖子不存在' }, { status: 404 });
  }
  return NextResponse.json(post);
}

export async function PUT(request, { params }) {
  const { id } = await params;
  const body = await request.json();
  const post = await updatePost(id, body);
  if (!post) {
    return NextResponse.json({ error: '帖子不存在' }, { status: 404 });
  }
  return NextResponse.json(post);
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  await deletePost(id);
  return NextResponse.json({ success: true });
}
