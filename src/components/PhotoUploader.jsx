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
    onUpload?.();
  };

  return (
    <div className="mb-6">
      <label className="inline-block px-4 py-2 bg-zinc-900 text-white rounded-lg font-medium text-sm hover:bg-zinc-800 cursor-pointer transition-colors">
        {uploading ? '上传中...' : '上传照片'}
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleUpload}
          className="hidden"
          disabled={uploading}
        />
      </label>
    </div>
  );
}
