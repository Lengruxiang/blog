'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    setLoading(false);

    if (res.ok) {
      router.push('/');
      router.refresh();
    } else {
      setError('密码错误，请重试');
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 200px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="tb-login-card">
        <div className="tb-login-title">管理员登录</div>
        <div className="tb-login-subtitle">输入密码以管理博客内容</div>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="请输入管理员密码"
            autoFocus
            className="tb-login-input"
          />

          {error && (
            <p style={{ color: '#ef4444', fontSize: '13px', marginBottom: '12px' }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="tb-login-btn"
          >
            {loading ? '登录中...' : '登录'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Link href="/" style={{ fontSize: '13px', color: '#9ca3af', textDecoration: 'none' }}>
            &larr; 返回首页
          </Link>
        </div>
      </div>
    </div>
  );
}
