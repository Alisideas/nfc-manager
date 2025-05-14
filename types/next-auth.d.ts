// types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      emailVerified: boolean;
      id: string | null; // Add the ID field
      username?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface User {
    id: string; // Add the ID field
  }

  interface JWT {
    id: string; // Add the ID field
  }
}
