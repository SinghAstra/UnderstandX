import { siteConfig } from "@/config/site";
import { authOptions } from "@/lib/auth-options";
import { cn } from "@/lib/utils";
import { getServerSession } from "next-auth";
import Link from "next/link";
import React from "react";
import AnimationContainer from "../global/animation-container";
import MaxWidthWrapper from "../global/max-width-wrapper";
import { AvatarMenu } from "../ui/avatar-menu";
import SignIn from "../ui/sign-in";

const Navbar = async () => {
  const session = await getServerSession(authOptions);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 h-14 z-[99] border-b border-dashed backdrop-blur-lg"
      )}
    >
      <AnimationContainer reverse delay={0.2} className="size-full">
        <MaxWidthWrapper className="flex items-center justify-between">
          <div className="flex items-center space-x-12">
            <Link href="/">
              <span className="text-3xl font-normal tracking-wider">
                {siteConfig.name}
              </span>
            </Link>
          </div>

          <div className="hidden lg:flex items-center">
            {session?.user ? <AvatarMenu /> : <SignIn />}
          </div>
        </MaxWidthWrapper>
      </AnimationContainer>
    </header>
  );
};

export default Navbar;
