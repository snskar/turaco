import type { NextConfig } from 'next';

// Bundle analyzer setup
// eslint-disable-next-line @typescript-eslint/no-require-imports
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  // Production optimizations
  compress: true,

  // Bundle optimization
  webpack: (config, { dev, isServer }) => {
    // Enable Fast Refresh in development
    if (dev && !isServer) {
      config.optimization.moduleIds = 'named';
    }

    // Prevent confetti libraries from being bundled server-side
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push(
        'canvas-confetti',
        'react-dom-confetti',
        'dom-confetti'
      );
    }

    // Production optimizations (client-only)
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            enforce: true,
          },
        },
      };
    }

    return config;
  },

  // Enhanced compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
    reactRemoveProperties: process.env.NODE_ENV === 'production',
  },

  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    domains: ['res.cloudinary.com', 'picsum.photos'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        pathname: '/**',
      },
    ],
    // Enable local image optimization
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Performance headers
  async headers() {
    return [
      {
        source: '/assets/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // Experimental features for performance
  experimental: {},

  // Turbopack configuration (stable)
  turbopack: {
    resolveAlias: {
      underscore: 'lodash',
      mocha: { browser: 'mocha/browser-entry.js' },
    },
  },
};

export default withBundleAnalyzer(nextConfig);
