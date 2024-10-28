import { User } from "next-auth";

type UserId = string;

declare module "next-auth/jwt" {
  interface JWT {
    id: UserId;
    id: UserId;
    accessToken?: string;
  }
}

declare module "next-auth" {
  interface Session {
    user: User & {
      id: UserId;
      accessToken?: string;
    };
  }
}
