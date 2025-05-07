import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXT_AUTH_SECRET });
  const isLoggedIn = !!token;
  const { pathname } = req.nextUrl;

  // console.log("middleware running for:", pathname);

  if (pathname === "/auth/sign-in" && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }
}

export const config = {
  matcher: ["/dashboard", "/logs/:id*", "/repository/:id*", "/auth/sign-in"],
};
