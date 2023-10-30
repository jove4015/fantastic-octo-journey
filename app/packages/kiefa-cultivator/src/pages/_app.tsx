import React from "react";
import { httpLink } from "@trpc/client/links/httpLink";
import { httpBatchLink } from "@trpc/client/links/httpBatchLink";
import { splitLink } from "@trpc/client/links/splitLink";
import { withTRPC } from "@trpc/next";
import { NextPage } from "next";
import { AppProps } from "next/app";
import { AppType } from "next/dist/shared/lib/utils";
import { ReactElement, ReactNode } from "react";
import { AppRouter } from "../server/routers/_app";
import { SSRContext, getBaseUrl } from "../utils/trpc";
import Head from "next/head";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/nextjs";
import SignInPage from "./sign-in/[[...index]]";
import { ContextProvider } from "../context/provider";
import * as Sentry from "@sentry/nextjs";
import parseError from "~/utils/parseError";
import transformer from "../utils/transformer";
import { UserRole } from "~/context/types";

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

export function posthogEnabled(): boolean {
  return (
    !(typeof window !== "undefined" && Object.hasOwn(window, "Cypress")) &&
    !(typeof process !== "undefined" && process.env.CYPRESS) &&
    !process.env.NEXT_PUBLIC_PULLPREVIEW_PUBLIC_DNS &&
    !(process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test")
  );
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

declare global {
  /**
   * Here we define custom types for the organization metadata object in Clerk.
   */
  interface OrganizationPublicMetadata {
    [k: string]: unknown;
    timeZone?: string;
  }
  /**
   * Here we define custom types for the organization membership metadata object in Clerk.
   */
  interface OrganizationMembershipPublicMetadata {
    [k: string]: unknown;
    userRole?: UserRole;
    incidentNotifications?: boolean;
    teamId?: number;
    facilities?: number[];
  }
  /**
   * Here we define custom types for the organization invitation metadata object in Clerk.
   */
  interface OrganizationInvitationPublicMetadata {
    [k: string]: unknown;
    userRole?: UserRole;
    incidentNotifications?: boolean;
    teamId?: number;
    facilities?: number[];
  }
  /**
   * Here we define custom types for the user metadata object in Clerk.
   */
  interface UserPublicMetadata {
    [k: string]: unknown;
    isSiteAdmin?: boolean;
  }
}

const MyApp = (({ Component, pageProps }: AppPropsWithLayout) => {
  const getLayout =
    Component.getLayout ??
    ((page) => (
      <ClerkProvider {...page}>
        <SignedIn>
          <ContextProvider>
            <Head>
              <meta
                name="viewport"
                content="initial-scale=1, width=device-width maximum-scale=1"
              />
              <title>Example</title>
            </Head>
            <main>{page}</main>
          </ContextProvider>
        </SignedIn>
        <SignedOut>
          <SignInPage />
        </SignedOut>
      </ClerkProvider>
    ));

  return getLayout(<Component {...pageProps} />);
}) as AppType;

export default withTRPC<AppRouter>({
  config() {
    return {
      queryClientConfig: {
        defaultOptions: {
          mutations: {
            onError: (error) => {
              Sentry.captureException(error);
              console.error("TRPC mutation error: " + parseError(error));
            },
          },
          queries: {
            refetchOnWindowFocus: false,
            onError: (error) => {
              Sentry.captureException(error);
              console.error("TRPC query error: " + parseError(error));
            },
          },
        },
      },
      links: [
        splitLink({
          condition(op) {
            return op.context.useCache === true;
          },
          true: httpBatchLink({
            url: `${getBaseUrl()}/api/trpc`,
          }),
          false: httpLink({
            url: `${getBaseUrl()}/api/trpc`,
          }),
        }),
      ],
      transformer,
    };
  },
  ssr: true,
  responseMeta(opts) {
    const ctx = opts.ctx as SSRContext;

    if (ctx.status) {
      return {
        status: ctx.status,
      };
    }

    const error = opts.clientErrors[0];
    if (error) {
      return {
        status: error.data?.httpStatus ?? 500,
      };
    }
    return {};
  },
})(MyApp);
