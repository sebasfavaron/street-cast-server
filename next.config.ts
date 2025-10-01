import type { NextConfig } from 'next';

// Validate required environment variables
if (!process.env.NEXT_PUBLIC_APP_URL) {
  throw new Error(
    'NEXT_PUBLIC_APP_URL environment variable is required but not set.'
  );
}

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
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
