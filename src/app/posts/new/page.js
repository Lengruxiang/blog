'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PostEditor from '@/components/PostEditor';
import Link from 'next/link';

export default function NewPostPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const handleSave = async (data) => {
    setSaving(true);
    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const post = await res.json();
    setSaving(false);
    router.push(`/posts/${post.id}`);
  };

  return (
    <div className="tb-main">
      <div className="tb-breadcrumb">
        <Link href="/">首页</Link>
        <span>/</span>
        <span style={{ color: '#374151' }}>发帖</span>
      </div>

      <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#1f2937', marginBottom: '16px' }}>
        发布新帖
      </h1>

      <PostEditor onSave={handleSave} saving={saving} showCategory />
    </div>
  );
}
