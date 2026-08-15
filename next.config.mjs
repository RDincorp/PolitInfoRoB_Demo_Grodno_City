const repoName = 'PolitInfoRoB_Demo_Grodno_City';
const isGithubPages = process.env.GITHUB_PAGES === 'true' || process.env.NODE_ENV === 'production';
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || (process.env.GITHUB_PAGES === 'true' ? `/${repoName}` : '');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.env.GITHUB_PAGES === 'true' ? 'export' : undefined,
  basePath: basePath,
  assetPrefix: basePath,
  reactStrictMode: true,
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
