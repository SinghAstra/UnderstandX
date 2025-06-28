import { siteConfig } from "@/config/site";
import { User } from "next-auth";
import Link from "next/link";
import React from "react";
import { AvatarMenu } from "../ui/avatar-menu";
import SignIn from "../ui/sign-in";

interface NavbarProps {
  user: User | undefined;
}

const Navbar = ({ user }: NavbarProps) => {
  return (
    <div className="sticky top-0 inset-x-0 h-14 z-[99] backdrop-blur-lg">
      <div className="flex items-center justify-between px-3 md:px-4 lg:px-5 py-2 md:py-3">
        <Link href="/">
          <span className="text-3xl font-normal tracking-wider">
            {siteConfig.name}
          </span>
        </Link>

        {user ? <AvatarMenu user={user} /> : <SignIn />}
      </div>
    </div>
  );
};

export default Navbar;
