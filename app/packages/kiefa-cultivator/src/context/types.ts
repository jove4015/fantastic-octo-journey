import { JwtPayload } from "@clerk/types";
// import { UserRole } from "@prisma/client";

// we are excluding prisma from this package so we need to define the user role here

export type UserRole = "ADMIN" | "GROWTECH" | "MANAGER" | "LEAD";

export interface kiefaCustomJWTTemplate extends JwtPayload {
  siteAdmin: boolean;
  timeZone: string;
  incidentNotifications: boolean;
  userRole: UserRole;
  facilities: number[];
}
