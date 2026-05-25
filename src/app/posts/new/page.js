'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PostEditor from '@/components/PostEditor';

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
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-zinc-900 mb-6">写文章</h1>
      <PostEditor onSave={handleSave} saving={saving} />
    </div>
  );
}
