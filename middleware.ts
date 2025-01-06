// middleware.ts
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Authentication required paths
const authRequiredPaths = ["/dashboard", "/repository"];
// Authentication pages (sign in, sign up, etc)
const authPages = ["/auth/sign-in", "/auth/sign-up"];
// Public pages that don't require authentication
const publicPages = ["/"];

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXT_AUTH_SECRET,
  });
  console.log("token is ", token);
  const { pathname } = request.nextUrl;

  // Check if the path is one that requires authentication
  const isAuthRequired = authRequiredPaths.some((path) =>
    pathname.startsWith(path)
  );

  // Check if the current path is an auth page
  const isAuthPage = authPages.some((path) => pathname.startsWith(path));

  const isPublicPage = publicPages.some((path) => pathname.startsWith(path));

  console.log("pathname is ", pathname);
  console.log("isAuthRequired is ", isAuthRequired);
  console.log("isAuthPage is ", isAuthPage);

  // If the path requires authentication and user isn't logged in
  if (isAuthRequired && !token) {
    const signInUrl = new URL("/auth/sign-in", request.url);
    signInUrl.searchParams.set("callbackUrl", request.url);
    return NextResponse.redirect(signInUrl);
  }

  // If user is logged in and trying to access auth pages or if user is authenticated make the dashboard
  // the landing page
  if ((token && isAuthPage) || (token && pathname === "/")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // For all other paths that don't match our known routes
  if (!isAuthRequired && !isAuthPage && !isPublicPage && pathname !== "/404") {
    console.log("At 50");
    return NextResponse.redirect(new URL("/404", request.url));
  }

  console.log("At 53");

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public|404).*)",
  ],
};
