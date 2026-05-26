'use client';
import { useState } from 'react';

export default function PhotoUploader({ onUpload }) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);

    for (const file of files) {
      const formData = new FormData();
      formData.append('photo', file);
      await fetch('/api/photos', { method: 'POST', body: formData });
    }

    setUploading(false);
    e.target.value = '';
    onUpload?.();
  };

  return (
    <label className="tb-photo-upload-btn">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </svg>
      {uploading ? '上传中...' : '上传照片'}
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleUpload}
        style={{ display: 'none' }}
        disabled={uploading}
      />
    </label>
  );
}
