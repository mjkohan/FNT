import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

// Extend NextAuth types for custom fields

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      createdAt: string;
    } & DefaultSession["user"];
    accessToken: string;
  }
  interface User {
    id: string;
    email: string;
    createdAt: string;
    token: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    email?: string;
    createdAt?: string;
    accessToken?: string;
  }
} 