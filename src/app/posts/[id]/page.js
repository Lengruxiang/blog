import { getPostById } from '@/lib/db';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import CommentSection from '@/components/CommentSection';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function PostPage({ params }) {
  const { id } = await params;
  const post = await getPostById(id);

  if (!post) notFound();

  const date = new Date(post.created_at).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const coverSrc = post.cover_image?.startsWith('http')
    ? post.cover_image
    : `/uploads/${post.cover_image}`;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/"
          className="text-sm text-zinc-500 hover:text-zinc-700 no-underline"
        >
          &larr; 返回首页
        </Link>
        <Link
          href={`/posts/${post.id}/edit`}
          className="text-sm text-zinc-500 hover:text-zinc-700 no-underline"
        >
          编辑
        </Link>
      </div>

      {post.cover_image && (
        <img
          src={coverSrc}
          alt={post.title}
          className="w-full max-h-80 object-cover rounded-lg mb-6"
        />
      )}

      <article className="mb-10">
        <h1 className="text-3xl font-bold text-zinc-900 mb-3">{post.title}</h1>
        <time className="text-sm text-zinc-400 mb-6 block">{date}</time>
        <div className="prose prose-zinc max-w-none">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
      </article>

      <hr className="border-zinc-200 mb-6" />
      <CommentSection postId={post.id} />
    </div>
  );
}
