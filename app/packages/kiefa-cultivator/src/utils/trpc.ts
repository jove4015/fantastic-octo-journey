import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { NextPageContext } from "next";
import type { AppRouter } from "../server/routers/_app";
import { createTRPCNext } from "@trpc/next";
import { httpBatchLink } from "@trpc/client";
import transformer from "./transformer";

export interface SSRContext extends NextPageContext {
  status?: number;
}

export function getBaseUrl() {
  if (typeof window !== "undefined") {
    return "";
  }

  if (
    process.env.PULLPREVIEW_PUBLIC_DNS &&
    process.env.PULLPREVIEW_PUBLIC_DNS != ""
  ) {
    return "http://" + process.env.PULLPREVIEW_PUBLIC_DNS;
  }

  // TODO: Add separate environments
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export const trpc = createTRPCNext<AppRouter, SSRContext>({
  config(opts) {
    return {
      transformer,
      links: [
        httpBatchLink({
          /**
           * If you want to use SSR, you need to use the server's full URL
           * @link https://trpc.io/docs/ssr
           **/
          url: `${getBaseUrl()}/api/trpc`,
          // You can pass any HTTP headers you wish here
          async headers() {
            return {
              // authorization: getAuthCookie(),
            };
          },
        }),
      ],
    };
  },
  ssr: true,
});

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;
