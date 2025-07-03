import Footer from "@/components/home/footer";
import Navbar from "@/components/home/navbar";
import { authOptions } from "@/lib/auth-options";
import { getServerSession } from "next-auth";
import React, { ReactNode } from "react";

interface HomeLayoutProps {
  children: ReactNode;
}

const HomeLayout = async ({ children }: HomeLayoutProps) => {
  const session = await getServerSession(authOptions);

  return (
    <div className="relative z-0">
      <Navbar user={session?.user} />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default HomeLayout;
