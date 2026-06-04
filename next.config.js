/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    config.resolve.alias.canvas = false
    if (isServer) {
      config.externals.push('pdfjs-dist')
    }
    return config
  },
  experimental: {
    serverComponentsExternalPackages: ['pdfjs-dist'],
  },
}

module.exports = nextConfig
