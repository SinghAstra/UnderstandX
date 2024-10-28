"use client";

import { buttonVariants } from "@/components/ui/button";
import { NavigationMenuLink } from "@/components/ui/navigation-menu";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { LucideIcon, Zap } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { VerticalAnimationContainer } from "../global/animation-container";
import MaxWidthWrapper from "../global/max-width-wrapper";
import { UserAvatar } from "../user-avatar";

const Navbar = () => {
  const [scroll, setScroll] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > 8) {
      setScroll(true);
    } else {
      setScroll(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 inset-x-0 h-14 w-full border-b border-transparent z-[99999] select-none",
        scroll && "border-background/80 bg-background/40 backdrop-blur-md"
      )}
    >
      <VerticalAnimationContainer reverse delay={0.1} className="size-full">
        <MaxWidthWrapper className="flex items-center justify-between">
          <div className="flex items-center space-x-12">
            <Link href="/">
              <span className="text-lg font-semibold  !leading-none">
                {siteConfig.name}
              </span>
            </Link>
          </div>

          <div className="hidden lg:flex items-center">
            <div className="flex">
              <div className="flex items-center gap-x-4">
                <Link
                  href="/auth/sign-in"
                  className={buttonVariants({ size: "sm", variant: "ghost" })}
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/sign-in"
                  className={buttonVariants({
                    size: "sm",
                    className: "bg-white",
                  })}
                >
                  Get Started
                  <Zap className="size-4 ml-1.5 text-orange-500 fill-orange-500" />
                </Link>
              </div>
              <UserAvatar />
            </div>
          </div>
        </MaxWidthWrapper>
      </VerticalAnimationContainer>
    </header>
  );
};

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { title: string; icon: LucideIcon }
>(({ className, title, href, icon: Icon, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          href={href!}
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none transition-all duration-100 ease-out hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="flex items-center space-x-2 text-neutral-300">
            <Icon className="h-4 w-4" />
            <h6 className="text-sm font-medium !leading-none">{title}</h6>
          </div>
          <p
            title={children! as string}
            className="line-clamp-1 text-sm leading-snug text-muted-foreground"
          >
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default Navbar;
