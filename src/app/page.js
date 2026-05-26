import { getAllPosts, getTotalPostsCount } from '@/lib/db';
import PostCard from '@/components/PostCard';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function Home({ searchParams }) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page) || 1);
  const category = sp.category || '';
  const limit = 15;

  const [posts, total] = await Promise.all([
    getAllPosts({ page, limit, category }),
    getTotalPostsCount(category),
  ]);

  const totalPages = Math.ceil(total / limit);

  const categories = ['', '生活', '技术', '游戏', '动漫', '音乐', '电影', '其他'];

  return (
    <div className="tb-main">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', alignItems: 'center' }}>
          {categories.map((cat) => {
            const label = cat || '全部';
            const href = cat ? `/?category=${cat}` : '/';
            const isActive = category === cat || (!cat && !category);
            return (
              <Link
                key={cat}
                href={href}
                className={`tb-toolbar-btn${isActive ? ' active' : ''}`}
                style={{ fontSize: '13px', fontWeight: isActive ? 600 : 400 }}
              >
                {label}
              </Link>
            );
          })}
        </div>
        <Link href="/posts/new" className="tb-btn tb-btn-primary" style={{ fontSize: '13px' }}>
          发帖
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="tb-empty">
          <div className="tb-empty-icon">📝</div>
          <p className="tb-empty-text">还没有帖子</p>
          <Link href="/posts/new" className="tb-btn tb-btn-primary" style={{ textDecoration: 'none' }}>
            发布第一个帖子
          </Link>
        </div>
      ) : (
        <>
          <div className="tb-post-list">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="tb-pagination">
              <Link
                href={`/?page=${page - 1}${category ? `&category=${category}` : ''}`}
                className="tb-page-btn"
                style={{ pointerEvents: page <= 1 ? 'none' : 'auto' }}
                aria-disabled={page <= 1}
              >
                &laquo;
              </Link>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`/?page=${p}${category ? `&category=${category}` : ''}`}
                  className={`tb-page-btn${p === page ? ' active' : ''}`}
                >
                  {p}
                </Link>
              ))}

              <Link
                href={`/?page=${page + 1}${category ? `&category=${category}` : ''}`}
                className="tb-page-btn"
                style={{ pointerEvents: page >= totalPages ? 'none' : 'auto' }}
                aria-disabled={page >= totalPages}
              >
                &raquo;
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}
