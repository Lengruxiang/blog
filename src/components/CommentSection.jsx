'use client';
import { useState, useEffect } from 'react';

export default function CommentSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = async () => {
    const res = await fetch(`/api/comments?post_id=${postId}`);
    const data = await res.json();
    setComments(data);
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);
    await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ post_id: postId, author: author.trim() || '匿名', content }),
    });
    setContent('');
    setAuthor('');
    setSubmitting(false);
    fetchComments();
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-zinc-900 mb-4">
        评论 ({comments.length})
      </h3>

      <form onSubmit={handleSubmit} className="mb-6 space-y-3">
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="你的昵称（选填）"
          className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400 text-zinc-900"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="写下你的评论..."
          rows={3}
          className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm resize-y focus:outline-none focus:ring-2 focus:ring-zinc-400 text-zinc-900"
        />
        <button
          type="submit"
          disabled={submitting || !content.trim()}
          className="px-4 py-1.5 bg-zinc-900 text-white rounded-md text-sm font-medium hover:bg-zinc-800 disabled:opacity-50 transition-colors"
        >
          {submitting ? '提交中...' : '发表评论'}
        </button>
      </form>

      <div className="space-y-4">
        {comments.map((c) => (
          <div key={c.id} className="p-3 bg-zinc-50 rounded-md">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium text-zinc-700">{c.author}</span>
              <span className="text-xs text-zinc-400">
                {new Date(c.created_at).toLocaleDateString('zh-CN')}
              </span>
            </div>
            <p className="text-sm text-zinc-600">{c.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
