'use client';
import { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';

function imgSrc(filename) {
  return filename?.startsWith('http') ? filename : `/api/uploads/${filename}`;
}

function insertAtCursor(textarea, text) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const before = textarea.value.substring(0, start);
  const after = textarea.value.substring(end);
  return before + text + after;
}

export default function PostEditor({ initialTitle = '', initialContent = '', initialCover = null, onSave, saving = false, showCategory = false }) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [coverImage, setCoverImage] = useState(initialCover);
  const [category, setCategory] = useState('');
  const [preview, setPreview] = useState(false);
  const [uploading, setUploading] = useState(false);
  const textareaRef = useRef(null);

  const handleFileUpload = async (e, insertToContent = false) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('photo', file);
    const res = await fetch('/api/photos', { method: 'POST', body: formData });
    const data = await res.json();
    setUploading(false);

    if (data.filename) {
      if (insertToContent) {
        const url = imgSrc(data.filename);
        const md = `![${file.name}](${url})`;
        const textarea = textareaRef.current;
        if (textarea) {
          const newContent = insertAtCursor(textarea, md + '\n');
          setContent(newContent);
          // restore cursor
          setTimeout(() => {
            const pos = textarea.selectionStart;
            textarea.focus();
            textarea.setSelectionRange(pos, pos);
          }, 0);
        } else {
          setContent((c) => c + (c ? '\n' : '') + md + '\n');
        }
      } else {
        setCoverImage(data.filename);
      }
    }
  };

  const insertBold = () => {
    const t = textareaRef.current;
    if (!t) return;
    const text = t.value.substring(t.selectionStart, t.selectionEnd) || '粗体文字';
    const md = `**${text}**`;
    setContent(insertAtCursor(t, md));
  };

  const insertHeading = () => {
    const t = textareaRef.current;
    if (!t) return;
    const newContent = insertAtCursor(t, '\n## ');
    setContent(newContent);
  };

  const insertLink = () => {
    const t = textareaRef.current;
    if (!t) return;
    const md = '[链接文字](https://)';
    setContent(insertAtCursor(t, md));
  };

  const insertCode = () => {
    const t = textareaRef.current;
    if (!t) return;
    const text = t.value.substring(t.selectionStart, t.selectionEnd) || 'code';
    const md = `\`\`\`\n${text}\n\`\`\``;
    setContent(insertAtCursor(t, md));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({
      title: title.trim(),
      content,
      cover_image: coverImage,
      category: showCategory ? category : undefined,
    });
  };

  const categories = ['生活', '技术', '游戏', '动漫', '音乐', '电影', '其他'];

  return (
    <form onSubmit={handleSubmit} className="tb-editor">
      <div className="tb-editor-title">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="输入帖子标题..."
          className="tb-editor-title-input"
          maxLength={100}
        />
      </div>

      {showCategory && (
        <div style={{ padding: '8px 20px', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', color: '#9ca3af', flexShrink: 0 }}>分类：</span>
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat === category ? '' : cat)}
                className={`tb-toolbar-btn ${category === cat ? 'active' : ''}`}
                style={{ fontSize: '12px', padding: '3px 10px' }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="tb-editor-toolbar">
        <label className="tb-toolbar-btn" title="插入图片">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          {uploading ? '上传中...' : '图片'}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileUpload(e, true)}
            style={{ display: 'none' }}
            disabled={uploading}
          />
        </label>

        <button type="button" className="tb-toolbar-btn" onClick={insertBold} title="加粗">
          <strong>B</strong>
        </button>

        <button type="button" className="tb-toolbar-btn" onClick={insertHeading} title="标题">
          H
        </button>

        <button type="button" className="tb-toolbar-btn" onClick={insertLink} title="插入链接">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
          链接
        </button>

        <button type="button" className="tb-toolbar-btn" onClick={insertCode} title="插入代码">
          &lt;/&gt;
        </button>
      </div>

      <div className="tb-editor-content">
        {preview ? (
          <div className="tb-editor-preview prose-custom">
            <ReactMarkdown>{content || '*暂无内容*'}</ReactMarkdown>
          </div>
        ) : (
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="分享你的想法... 支持 Markdown 格式，点击上方图片按钮插入图片"
            className="tb-editor-textarea"
          />
        )}
      </div>

      <div className="tb-editor-footer">
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setPreview(false)}
            className={`tb-toolbar-btn ${!preview ? 'active' : ''}`}
          >
            编辑
          </button>
          <button
            type="button"
            onClick={() => setPreview(true)}
            className={`tb-toolbar-btn ${preview ? 'active' : ''}`}
          >
            预览
          </button>

          <span style={{ color: '#e5e7eb', margin: '0 4px' }}>|</span>

          <label className="tb-toolbar-btn" title="上传封面图">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            封面
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload(e, false)}
              style={{ display: 'none' }}
              disabled={uploading}
            />
          </label>

          {coverImage && (
            <img src={imgSrc(coverImage)} alt="封面" className="tb-editor-cover-preview" />
          )}
        </div>

        <button
          type="submit"
          disabled={saving || !title.trim()}
          className="tb-btn tb-btn-primary"
          style={{ fontSize: '14px', padding: '8px 24px' }}
        >
          {saving ? '发布中...' : '发布帖子'}
        </button>
      </div>
    </form>
  );
}
