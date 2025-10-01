import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_APP_URL:
      process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3050',
  },
  // Enable static optimization for better performance
  output: 'standalone',

  // Configure headers for video serving
  async headers() {
    return [
      {
        source: '/videos/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
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
