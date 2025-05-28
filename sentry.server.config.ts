
// This file configures the Sentry Node.js server SDK.
// It is important to note that the Sentry Node.js server SDK is only loaded when
// NEXT_PUBLIC_SENTRY_DSN is set.

import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    // Adjust this value in production, or use tracesSampler for greater control
    tracesSampleRate: 1.0,
    // Setting this option to true will print useful information to the console while you're setting up Sentry.
    debug: false,
    // uncomment the line below to enable Spotlight (Sentry local development server)
    // spotlight: process.env.NODE_ENV === 'development',
  });
}
