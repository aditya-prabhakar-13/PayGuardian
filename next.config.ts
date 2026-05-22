import type { NextConfig } from "next";

const isExport = process.env.OUTPUT_MODE === "export";

const nextConfig: NextConfig = {
  output: isExport ? "export" : undefined,

  // next/image optimisation requires a server — disable for static export
  images: {
    unoptimized: isExport,
  },
};

export default nextConfig;
