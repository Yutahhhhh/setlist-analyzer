/** @type {import('next').NextConfig} */
const path = require('path')

const nextConfig = {
  output: 'export',
  reactStrictMode: false,
  trailingSlash: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
