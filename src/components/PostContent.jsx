'use client';
import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

function imgSrc(filename) {
  if (!filename) return '';
  if (filename.startsWith('http') || filename.startsWith('data:')) return filename;
  return `/api/uploads/${filename}`;
}

export default function PostContent({ content, coverImage, coverAlt }) {
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') setLightbox(null); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const MarkdownImage = ({ src, alt }) => (
    <img
      src={imgSrc(src)}
      alt={alt || ''}
      onClick={() => setLightbox({ src: imgSrc(src), alt: alt || '' })}
      style={{ cursor: 'zoom-in', maxWidth: '100%', borderRadius: 6, margin: '10px 0' }}
      loading="lazy"
    />
  );

  return (
    <>
      {coverImage && (
        <img
          src={imgSrc(coverImage)}
          alt={coverAlt || ''}
          onClick={() => setLightbox({ src: imgSrc(coverImage), alt: coverAlt || '封面' })}
          style={{
            width: '100%',
            maxHeight: '400px',
            objectFit: 'cover',
            display: 'block',
            cursor: 'zoom-in',
          }}
        />
      )}

      <div className="tb-post-detail-body prose-custom">
        <ReactMarkdown
          components={{
            img: MarkdownImage,
          }}
        >
          {content}
        </ReactMarkdown>
      </div>

      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.85)',
            zIndex: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'zoom-out',
            padding: 20,
          }}
        >
          <button
            onClick={() => setLightbox(null)}
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
            src={lightbox.src}
            alt={lightbox.alt}
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
            {lightbox.alt}
          </div>
        </div>
      )}
    </>
  );
}
