'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import PostEditor from '@/components/PostEditor';

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
    if (!confirm('确定要删除这篇文章吗？')) return;
    await fetch(`/api/posts/${params.id}`, { method: 'DELETE' });
    router.push('/');
  };

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <p className="text-zinc-500">加载中...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-zinc-900">编辑文章</h1>
        <button
          onClick={handleDelete}
          className="px-4 py-1.5 text-red-600 border border-red-300 rounded-md text-sm hover:bg-red-50 transition-colors"
        >
          删除文章
        </button>
      </div>
      <PostEditor
        initialTitle={post.title}
        initialContent={post.content}
        onSave={handleSave}
        saving={saving}
      />
    </div>
  );
}
