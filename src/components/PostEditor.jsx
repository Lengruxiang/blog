'use client';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

function imgSrc(filename) {
  return filename?.startsWith('http') ? filename : `/uploads/${filename}`;
}

export default function PostEditor({ initialTitle = '', initialContent = '', onSave, saving = false }) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [coverImage, setCoverImage] = useState(null);
  const [preview, setPreview] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('photo', file);
    const res = await fetch('/api/photos', { method: 'POST', body: formData });
    const data = await res.json();
    if (data.filename) {
      setCoverImage(data.filename);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({ title: title.trim(), content, cover_image: coverImage });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="文章标题"
          className="w-full text-2xl font-bold px-4 py-3 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-400 text-zinc-900"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm text-zinc-500 mb-2">封面图片（可选）</label>
        <input type="file" accept="image/*" onChange={handleImageUpload} className="text-sm" />
        {coverImage && (
          <img src={imgSrc(coverImage)} alt="封面预览" className="mt-2 h-32 rounded-md" />
        )}
      </div>

      <div className="mb-4 border border-zinc-200 rounded-lg overflow-hidden">
        <div className="flex border-b border-zinc-200 bg-zinc-50">
          <button
            type="button"
            onClick={() => setPreview(false)}
            className={`px-4 py-2 text-sm font-medium ${!preview ? 'bg-white text-zinc-900 border-r border-zinc-200' : 'text-zinc-500'}`}
          >
            编辑
          </button>
          <button
            type="button"
            onClick={() => setPreview(true)}
            className={`px-4 py-2 text-sm font-medium ${preview ? 'bg-white text-zinc-900' : 'text-zinc-500'}`}
          >
            预览
          </button>
        </div>

        {preview ? (
          <div className="p-4 min-h-[300px] prose prose-zinc max-w-none">
            <ReactMarkdown>{content || '暂无内容'}</ReactMarkdown>
          </div>
        ) : (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="使用 Markdown 书写..."
            className="w-full p-4 min-h-[300px] resize-y focus:outline-none text-zinc-900 font-mono text-sm"
          />
        )}
      </div>

      <button
        type="submit"
        disabled={saving || !title.trim()}
        className="px-6 py-2.5 bg-zinc-900 text-white rounded-lg font-medium hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {saving ? '保存中...' : '发布'}
      </button>
    </form>
  );
}
