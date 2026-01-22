/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  output: "export",
  basePath: "/crm-skybridge",
  assetPrefix: "/crm-skybridge",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
