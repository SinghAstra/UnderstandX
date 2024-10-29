import Footer from "@/components/navigation/footer";
import Navbar from "@/components/navigation/navbar";
import React from "react";

export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
