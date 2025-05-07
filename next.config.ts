import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1) don’t fail builds on ESLint errors
  eslint: {
    ignoreDuringBuilds: true,
  },
  // 2) don’t fail builds on TypeScript errors
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
