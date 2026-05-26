import { getPostById, incrementPostViews } from '@/lib/db';
import { notFound } from 'next/navigation';

import PostContent from '@/components/PostContent';
import CommentSection from '@/components/CommentSection';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

function toAvatarChar(title) {
  return (title || '?')[0];
}

export default async function PostPage({ params }) {
  const { id } = await params;
  const post = await getPostById(id);

  if (!post) notFound();

  await incrementPostViews(id);
  const views = (post.views || 0) + 1;

  const date = new Date(post.created_at).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const time = new Date(post.created_at).toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="tb-main">
      <div className="tb-breadcrumb">
        <Link href="/">首页</Link>
        <span>/</span>
        {post.category && (
          <>
            <Link href={`/?category=${post.category}`}>{post.category}</Link>
            <span>/</span>
          </>
        )}
        <span style={{ color: '#374151' }}>帖子详情</span>
      </div>

      <div className="tb-post-detail">
        <div className="tb-post-detail-header">
          <h1 className="tb-post-detail-title">
            {post.is_sticky ? <span className="tb-badge tb-badge-sticky" style={{ marginRight: 8 }}>置顶</span> : null}
            {post.category && (
              <span className="tb-badge" style={{ background: '#eff6ff', color: '#2563eb', marginRight: 8 }}>
                {post.category}
              </span>
            )}
            {post.title}
          </h1>

          <div className="tb-post-detail-author">
            <div className="tb-post-detail-avatar">{toAvatarChar(post.title)}</div>
            <div className="tb-post-detail-author-info">
              <span className="tb-post-detail-author-name">楼主</span>
              <span className="tb-post-detail-time">
                {date} {time}
              </span>
            </div>
          </div>
        </div>

        <PostContent
          content={post.content}
          coverImage={post.cover_image}
          coverAlt={post.title}
        />

        <div className="tb-post-detail-footer">
          <span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 4, verticalAlign: -2 }}>
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            {views} 次浏览
          </span>
          <span>{date} 发布</span>
          <Link
            href={`/posts/${post.id}/edit`}
            style={{ marginLeft: 'auto', color: '#2563eb', textDecoration: 'none', fontSize: '13px' }}
          >
            编辑
          </Link>
        </div>
      </div>

      <CommentSection postId={post.id} />
    </div>
  );
}
