/** @type {import('next').NextConfig} */
import withBundleAnalyzer from '@next/bundle-analyzer';

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

  // Performance Budget
  experimental: {
    ...nextConfig.experimental,
    webVitalsAttribution: ['CLS', 'LCP'],
  },

  // Experimental features
  experimental: {
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
