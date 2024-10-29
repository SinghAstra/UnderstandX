import Navbar from "@/components/navigation/navbar";
import React from "react";

export default async function AnalyzeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
}
