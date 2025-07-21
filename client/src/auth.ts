// @ts-nocheck
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

async function loginUser(credentials: { email: string; password: string }) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  if (!res.ok) {
    return null;
  }
  return res.json();
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const data = await loginUser({
          email: credentials?.email as string,
          password: credentials?.password as string,
        });
        if (data && data.user && data.token) {
          return {
            id: data.user.id,
            email: data.user.email,
            token: data.token as string,
          };
        }
        // Return null for invalid credentials
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        (token as Record<string, any>).id = user.id;
        (token as Record<string, any>).email = user.email;
        (token as Record<string, any>).accessToken = (user as { token: string }).token;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        (session.user as { id: string; email: string }) = {
          id: (token as Record<string, any>).id as string,
          email: (token as Record<string, any>).email as string,
        };
        ((session as unknown) as { accessToken: string }).accessToken = (token as Record<string, any>).accessToken as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/login", // Error code passed in query string as ?error=
  },
});

