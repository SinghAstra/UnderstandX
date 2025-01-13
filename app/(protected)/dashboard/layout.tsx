"use client";

import { Navbar } from "@/components/dashboard/dashboard-navbar";
import { RightSidebar } from "@/components/dashboard/right-sidebar";
import { Sidebar } from "@/components/dashboard/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex pt-16">
        <Sidebar />
        <main className="flex-1 ml-96">{children}</main>
        <RightSidebar />
      </div>
    </div>
  );
}
