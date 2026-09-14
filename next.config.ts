import type {NextConfig} from 'next'

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 90],
    remotePatterns: [
      {protocol: 'https', hostname: 'cdn.shopify.com'},
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
  agentRules: false,
}

export default nextConfig
