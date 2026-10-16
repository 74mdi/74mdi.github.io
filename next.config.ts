import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  devIndicators: false,
  ...(process.env.GITHUB_PAGES === 'true'
    ? { output: 'export' as const, basePath: '/74mdi', trailingSlash: true }
    : {}),
};

export default nextConfig;
