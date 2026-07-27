import type { NextConfig } from 'next'
import { execSync } from 'node:child_process'

function getCommitSha(): string {
  if (process.env.VERCEL_GIT_COMMIT_SHA) return process.env.VERCEL_GIT_COMMIT_SHA
  try {
    return execSync('git rev-parse HEAD').toString().trim()
  } catch {
    return 'dev'
  }
}

const nextConfig: NextConfig = {
  serverExternalPackages: ['@react-pdf/renderer'],
  env: {
    NEXT_PUBLIC_COMMIT_SHA: getCommitSha(),
    NEXT_PUBLIC_BUILD_TIME: new Date().toISOString(),
    NEXT_PUBLIC_DEPLOY_ENV: process.env.VERCEL_ENV || 'development',
  },
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
