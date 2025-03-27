import { Navbar } from "@/components/dashboard/dashboard-navbar";
import { LeftSidebar } from "@/components/dashboard/left-sidebar";
import { RightSidebar } from "@/components/dashboard/right-sidebar";
import { authOptions } from "@/lib/auth-options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export async function generateMetadata() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/sign-in");
  }

  return {
    title: `Dashboard `,
    description: `Welcome to your dashboard, ${session.user.name}`,
  };
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/sign-in");
  }

  return (
    <div className="min-h-screen">
      <Navbar user={session.user} />
      <div className="flex pt-16">
        <LeftSidebar />
        <main className="hidden md:flex flex-1 ml-96 ">{children}</main>
        <RightSidebar />
      </div>
    </div>
  );
}
