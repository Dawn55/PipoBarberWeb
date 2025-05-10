/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'placekitten.com', 'placehold.co','example.com',"i.imgur.com","www.instagram.com"],
  },
  experimental: {
    serverActions: true,
  },
};

export default nextConfig;