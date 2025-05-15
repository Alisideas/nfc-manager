export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/:path*",
    "/admin",
    "/admin/:path*",
    "/profile",
    "/profile/:path*",
    "/nfc-scan"
  ],
};
