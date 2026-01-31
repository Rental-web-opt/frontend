/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... vous avez peut-être d'autres configurations ici ...
/** @type {import('next').NextConfig} */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**', 
      },
    ],
  },
};

module.exports = nextConfig;