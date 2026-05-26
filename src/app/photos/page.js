'use client';
import { useState, useEffect, useCallback } from 'react';
import PhotoUploader from '@/components/PhotoUploader';
import Link from 'next/link';

function imgSrc(filename) {
  if (!filename) return '';
  if (filename.startsWith('http') || filename.startsWith('data:')) return filename;
  return `/api/uploads/${filename}`;
}

export default function PhotosPage() {
  const [photos, setPhotos] = useState([]);
  const [admin, setAdmin] = useState(false);
  const [lightbox, setLightbox] = useState(null);

  const fetchPhotos = async () => {
    const res = await fetch('/api/photos');
    const data = await res.json();
    setPhotos(data);
  };

  useEffect(() => {
    fetchPhotos();
    fetch('/api/auth/me').then((r) => r.json()).then((d) => setAdmin(d.admin));
  }, []);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') setLightbox(null); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const openLightbox = (photo) => setLightbox(photo);
  const closeLightbox = () => setLightbox(null);

  return (
    <div className="tb-main">
      <div className="tb-breadcrumb">
        <Link href="/">首页</Link>
        <span>/</span>
        <span style={{ color: '#374151' }}>照片墙</span>
      </div>

      <div className="tb-photos-header">
        <h1 className="tb-photos-title">照片墙</h1>
        {admin && <PhotoUploader onUpload={fetchPhotos} />}
      </div>

      {photos.length === 0 ? (
        <div className="tb-empty">
          <div className="tb-empty-icon">🖼️</div>
          <p className="tb-empty-text">还没有照片</p>
          {admin && <p style={{ fontSize: '13px', color: '#d1d5db' }}>点击上方按钮上传你的第一张照片</p>}
        </div>
      ) : (
        <div className="tb-photo-grid">
          {photos.map((photo, i) => (
            <div
              key={photo.id}
              className="tb-photo-item"
              style={{ animationDelay: `${i * 30}ms` }}
              onClick={() => openLightbox(photo)}
            >
              <img
                src={imgSrc(photo.filename)}
                alt={photo.original_name}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      )}

      {lightbox && (
        <div
          onClick={closeLightbox}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.85)',
            zIndex: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'zoom-out',
            padding: '20px',
          }}
        >
          <button
            onClick={closeLightbox}
            style={{
              position: 'absolute',
              top: 16,
              right: 24,
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.15)',
              color: '#fff',
              border: 'none',
              fontSize: 24,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1,
            }}
          >
            &times;
          </button>

          <img
            src={imgSrc(lightbox.filename)}
            alt={lightbox.original_name}
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '90vw',
              maxHeight: '90vh',
              objectFit: 'contain',
              borderRadius: 8,
              cursor: 'default',
            }}
          />

          <div style={{
            position: 'absolute',
            bottom: 20,
            color: 'rgba(255,255,255,0.7)',
            fontSize: 13,
          }}>
            {lightbox.original_name}
          </div>
        </div>
      )}
    </div>
  );
}
