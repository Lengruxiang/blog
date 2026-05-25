'use client';
import { useState, useEffect } from 'react';
import PhotoUploader from '@/components/PhotoUploader';

function imgSrc(filename) {
  return filename?.startsWith('http') ? filename : `/uploads/${filename}`;
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
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-zinc-900 mb-6">照片墙</h1>
      <PhotoUploader onUpload={fetchPhotos} />

      {photos.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-zinc-500 text-lg">还没有照片，点击上方按钮上传</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="aspect-square rounded-lg overflow-hidden border border-zinc-200 bg-white"
            >
              <img
                src={imgSrc(photo.filename)}
                alt={photo.original_name}
                className="w-full h-full object-cover hover:scale-105 transition-transform"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
