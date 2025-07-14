const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 图片优化配置
  images: {
    domains: [
      'replicate.delivery',
      'pbxt.replicate.delivery',
      'uploadthing.com',
      'utfs.io',
      'lh3.googleusercontent.com',
      'avatars.githubusercontent.com',
    ],
    formats: ['image/webp', 'image/avif'],
  },

  // 实验性功能
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },

  // Webpack配置优化
  webpack: (config, { dev, isServer }) => {
    // 生产环境优化
    if (!dev && !isServer) {
      // 分离vendor包
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

      // 压缩配置
      config.optimization.minimize = true;
    }

    // 处理TensorFlow.js
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };

    return config;
  },

  // 压缩配置
  compress: true,

  // 输出配置
  output: 'standalone',

  // 重定向配置
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },

  // 头部配置
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
        ],
      },
    ];
  },

  // 环境变量
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // 页面优化
  onDemandEntries: {
    // 页面在内存中保持的时间（毫秒）
    maxInactiveAge: 25 * 1000,
    // 同时保持的页面数量
    pagesBufferLength: 2,
  },
};

module.exports = withBundleAnalyzer(nextConfig);
