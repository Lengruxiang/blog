'use client';
import { useState, useEffect } from 'react';
import PhotoUploader from '@/components/PhotoUploader';
import Link from 'next/link';

function imgSrc(filename) {
  return filename?.startsWith('http') ? filename : `/api/uploads/${filename}`;
}

export default function PhotosPage() {
  const [photos, setPhotos] = useState([]);

  const fetchPhotos = async () => {
    const res = await fetch('/api/photos');
    const data = await res.json();
    setPhotos(data);
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  return (
    <div className="tb-main">
      <div className="tb-breadcrumb">
        <Link href="/">首页</Link>
        <span>/</span>
        <span style={{ color: '#374151' }}>照片墙</span>
      </div>

      <div className="tb-photos-header">
        <h1 className="tb-photos-title">照片墙</h1>
        <PhotoUploader onUpload={fetchPhotos} />
      </div>

      {photos.length === 0 ? (
        <div className="tb-empty">
          <div className="tb-empty-icon">🖼️</div>
          <p className="tb-empty-text">还没有照片</p>
          <p style={{ fontSize: '13px', color: '#d1d5db' }}>点击上方按钮上传你的第一张照片</p>
        </div>
      ) : (
        <div className="tb-photo-grid">
          {photos.map((photo, i) => (
            <div key={photo.id} className="tb-photo-item" style={{ animationDelay: `${i * 30}ms` }}>
              <img
                src={imgSrc(photo.filename)}
                alt={photo.original_name}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
