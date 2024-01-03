/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,

    swcMinify: true,

    images: {
        unoptimized: true,
        domains: [],
    },

    output: 'standalone',
}

module.exports = nextConfig
