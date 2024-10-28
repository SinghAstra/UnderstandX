import { PrismaAdapter } from "@auth/prisma-adapter";
import type { NextAuthConfig, Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import GitHub from "next-auth/providers/github";
import { db } from "./lib/db";

const providers = [
  GitHub({
    clientId: process.env.AUTH_GITHUB_ID,
    clientSecret: process.env.AUTH_GITHUB_SECRET,
    authorization: {
      params: {
        scope: "read:user user:email repo public_repo",
      },
    },
  }),
];

export const authOptions: NextAuthConfig = {
  adapter: PrismaAdapter(db),
  providers,
  pages: {
    signIn: "/auth/sign-in",
  },
  secret: process.env.NEXT_AUTH_SECRET,
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.id = account.providerAccountId;
      }
      return token;
    },
    async session({ token, session }: { token: JWT; session: Session }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email ?? "";
        session.user.image = token.picture;
        session.user.accessToken = token.accessToken;
      }
      return session;
    },
  },
  session: { strategy: "jwt" },
};
