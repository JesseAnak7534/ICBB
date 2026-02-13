import React, { useState, useRef, useEffect } from 'react';

const LazyImage = ({ 
  src, 
  alt, 
  className = '', 
  style = {},
  placeholderColor = '#f3f4f6',
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '100px',
        threshold: 0.1
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const containerStyle = {
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: placeholderColor,
    ...style
  };

  const imgStyle = {
    opacity: isLoaded ? 1 : 0,
    transition: 'opacity 0.3s ease-in-out',
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  };

  return (
    <div ref={imgRef} className={className} style={containerStyle}>
      {isInView && (
        <img
          src={src}
          alt={alt}
          style={imgStyle}
          onLoad={() => setIsLoaded(true)}
          loading="lazy"
          {...props}
        />
      )}
      {!isLoaded && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '30px',
          height: '30px',
          border: '3px solid #e5e7eb',
          borderTopColor: '#0066cc',
          borderRadius: '50%',
          animation: 'lazyImageSpin 1s linear infinite'
        }} />
      )}
      <style>
        {`
          @keyframes lazyImageSpin {
            to { transform: translate(-50%, -50%) rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default LazyImage;
