/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Disable static generation for development/MVP - pages need dynamic rendering
  experimental: {
    isrMemoryCacheSize: 0,
  },
  // Skip static optimization during build for pages with dynamic requirements
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 5,
  },
  output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,
}

export default nextConfig
