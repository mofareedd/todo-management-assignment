import NextAuth from "next-auth";

import { authConfig } from "./config";
import { db } from "../db";
import {
  accountsTable,
  sessionsTable,
  usersTable,
  verificationTokensTable,
} from "../db/schema";
import { DrizzleAdapter } from "@auth/drizzle-adapter";

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable,
    accountsTable,
    sessionsTable,
    verificationTokensTable,
  }),
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,
  callbacks: {
    session: ({ session, user, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
  },
  ...authConfig,
});
