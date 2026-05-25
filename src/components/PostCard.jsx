import Link from 'next/link';

export default function PostCard({ post }) {
  const date = new Date(post.created_at).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const coverSrc = post.cover_image?.startsWith('http')
    ? post.cover_image
    : `/uploads/${post.cover_image}`;

  return (
    <Link
      href={`/posts/${post.id}`}
      className="block p-6 rounded-lg border border-zinc-200 hover:border-zinc-300 hover:shadow-sm transition-all no-underline bg-white"
    >
      {post.cover_image && (
        <img
          src={coverSrc}
          alt={post.title}
          className="w-full h-48 object-cover rounded-md mb-4"
        />
      )}
      <h2 className="text-lg font-semibold text-zinc-900 mb-2">{post.title}</h2>
      <p className="text-sm text-zinc-500">{date}</p>
    </Link>
  );
}
