import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'picsum.photos',
      'via.placeholder.com',
      'sample-videos.com', // se usi anche le thumbnail video di sample-videos
      'localhost'
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
