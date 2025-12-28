import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for optimal Vercel deployment
  output: 'standalone',

  // Ensure proper handling of trailing slashes
  trailingSlash: false,


  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
