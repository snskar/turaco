/**
 * Cloudinary Image Optimization Utilities
 * Provides automatic image optimization, format conversion, and CDN delivery
 */

export interface CloudinaryOptions {
  width?: number;
  height?: number;
  quality?: number | 'auto';
  format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png';
  crop?: 'fill' | 'fit' | 'scale' | 'pad';
  gravity?: 'auto' | 'center' | 'face' | 'faces';
  dpr?: number | 'auto';
}

/**
 * Generate Cloudinary URL with optimizations for mobile performance
 */
export function getCloudinaryUrl(
  publicId: string,
  options: CloudinaryOptions = {}
): string {
  const {
    width,
    height,
    quality = 'auto',
    format = 'auto',
    crop = 'fill',
    gravity = 'auto',
    dpr = 'auto',
  } = options;

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  if (!cloudName) {
    console.warn(
      'NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME not set, falling back to local images'
    );
    return publicId.startsWith('/') ? publicId : `/${publicId}`;
  }

  // Build transformation string
  const transformations: string[] = [];

  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  if (crop) transformations.push(`c_${crop}`);
  if (gravity && crop !== 'scale') transformations.push(`g_${gravity}`);
  if (quality) transformations.push(`q_${quality}`);
  if (format) transformations.push(`f_${format}`);
  if (dpr) transformations.push(`dpr_${dpr}`);

  // Add mobile-specific optimizations
  transformations.push('fl_progressive'); // Progressive JPEG
  transformations.push('fl_immutable_cache'); // Better caching

  const transformationString = transformations.join(',');

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformationString}/${publicId}`;
}

/**
 * Get optimized image URL for different screen sizes
 */
export function getResponsiveImageUrl(
  publicId: string,
  baseWidth: number = 800
) {
  return {
    mobile: getCloudinaryUrl(publicId, {
      width: Math.floor(baseWidth * 0.5),
      quality: 'auto',
      dpr: 'auto',
    }),
    tablet: getCloudinaryUrl(publicId, {
      width: Math.floor(baseWidth * 0.75),
      quality: 'auto',
      dpr: 'auto',
    }),
    desktop: getCloudinaryUrl(publicId, {
      width: baseWidth,
      quality: 'auto',
      dpr: 'auto',
    }),
  };
}

/**
 * Convert local asset path to Cloudinary public ID
 * Maps to actual Cloudinary upload structure
 */
export function assetToCloudinaryId(assetPath: string): string {
  // Extract just the filename without path and extension
  const filename =
    assetPath
      .split('/')
      .pop() // Get last part (filename)
      ?.replace(/\.[^/.]+$/, '') || ''; // Remove extension

  // Map common asset names to their Cloudinary IDs
  const assetMapping: Record<string, string> = {
    // Art assets
    drop: 'drop_rqho5h',
    hamster: 'hamster_cyuwl8',
    jar: 'jar_nfm4ar',
    cat: 'cat_etylpa',
    cat2: 'cat2_REPLACE_ME', // Add if you have this asset
    papa_bear: 'papa_bear_fi7p3h',

    // Cloud assets (also handle different naming variations)
    cloud1: 'cloud1_mitzrk',
    cloud2: 'cloud2_izwoys',
    cloud3: 'cloud3_uysybq',
    cloud4: 'cloud4_ie4qik',
    cloud5: 'cloud5_xo97qk',
    cloud6: 'cloud6_ej3lhu',
    clouds1: 'cloud1_mitzrk', // Alternative naming
    clouds2: 'cloud2_izwoys', // Alternative naming
    clouds3: 'cloud3_uysybq', // Alternative naming
    clouds4: 'cloud4_ie4qik', // Alternative naming
    clouds5: 'cloud5_xo97qk', // Alternative naming
    clouds6: 'cloud6_ej3lhu', // Alternative naming
    clouds_v1: 'clouds_v1_o4lbjo',
    clouds_v2: 'clouds_v2_xn2m63',

    // UI assets
    play: 'play_a2metj',
    replay: 'replay_gxppz0',
    'win-pointer': 'win-pointer_lnea42',

    // Branding assets
    'turaco-logo': 'turaco-logo_tgd6o2',
    'heartlink-logo-2': 'IMG_0065_hvkgko',
    favicon: 'favicon_wsyssq',
    'apple-touch-icon': 'apple-touch-icon_lsr2zx',
    'android-chrome-192x192': 'android-chrome-192x192_fh92fd',
    'android-chrome-512x512': 'android-chrome-512x512_wlsdic',

    // Card assets
    card_2_front: 'card_2_front_mv29yx',
  };

  // Return mapped ID or fallback to original filename
  const mappedId = assetMapping[filename];
  if (mappedId) {
    return mappedId;
  }

  // Fallback: warn about missing mapping in development
  if (process.env.NODE_ENV === 'development') {
    console.warn(
      `⚠️ No Cloudinary mapping found for: ${filename}. Add it to assetMapping in lib/cloudinary.ts`
    );
  }

  return filename;
}

/**
 * Alternative: Try folder structure mapping
 */
export function assetToCloudinaryIdAlt(assetPath: string): string {
  const cleanPath = assetPath
    .replace(/^\//, '') // Remove leading slash
    .replace(/\.[^/.]+$/, ''); // Remove file extension

  // Try folder structure approach
  return `heartlink-app/${cleanPath}`;
}

/**
 * Preload critical images for faster loading
 */
export function preloadCloudinaryImage(
  publicId: string,
  options: CloudinaryOptions = {}
) {
  if (typeof window === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = getCloudinaryUrl(publicId, options);
  document.head.appendChild(link);
}
