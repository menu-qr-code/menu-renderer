import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/cenere-menu",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
