import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Image optimization
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [],
  },

  // Compression
  compress: true,

  // Power by header
  poweredByHeader: false,

  // Webpack configuration for Solana
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    config.resolve.symlinks = true;
    return config;
  },

  // Turbopack configuration
  turbopack: {
    resolveAlias: {
      "@": "./src",
    },
    root: __dirname,
  },
};

export default nextConfig;
