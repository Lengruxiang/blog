import Link from 'next/link';

function toAvatarChar(title) {
  return (title || '?')[0];
}

function imgSrc(filename) {
  return filename?.startsWith('http') ? filename : `/api/uploads/${filename}`;
}

export default function PostCard({ post }) {
  const date = new Date(post.created_at).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const time = new Date(post.created_at).toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const commentCount = post.comment_count ?? 0;
  const viewCount = post.views ?? 0;

  return (
    <Link href={`/posts/${post.id}`} className="tb-post-card tb-fade-in">
      <div className="tb-post-avatar">{toAvatarChar(post.title)}</div>

      <div className="tb-post-body">
        <div className="tb-post-title">
          {post.is_sticky ? <span className="tb-post-sticky">[置顶]</span> : null}
          {post.category ? <span className="tb-post-category">{post.category}</span> : null}
          {post.title}
        </div>
        <div className="tb-post-meta">
          <span>楼主</span>
          <span>{date}</span>
          <span>{time}</span>
        </div>
      </div>

      {post.cover_image && (
        <img
          src={imgSrc(post.cover_image)}
          alt=""
          className="tb-post-thumb"
          loading="lazy"
        />
      )}

      <div className="tb-post-stats">
        <span className="tb-post-stat">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          {commentCount}
        </span>
        <span className="tb-post-stat">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          {viewCount}
        </span>
      </div>
    </Link>
  );
}
