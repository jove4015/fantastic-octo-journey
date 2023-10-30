import * as trpcNext from "@trpc/server/adapters/next";
import { createContext } from "~/server/context";
import { appRouter } from "~/server/routers/_app";
import * as Sentry from "@sentry/nextjs";
import { logger } from "~/utils/logger";
import { NextApiRequest, NextApiResponse } from "next";

export default function tRPCAPIRequest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const transactionHeader = req.headers["x-transaction-id"];
  const transactionid = () => {
    switch (typeof transactionHeader) {
      case "string":
        return transactionHeader;
    }
  };

  return trpcNext.createNextApiHandler({
    router: appRouter,
    createContext,
    onError({ error }) {
      // Note: this doesn't actually appear to fire.
      logger(transactionid()).error(error, error.message);
      Sentry.captureException(error);
    },
    batching: {
      enabled: true,
    },
  })(req, res);
}

export const config = {
  api: {
    externalResolver: true,
  },
};
