import Navbar from "@/components/navigation/navbar";
import React from "react";

export default async function NewChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      {children}
    </div>
  );
}
