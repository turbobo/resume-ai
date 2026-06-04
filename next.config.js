/** @type {import('next').NextConfig} */
const nextConfig = {
  // pdfjs worker 配置
  webpack: (config) => {
    config.resolve.alias.canvas = false
    return config
  },
}

module.exports = nextConfig
