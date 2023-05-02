/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    PUBLIC_API_URL: 'https://api-sandbox.starlingbank.com/api',
    PUBLIC_API_VERSION: 'v2',
  },
}

module.exports = nextConfig
