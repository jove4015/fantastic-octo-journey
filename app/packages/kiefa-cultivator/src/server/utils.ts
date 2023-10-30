import { Prisma, IssueStatus } from "@prisma/client";
import type { Context } from "./context";
import { TRPCError } from "@trpc/server";
import {
  fromContainerMetadata,
  fromSSO,
  fromEnv,
} from "@aws-sdk/credential-providers";
import { AwsCredentialIdentityProvider } from "@aws-sdk/types";
import { z } from "zod";

export function siteAdminGuard(ctx: Context) {
  if (!ctx.session?.isSiteAdmin) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Site Admin access required",
    });
  }
}

export function toIssueStatusType(status: string): IssueStatus {
  if (
    status != "OPEN" &&
    status != "RESOLVED" &&
    status != "MITIGATING" &&
    status != "ACKNOWLEDGED"
  ) {
    throw new TypeError(`${status} is not a valid IssueStatus`);
  }
  return IssueStatus[status];
}

export function getAwsCredentials() {
  let credentials: AwsCredentialIdentityProvider;

  if (
    process.env.AWS_CONTAINER_CREDENTIALS_RELATIVE_URI ||
    process.env.AWS_CONTAINER_CREDENTIALS_FULL_URI
  ) {
    credentials = fromContainerMetadata();
  } else if (
    process.env.AWS_ACCESS_KEY_ID &&
    process.env.AWS_SECRET_ACCESS_KEY
  ) {
    credentials = fromEnv();
  } else {
    credentials = fromSSO({ profile: process.env.AWS_PROFILE });
  }

  return credentials;
}

export async function shrinkWrap<F extends () => any>(
  impl: () => ReturnType<F>
) {
  try {
    return await impl();
  } catch (e: any) {
    if (e == "NOT FOUND") {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: e,
      });
    }
    if (e == "BAD REQUEST") {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: e,
      });
    }
    if (e == "FORBIDDEN") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: e,
      });
    }
    if (
      e instanceof Prisma.PrismaClientValidationError ||
      e instanceof Prisma.PrismaClientKnownRequestError
    ) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: e.message,
        cause: e,
      });
    } else {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: e.message,
        cause: e,
      });
    }
  }
}

export const ZodNumericId = z.object({
  id: z.number(),
});

export const ZodStringId = z.object({
  id: z.string(),
});
