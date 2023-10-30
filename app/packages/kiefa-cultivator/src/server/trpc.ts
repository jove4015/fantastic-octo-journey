import { TRPCError, initTRPC } from "@trpc/server";
import { Context } from "./context";
import * as Sentry from "@sentry/node";
import transformer from "../utils/transformer";

export interface Metadata {
  requiredPerms?: string[];
}

const t = initTRPC
  .context<Context>()
  .meta<Metadata>()
  .create({
    // Optional:
    transformer,
    // Optional:
    errorFormatter(opts) {
      const { shape } = opts;
      return {
        ...shape,
        data: {
          ...shape.data,
        },
      };
    },
  });

// check if the user is signed in, otherwise throw a UNAUTHORIZED CODE
const isAuthenticated = t.middleware(({ next, ctx }) => {
  /**
   * HAPPY PATH: Any authentication error in an API route should fall through
   * to this error handler below. This will return a 401 to the client along with
   * a well-formed TRPCError.
   */

  if (!ctx.session?.userId) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Login required" });
  }
  return next({ ctx });
});

// check if the user is authorized, otherwise throw a UNAUTHORIZED CODE
const isAuthorized = t.middleware(async ({ next, ctx, meta }) => {
  // stub

  return next({ ctx });
});

const sentryMiddleware = t.middleware(
  Sentry.Handlers.trpcMiddleware({
    attachRpcInput: true,
  }),
);

/**
 * We recommend only exporting the functionality that we
 * use so we can enforce which base procedures should be used
 **/
export const router = t.router;
export const mergeRouters = t.mergeRouters;
export const publicProcedure = t.procedure
  .use(sentryMiddleware)
  .use(isAuthenticated)
  .use(isAuthorized);
