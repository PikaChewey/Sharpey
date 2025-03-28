/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Configure image domains for external images
  images: {
    domains: ['cdn.finviz.com', 'finnhub.io'],
    formats: ['image/avif', 'image/webp'],
  },
  // Proper cache settings to prevent corruption
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 4,
  },
  // Enable chunking optimization
  webpack: (config, { isServer }) => {
    // Optimize chunk loading
    config.optimization.splitChunks = {
      chunks: 'all',
      cacheGroups: {
        default: false,
        vendors: false,
        commons: {
          name: 'commons',
          chunks: 'all',
          minChunks: 2,
        },
        framework: {
          name: 'framework',
          chunks: 'all',
          test: /[\\/]node_modules[\\/](react|react-dom|framer-motion|chart\.js)[\\/]/,
          priority: 40,
        },
      },
    };
    
    // Fix bootstrap script issue
    if (!isServer) {
      config.optimization.runtimeChunk = {
        name: 'runtime',
      };
    }
    
    return config;
  },
  // Disable experimental features
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Add proper redirects
  async redirects() {
    return [
      {
        source: '/game',
        destination: '/#game',
        permanent: true,
      },
    ];
  },
  // Add proper rewrites
  async rewrites() {
    return [];
  },
  // Disable unnecessary features in production
  poweredByHeader: false,
}

module.exports = nextConfig 