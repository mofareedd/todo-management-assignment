import NextAuth from "next-auth";

import { authConfig } from "./config";

export const { auth, handlers, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,
  callbacks: {
    session: ({ session, token }) => {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      return session;
    },

    jwt: async ({ token, user }) => {
      return token;
    },
  },
  ...authConfig,
});
