"use client";

import { Navbar } from "@/components/dashboard/dashboard-navbar";
import { LeftSidebar } from "@/components/dashboard/left-sidebar";
import { RightSidebar } from "@/components/dashboard/right-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex pt-16">
        <LeftSidebar />
        <main className="flex-1 ml-96">{children}</main>
        <RightSidebar />
      </div>
    </div>
  );
}
