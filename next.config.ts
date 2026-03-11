import type { NextConfig } from 'next';
import { resolveAppUrl } from './src/lib/app-url';

const appUrl = resolveAppUrl();

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_APP_URL: appUrl,
  },
  // Enable static optimization for better performance
  output: 'standalone',

  // Configure headers for video serving
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,POST,OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
      {
        source: '/videos/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
    ];
  },

  // Configure redirects for better UX
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/admin/campaigns',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
