import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    isVerified: boolean;
    role: string;
    onBoard: boolean;
  }
  interface Session {
    user: {
      id: string;
      isVerified: boolean;
      role: string;
      onBoard: boolean;
      name: string;
      email: string;
      image?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    isVerified: boolean;
    role: string;
    onBoard: boolean;
  }
}
