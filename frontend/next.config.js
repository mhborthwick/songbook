/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // https://nextjs.org/docs/advanced-features/output-file-tracing#automatically-copying-traced-files
  output: "standalone",
};

module.exports = nextConfig;
