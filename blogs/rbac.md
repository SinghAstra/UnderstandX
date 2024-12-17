// types/next-auth.d.ts
import NextAuth from "next-auth"

declare module "next-auth" {
interface User {
role?: "GUEST" | "USER" | "ADMIN"
}

interface Session {
user: User & {
role?: "GUEST" | "USER" | "ADMIN"
}
}
}

// lib/auth/roles.ts
export enum UserRole {
GUEST = "GUEST",
USER = "USER",
ADMIN = "ADMIN"
}

export const ROLE_PERMISSIONS = {
[UserRole.GUEST]: [
"/",
"/search",
"/repository",
"/explore",
"/auth/login"
],
[UserRole.USER]: [
"/dashboard",
"/profile"
],
[UserRole.ADMIN]: [
"/admin"
]
}

// lib/auth/permissions.ts
import { UserRole, ROLE_PERMISSIONS } from './roles'

export function hasPermission(userRole: UserRole, path: string): boolean {
// Admin has access to everything
if (userRole === UserRole.ADMIN) return true

// Check if path starts with any allowed paths for role
const allowedPaths = [
...ROLE_PERMISSIONS[UserRole.GUEST],
...(userRole === UserRole.USER ? ROLE_PERMISSIONS[UserRole.USER] : [])
]

return allowedPaths.some(allowedPath =>
path === allowedPath || path.startsWith(`${allowedPath}/`)
)
}

// middleware.ts
import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { hasPermission } from './lib/auth/permissions'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
const token = await getToken({ req: request })
const path = request.nextUrl.pathname

// Default to GUEST role if not authenticated
const userRole = token?.role || "GUEST"

if (!hasPermission(userRole, path)) {
// Redirect to login if not authenticated, otherwise show 403
if (userRole === "GUEST") {
return NextResponse.redirect(new URL('/auth/login', request.url))
}
return NextResponse.redirect(new URL('/403', request.url))
}

return NextResponse.next()
}

export const config = {
matcher: [
'/((?!api|_next/static|_next/image|favicon.ico).*)',
],
}

// pages/api/auth/[...nextauth].ts
import NextAuth from 'next-auth'
import GithubProvider from "next-auth/providers/github"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from '../../../lib/prisma'

export default NextAuth({
adapter: PrismaAdapter(prisma),
providers: [
GithubProvider({
clientId: process.env.GITHUB_ID,
clientSecret: process.env.GITHUB_SECRET,
}),
],
callbacks: {
async jwt({ token, user }) {
if (user) {
token.role = user.role
}
return token
},
async session({ session, token }) {
if (session?.user) {
session.user.role = token.role
}
return session
},
},
})
