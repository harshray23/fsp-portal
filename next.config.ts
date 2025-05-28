import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin', // Updated as per user request
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Content-Security-Policy',
            // A very basic CSP. Production CSPs usually need to be more specific.
            // e.g., allowing scripts/styles/fonts from 'self' and trusted CDNs.
            // connect-src needs to allow Firebase auth domains.
            // Example: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' https://placehold.co data:; font-src 'self'; connect-src 'self' https://*.googleapis.com https://securetoken.googleapis.com;"
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' https://placehold.co data:; connect-src 'self' https://*.googleapis.com https://securetoken.googleapis.com wss://*.firebaseio.com;"
          },
        ],
      },
    ];
  },
};

export default nextConfig;