/** @type {import('next').NextConfig} */
import withBundleAnalyzer from '@next/bundle-analyzer';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const nextConfig = {
  // Images
  images: {
    unoptimized: true,
  },

  // React
  reactStrictMode: process.env.NODE_ENV !== 'production',

  // Build
  trailingSlash: false,
  staticPageGenerationTimeout: 800,
  output: 'export',

  // Performance
  poweredByHeader: false,
  compress: true,

  // Experimental features
  experimental: {
    webVitalsAttribution: ['CLS', 'LCP'],
    optimizePackageImports: ['@mui/material', '@mui/icons-material'],
  },

  // Environment
  env: {
    LOCAL_SEARCH_ENGINE: process.env.LOCAL_SEARCH_ENGINE,
    LOCAL_INDEXES: process.env.LOCAL_INDEXES,
  },

  // Webpack
  webpack: (config, { dev, isServer }) => {
    // Optimize for production
    if (!dev && !isServer) {
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: 10,
        },
      };
    }

    // 为服务器端提供 DOMMatrix polyfill（react-pdf 需要）
    // Provide DOMMatrix polyfill for server-side (required by react-pdf)
    if (isServer) {
      const polyfillPath = path.resolve(__dirname, 'polyfills/dommatrix.js');
      
      // 在服务器端入口点之前注入 polyfill
      // Inject polyfill before server-side entry points
      const originalEntry = config.entry;
      config.entry = async () => {
        const entries = await originalEntry();
        
        // 为所有入口点添加 polyfill
        // Add polyfill to all entry points
        Object.keys(entries).forEach((key) => {
          if (Array.isArray(entries[key])) {
            entries[key].unshift(polyfillPath);
          } else if (typeof entries[key] === 'string') {
            entries[key] = [polyfillPath, entries[key]];
          }
        });
        
        return entries;
      };
    }

    // Add custom loaders
    config.module.rules.push(
      {
        test: /\.md$/,
        use: 'raw-loader',
      },
      {
        test: /\.json$/,
        use: 'json-loader',
      },
    );

    return config;
  },
};

export default withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})(nextConfig)
