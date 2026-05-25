'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me').then((r) => r.json()).then((d) => setAdmin(d.admin));
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setAdmin(false);
    window.location.href = '/';
  };

  return (
    <header className="bg-white border-b border-zinc-200 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-zinc-900 no-underline">
          我的博客
        </Link>
        <nav className="flex gap-1 items-center">
          <Link
            href="/"
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors no-underline ${
              pathname === '/'
                ? 'bg-zinc-100 text-zinc-900'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
            }`}
          >
            首页
          </Link>
          {admin && (
            <>
              <Link
                href="/posts/new"
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors no-underline ${
                  pathname === '/posts/new'
                    ? 'bg-zinc-100 text-zinc-900'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
                }`}
              >
                写文章
              </Link>
              <Link
                href="/photos"
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors no-underline ${
                  pathname === '/photos'
                    ? 'bg-zinc-100 text-zinc-900'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
                }`}
              >
                照片墙
              </Link>
            </>
          )}
          {admin ? (
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-md text-sm font-medium text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 transition-colors"
            >
              退出
            </button>
          ) : (
            <Link
              href="/login"
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors no-underline ${
                pathname === '/login'
                  ? 'bg-zinc-100 text-zinc-900'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
              }`}
            >
              登录
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
