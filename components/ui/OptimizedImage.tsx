'use client';

import React from 'react';
import Image from 'next/image';
import { getCloudinaryUrl, assetToCloudinaryId } from '@/lib/cloudinary';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  loading?: 'lazy' | 'eager';
  quality?: number;
  style?: React.CSSProperties;
  draggable?: boolean;
  useCloudinary?: boolean; // Option to disable CDN for specific images
}

/**
 * Optimized Image component with CDN integration and performance best practices
 * - Automatic Cloudinary CDN usage for better performance
 * - WebP/AVIF format conversion
 * - Proper loading strategies
 * - Hardware acceleration hints
 * - Mobile-optimized quality settings
 */
const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  fill = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  priority = false,
  loading = 'lazy',
  quality = 80,
  style = {},
  draggable = false,
  useCloudinary = true,
  ...props
}) => {
  // Determine the image source - use CDN if available and enabled
  const imageSrc = React.useMemo(() => {
    // Don't use CDN for external URLs or if disabled
    if (
      !useCloudinary ||
      src.startsWith('http') ||
      !src.startsWith('/assets')
    ) {
      return src;
    }

    // Convert local asset path to Cloudinary URL
    const publicId = assetToCloudinaryId(src);
    return getCloudinaryUrl(publicId, {
      width: fill ? undefined : width,
      height: fill ? undefined : height,
      quality: priority ? 'auto' : 'auto', // Better quality for priority images
      format: 'auto', // Automatic format selection (WebP, AVIF, etc.)
      dpr: 'auto', // Automatic device pixel ratio
    });
  }, [src, useCloudinary, width, height, fill, priority]);

  // Enhanced style with performance optimizations
  const optimizedStyle: React.CSSProperties = {
    ...style,
    willChange: 'transform',
    backfaceVisibility: 'hidden',
    WebkitBackfaceVisibility: 'hidden',
    transform: style.transform || 'translate3d(0,0,0)',
  };

  return (
    <Image
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      fill={fill}
      className={`select-none pointer-events-none ${className}`}
      style={optimizedStyle}
      sizes={sizes}
      priority={priority}
      loading={loading}
      quality={quality}
      draggable={draggable}
      {...props}
    />
  );
};

export default OptimizedImage;
