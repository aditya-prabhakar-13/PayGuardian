const isExport = process.env.OUTPUT_MODE === "export";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: isExport,
  },
  ...(isExport ? { output: "export" } : {})
};

export default nextConfig;
