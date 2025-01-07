"use client";

import Navbar from "@/components/semantic-search-repo/navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="pt-16 flex-1">{children}</div>
    </div>
  );
}
