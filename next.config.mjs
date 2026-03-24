/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  output: "export",
  basePath: "/crm-skybridge",
  assetPrefix: "/crm-skybridge",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
