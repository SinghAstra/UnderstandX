"use client";

import { Navbar } from "@/components/dashboard/dashboard-navbar";
import { Sidebar } from "@/components/dashboard/sidebar";
import { ToolsSidebar } from "@/components/dashboard/tools-sidebar";

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
        <main className="flex-1">{children}</main>
        <ToolsSidebar />
      </div>
    </div>
  );
}
