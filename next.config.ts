import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    // Enable Fast Refresh
    config.optimization.moduleIds = 'named';
    return config;
  },
  // Enable static optimization
  swcMinify: true,
  // Configure compiler for faster refresh
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

export default nextConfig;
