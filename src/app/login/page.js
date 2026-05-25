'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

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
    <div className="max-w-md mx-auto px-4 py-20">
      <h1 className="text-2xl font-bold text-zinc-900 mb-2 text-center">管理员登录</h1>
      <p className="text-sm text-zinc-500 mb-8 text-center">输入密码以管理博客内容</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="请输入管理员密码"
          autoFocus
          className="w-full px-4 py-3 border border-zinc-200 rounded-lg text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-400"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading || !password}
          className="w-full py-3 bg-zinc-900 text-white rounded-lg font-medium hover:bg-zinc-800 disabled:opacity-50 transition-colors"
        >
          {loading ? '登录中...' : '登录'}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-zinc-400">
        默认密码在 <code className="bg-zinc-100 px-1.5 py-0.5 rounded">.env.local</code> 中配置
      </p>
    </div>
  );
}
