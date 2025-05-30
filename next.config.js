/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { dev, isServer }) => {
    // Optimize development experience
    if (dev && !isServer) {
      config.watchOptions = {
        ...config.watchOptions,
        ignored: ['**/node_modules', '**/.next'],
        aggregateTimeout: 300,
        poll: 1000,
      };
    }
    return config;
  },
};

module.exports = nextConfig; 