/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  output: 'export',
  images: { unoptimized: true },
  basePath: '/wfx-prototype-hub',
};

export default nextConfig;