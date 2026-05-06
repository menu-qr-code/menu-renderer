import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/ossidiana-menu",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
