/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: false, // Enable image optimization
    formats: ['image/avif', 'image/webp'], // Modern image formats
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'menuben-api.onrender.com',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: '*.vercel.app',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/**',
      },
    ],
  },
  // Compression enabled by default
  compress: true,
  // Production optimizations
  poweredByHeader: false,
  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://menuben-api.onrender.com',
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://menuben.com',
  },
}

module.exports = nextConfig
