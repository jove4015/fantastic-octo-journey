/**
 * This file contains the root router of your tRPC-backend
 */

import { publicProcedure, router } from "../trpc";
import { testRouter } from "./testRouter";

export const appRouter = router({
  health: publicProcedure.query(() => "yay!"),
  test: testRouter,
});

export type AppRouter = typeof appRouter;
