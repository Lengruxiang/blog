'use client';
import { useState, useEffect } from 'react';

function toAvatarChar(name) {
  return (name || '匿')[0];
}

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
    <div className="tb-comments">
      <div className="tb-comments-header">
        回复 ({comments.length})
      </div>

      <div className="tb-comments-list">
        {comments.map((c, i) => (
          <div key={c.id} className="tb-comment-item">
            <div className="tb-comment-floor">{i + 1}楼</div>
            <div className="tb-comment-avatar">{toAvatarChar(c.author)}</div>
            <div className="tb-comment-body">
              <div>
                <span className="tb-comment-author">{c.author}</span>
                <span className="tb-comment-time">
                  {new Date(c.created_at).toLocaleDateString('zh-CN', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                  })}{' '}
                  {new Date(c.created_at).toLocaleTimeString('zh-CN', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              <div className="tb-comment-text">{c.content}</div>
            </div>
          </div>
        ))}

        {comments.length === 0 && (
          <div style={{ padding: '32px', textAlign: 'center', color: '#d1d5db', fontSize: '14px' }}>
            暂无回复，来说点什么吧
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="tb-comment-form">
        <div className="tb-comment-input-wrap">
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="昵称（选填）"
            className="tb-input"
            maxLength={20}
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="写下你的回复..."
            rows={3}
            className="tb-input"
          />
        </div>
        <button
          type="submit"
          disabled={submitting || !content.trim()}
          className="tb-btn-submit"
        >
          {submitting ? '提交中' : '发表'}
        </button>
      </form>
    </div>
  );
}
