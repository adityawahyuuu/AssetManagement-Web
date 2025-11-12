/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // For MVP development - skip static pre-rendering of error pages
  generateBuildId: async () => {
    // Custom build ID to avoid caching issues
    return new Date().getTime().toString()
  },
}

export default nextConfig
