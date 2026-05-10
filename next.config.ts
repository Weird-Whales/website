import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    viewTransition: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        pathname: "/Weird-Whales/images/**",
      },
      {
        protocol: "https",
        hostname: "github.com",
        pathname: "/Weird-Whales/images/**",
      },
    ],
  },
};

export default nextConfig;
