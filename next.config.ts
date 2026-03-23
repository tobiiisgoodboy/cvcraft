import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  serverExternalPackages: ['@react-pdf/renderer'],
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Mark @react-pdf/renderer as external on the server side
      const existing = config.externals || []
      config.externals = [
        ...(Array.isArray(existing) ? existing : [existing]),
        '@react-pdf/renderer',
      ]
    }
    return config
  },
}

export default nextConfig
