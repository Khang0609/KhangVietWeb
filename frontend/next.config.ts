import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      { protocol: "https", hostname: "khang-viet-design.up.railway.app" },
      {
        protocol: "http",
        hostname: "localhost", // Nếu chạy local
        port: "8000", // Cổng của backend
      },
    ],
  },
  turbopack: {},
  typescript: {
    // !! CẢNH BÁO !!
    // Cho phép build hoàn tất ngay cả khi dự án có lỗi TypeScript.
    ignoreBuildErrors: true,
  },
  webpack: (config) => {
    config.watchOptions = {
      poll: 1000, // Poll every 1s
      aggregateTimeout: 300,
    };
    return config;
  },
};

export default nextConfig;
