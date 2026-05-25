import { getAllPosts, createPost } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  const posts = await getAllPosts();
  return NextResponse.json(posts);
}

export async function POST(request) {
  const { title, content, cover_image } = await request.json();
  if (!title) {
    return NextResponse.json({ error: '标题不能为空' }, { status: 400 });
  }
  const post = await createPost({ title, content, cover_image });
  return NextResponse.json(post, { status: 201 });
}
