
/** @type {import('next').NextConfig} */
const nextConfig = {
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
            value: 'strict-origin-when-cross-origin', // Updated for better security
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Content-Security-Policy',
            // Adjusted for Firebase, Google Fonts, and placeholder images
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.firebaseapp.com https://www.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' https://placehold.co data:; connect-src 'self' https://*.googleapis.com https://securetoken.googleapis.com wss://*.firebaseio.com https://*.firebaseio.com;"
          },
        ],
      },
    ];
  },
};

// If using Sentry, wrap your config with Sentry's configuration
// This requires setting up Sentry CLI and DSN for builds.
// const { withSentryConfig } = require("@sentry/nextjs");
// module.exports = withSentryConfig(
//   nextConfig,
//   {
//     // For all available options, see:
//     // https://github.com/getsentry/sentry-webpack-plugin#options
//     org: "YOUR_SENTRY_ORG_SLUG", // Replace with your Sentry organization slug
//     project: "YOUR_SENTRY_PROJECT_SLUG", // Replace with your Sentry project slug
//     // silent: true, // Suppresses all logs
//     // For all available options, see:
//     // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/
//     // Sentry SDK configuration will be done in sentry.client.config.js and sentry.server.config.js
//   }
// );

module.exports = nextConfig;
