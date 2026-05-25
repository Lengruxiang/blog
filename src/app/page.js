import { getAllPosts } from '@/lib/db';
import PostCard from '@/components/PostCard';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const posts = await getAllPosts();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-zinc-900 mb-8">最新文章</h1>

      {posts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-zinc-500 text-lg mb-4">还没有文章</p>
          <a
            href="/posts/new"
            className="inline-block px-6 py-2.5 bg-zinc-900 text-white rounded-lg font-medium hover:bg-zinc-800 transition-colors no-underline"
          >
            写第一篇文章
          </a>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
