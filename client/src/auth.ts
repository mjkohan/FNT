
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

const API_URL = process.env.BACKEND_URL +'/api' || "http://localhost:3000/api";

async function loginUser(credentials: { email: string; password: string }) {
  console.log(credentials);
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
            createdAt: data.user.createdAt,
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
      if (user && 'id' in user && 'email' in user && 'token' in user) {
        token.id = user.id;
        token.email = user.email;
        token.createdAt = user.createdAt;
        token.accessToken = user.token;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.createdAt = token.createdAt as string;
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/login", // Error code passed in query string as ?error=
  },
});

