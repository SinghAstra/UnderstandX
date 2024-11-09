import bcrypt from "bcrypt";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "../db";
import { ErrorHandler } from "../error";
import { SignInSchema } from "../validators/auth.validator";
import { AUTH_TOKEN_EXPIRATION_TIME } from "./auth.constant";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "signin",
      id: "signin",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "email" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        const result = SignInSchema.safeParse(credentials);

        if (!result.success) {
          throw new ErrorHandler(
            "Input Validation failed",
            "VALIDATION_ERROR",
            {
              fieldErrors: result.error.flatten().fieldErrors,
            }
          );
        }

        const { email, password } = result.data;
        const user = await prisma.user.findUnique({
          where: {
            email: email,
            emailVerified: { not: null },
            blockedByAdmin: null,
          },
          select: {
            id: true,
            name: true,
            password: true,
            role: true,
            emailVerified: true,
            onBoard: true,
          },
        });

        if (!user || !user.password)
          throw new ErrorHandler(
            "Email or password is incorrect",
            "AUTHENTICATION_FAILED"
          );

        const isPasswordMatched = await bcrypt.compare(password, user.password);

        if (!isPasswordMatched) {
          throw new ErrorHandler(
            "Email or password is incorrect",
            "AUTHENTICATION_FAILED"
          );
        }

        return {
          id: user.id,
          name: user.name,
          email: email,
          isVerified: !!user.emailVerified,
          role: user.role,
          onBoard: user.onBoard,
        };
      },
    }),
  ],
  callbacks: {
    async signIn(signInProps) {
      const { user, account, profile } = signInProps;

      if (account?.provider === "google" && profile) {
        const { id: oauthId, email, name, image: avatar } = user;
        const cleanedAvatar = avatar?.split("=")[0];

        let existingUser = await prisma.user.findFirst({
          where: {
            OR: [{ email: email! }, { oauthId: oauthId! }],
          },
        });
        if (existingUser?.blockedByAdmin) return false;
        if (!existingUser) {
          existingUser = await prisma.user.create({
            data: {
              oauthId,
              oauthProvider: "GOOGLE",
              email: email as string,
              name: name as string,
              avatar: cleanedAvatar,
              isVerified: true,
              emailVerified: new Date(),
            },
          });
        }
      }

      return true;
    },

    async jwt(jwtProps) {
      const { token, user, trigger, session } = jwtProps;
      if (trigger === "update") {
        return {
          ...token,
          ...session.user,
        };
      }
      if (user) {
        const loggedInUser = await prisma.user.findFirst({
          where: {
            OR: [{ oauthId: { equals: user.id } }, { id: { equals: user.id } }],
            blockedByAdmin: null,
            emailVerified: { not: null },
          },
        });
        if (!loggedInUser) return null;

        token.id = loggedInUser.id;
        token.name = user.name;
        token.isVerified = user.isVerified;
        token.role = loggedInUser.role ? loggedInUser.role : user.role;
        token.image = loggedInUser ? loggedInUser.avatar : user.image;
        token.onBoard = loggedInUser.onBoard;
      }
      return token;
    },

    session({ session, token }) {
      if (token && session && session.user) {
        session.user.id = token.id;
        session.user.isVerified = token.isVerified;
        session.user.role = token.role;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.image = token.image as string;
        session.user.onBoard = token.onBoard;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: AUTH_TOKEN_EXPIRATION_TIME,
  },
  jwt: {
    maxAge: AUTH_TOKEN_EXPIRATION_TIME,
  },
  pages: {
    signIn: "/sign-in",
  },
  secret: process.env.NEXT_AUTH_SECRET,
} satisfies NextAuthOptions;
