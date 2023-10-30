// This file configures the initialization of Sentry on the browser.
// The config you add here will be used whenever a page is visited.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";
import { HttpClient as HttpClientIntegration } from "@sentry/integrations";

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn: SENTRY_DSN,
  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 0.5,
  environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT
    ? process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT
    : "development",

  replaysSessionSampleRate: 0,

  replaysOnErrorSampleRate: 1.0,

  integrations: [
    new Sentry.Replay(),
    new HttpClientIntegration({
      failedRequestStatusCodes: [
        [400, 499],
        [500, 599],
      ],
    }),
  ],
  sendDefaultPii: true,
  ignoreErrors: ["ClerkJS: Token refresh failed"],
});
