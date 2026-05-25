import { getCommentsByPostId, createComment } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const post_id = searchParams.get('post_id');
  if (!post_id) {
    return NextResponse.json({ error: '缺少 post_id' }, { status: 400 });
  }
  const comments = await getCommentsByPostId(post_id);
  return NextResponse.json(comments);
}

export async function POST(request) {
  const { post_id, author, content } = await request.json();
  if (!post_id || !content) {
    return NextResponse.json({ error: 'post_id 和内容不能为空' }, { status: 400 });
  }
  await createComment({ post_id, author, content });
  const comments = await getCommentsByPostId(post_id);
  return NextResponse.json(comments, { status: 201 });
}
