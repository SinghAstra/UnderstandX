import Footer from "@/components/home/footer";
import Navbar from "@/components/home/navbar";
import React from "react";

interface Props {
  children: React.ReactNode;
}

const HomeLayout = ({ children }: Props) => {
  return (
    <>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#161616_1px,transparent_1px),linear-gradient(to_bottom,#161616_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] h-full z-[-1]" />
      <Navbar />
      <main className="mt-20 mx-auto w-full ">{children}</main>
      <Footer />
    </>
  );
};

export default HomeLayout;
