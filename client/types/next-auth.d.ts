import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

// Extend NextAuth types for custom fields

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
    } & DefaultSession["user"];
    accessToken: string;
  }
  interface User {
    id: string;
    email: string;
    token: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    email?: string;
    accessToken?: string;
  }
} 