import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/api/trpc/(.*)"],
  signInUrl: "/sign-in",
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon|icons|static).*)",
    "/api/trpc/(.*)",
  ],
};
