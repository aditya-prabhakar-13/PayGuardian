import type { NextConfig } from "next";

const isExport = process.env.OUTPUT_MODE === "export";

const nextConfig: NextConfig = {
  // next/image optimisation requires a server — disable for static export
  images: {
    unoptimized: isExport,
  },
};

if (isExport) {
  nextConfig.output = "export";
}

export default nextConfig;
