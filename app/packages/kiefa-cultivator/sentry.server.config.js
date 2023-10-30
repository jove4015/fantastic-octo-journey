// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";
import { ProfilingIntegration } from "@sentry/profiling-node";

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;
const env = process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT
  ? process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT
  : "development";

Sentry.init({
  dsn: SENTRY_DSN,
  tracesSampler: (samplingContext) => {
    if (samplingContext.request.url.endsWith("health")) {
      //ignore and do not sample health check requests
      return 0;
    } else if (samplingContext.request.url.endsWith("build-id")) {
      0.01;
    } else {
      return 0.5;
    }
  },
  environment: env,
  profilesSampleRate: env == "development" ? 1.0 : 0,
  integrations: [
    // Add profiling integration to list of integrations
    new ProfilingIntegration(),
  ],
});
