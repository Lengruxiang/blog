'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me').then((r) => r.json()).then((d) => setAdmin(d.admin));
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setAdmin(false);
    router.push('/');
  };

  const isActive = (path) => pathname === path;

  return (
    <header className="tb-header">
      <div className="tb-header-inner">
        <Link href="/" className="tb-logo">
          <span className="tb-logo-icon">B</span>
          我的博客
        </Link>

        <nav className="tb-nav">
          <Link href="/" className={`tb-nav-link${isActive('/') ? ' active' : ''}`}>
            首页
          </Link>

          {admin && (
            <>
              <Link
                href="/posts/new"
                className={`tb-nav-link${isActive('/posts/new') ? ' active' : ''}`}
              >
                发帖
              </Link>
              <Link
                href="/photos"
                className={`tb-nav-link${isActive('/photos') ? ' active' : ''}`}
              >
                相册
              </Link>
            </>
          )}

          {admin ? (
            <button onClick={handleLogout} className="tb-btn tb-btn-outline">
              退出
            </button>
          ) : (
            <Link
              href="/login"
              className={`tb-nav-link${isActive('/login') ? ' active' : ''}`}
            >
              登录
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
