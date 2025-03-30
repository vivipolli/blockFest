/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    ...(process.env.NODE_ENV === 'development' && {
      reactRemoveProperties: { properties: ['^data-gr-.*$'] },
    }),
  },
  images: {
    domains: ['ipfs.io'],
  },
}

export default nextConfig
