import type { NextConfig } from 'next';
import createMDX from '@next/mdx';

const withMDX = createMDX({ extension: /\.mdx?$/ });

const nextConfig: NextConfig = {
  devIndicators: false,
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  ...(process.env.GITHUB_PAGES === 'true'
    ? { output: 'export' as const, trailingSlash: true }
    : {}),
};

export default withMDX(nextConfig);
