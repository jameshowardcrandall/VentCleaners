import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  // Ensure API routes from /api directory work alongside Next.js
  async rewrites() {
    return {
      beforeFiles: [
        // Keep existing serverless functions in /api directory
        {
          source: '/api/:path*',
          destination: '/api/:path*',
        },
      ],
    };
  },
};

export default nextConfig;
