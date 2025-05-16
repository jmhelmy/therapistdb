// next.config.ts
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
  // 3) allow external images
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.goodtherapy.org",
        pathname: "/**", // Allow any path under this hostname
      },
      // --- ADD THIS NEW PATTERN FOR PSYCHOLOGY TODAY ---
      {
        protocol: "https",
        hostname: "photos.psychologytoday.com",
        // port: '', // Usually empty for default https port 443 - optional
        pathname: "/**", // Allow any path under this hostname
      },
      // --- END OF ADDITION ---
      // You can add more patterns here if needed in the future
      // {
      //   protocol: "https",
      //   hostname: "another-image-host.com",
      //   pathname: "/**",
      // },
    ],
  },
};

export default nextConfig;