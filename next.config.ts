import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Skip static optimization for protected pages
  staticPageGenerationTimeout: 0,
}

export default nextConfig
