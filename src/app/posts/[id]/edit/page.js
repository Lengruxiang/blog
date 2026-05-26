'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import PostEditor from '@/components/PostEditor';
import Link from 'next/link';

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const [post, setPost] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/posts/${params.id}`)
      .then((r) => r.json())
      .then(setPost);
  }, [params.id]);

  const handleSave = async (data) => {
    setSaving(true);
    await fetch(`/api/posts/${params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    setSaving(false);
    router.push(`/posts/${params.id}`);
  };

  const handleDelete = async () => {
    if (!confirm('确定要删除这个帖子吗？')) return;
    await fetch(`/api/posts/${params.id}`, { method: 'DELETE' });
    router.push('/');
  };

  if (!post) {
    return (
      <div className="tb-main">
        <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>加载中...</div>
      </div>
    );
  }

  return (
    <div className="tb-main">
      <div className="tb-breadcrumb">
        <Link href="/">首页</Link>
        <span>/</span>
        <Link href={`/posts/${post.id}`}>帖子详情</Link>
        <span>/</span>
        <span style={{ color: '#374151' }}>编辑</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#1f2937', margin: 0 }}>
          编辑帖子
        </h1>
        <button onClick={handleDelete} className="tb-btn tb-btn-danger">
          删除帖子
        </button>
      </div>

      <PostEditor
        initialTitle={post.title}
        initialContent={post.content}
        initialCover={post.cover_image}
        onSave={handleSave}
        saving={saving}
        showCategory
      />
    </div>
  );
}
