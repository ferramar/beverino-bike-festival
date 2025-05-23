import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'picsum.photos',
      'via.placeholder.com',
      'sample-videos.com', // se usi anche le thumbnail video di sample-videos
      // aggiungi qui altri host esterni che utilizzi
    ],
  },
};

export default nextConfig;
