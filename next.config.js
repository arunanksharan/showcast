/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  // images: {
  //   domains: ['i.imgur.com'],
  // },
  remotePatterns: [
    {
      protocol: 'https',
      hostname: '**',
    },
  ],
};

module.exports = nextConfig;
