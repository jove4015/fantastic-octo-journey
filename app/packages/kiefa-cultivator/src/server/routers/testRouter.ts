import { publicProcedure, router } from "../trpc";
import { z } from "zod";

export const testRouter = router({
  /**
   * A sample trpc procedure
   */
  test: publicProcedure.query(async ({ ctx }) => {
    return {
      message: "Hello world!",
      user: ctx.session?.userId,
      org: ctx.session?.organizationId,
    };
  }),
});
