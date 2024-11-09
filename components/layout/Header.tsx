"use client";
import Icons from "@/components/Icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { ADMIN_ROLE, HR_ROLE } from "@/config/app.config";
import { siteConfig } from "@/config/site";

import {
  adminNavbar,
  nonUserNavbar,
  userNavbar,
} from "@/lib/constant/app.constant";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { NavItem } from "../NavItem";

export const CompanyLogo = () => {
  return (
    <div className="flex items-center gap-2">
      <Image
        src={"/images/favicon.ico"}
        alt={`${siteConfig.name} logo`}
        width={30}
        height={30}
        className="rounded"
        priority
      />
      <h3 className="text-xl font-medium">
        <span className="text-primary ">{siteConfig.name}</span>
      </h3>
    </div>
  );
};

const Header = () => {
  const session = useSession();
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="fixed w-full z-50 backdrop-blur-lg border-b">
        <div className="flex h-[72px] w-full items-center justify-between lg:px-20 px-3 shadow-sm">
          <Link href="/" className="p-2.5">
            <CompanyLogo />
          </Link>
          <div className="flex items-center">
            <ul className="md:flex items-center gap-4 text-sm lg:gap-6 hidden mx-4">
              {session.status === "loading"
                ? nonUserNavbar.map((_, index) => (
                    <Skeleton className="h-4 w-[60px]" key={index} />
                  ))
                : session.data?.user
                ? session.data?.user.role === ADMIN_ROLE ||
                  session.data?.user.role === HR_ROLE
                  ? adminNavbar.map((item) => (
                      <NavItem {...item} key={item.id} />
                    ))
                  : userNavbar.map((item) => (
                      <NavItem {...item} key={item.id} />
                    ))
                : nonUserNavbar.map((item) => (
                    <NavItem {...item} key={item.id} />
                  ))}
            </ul>
            <div className="hidden md:block">
              {session.status === "loading" ? (
                <Skeleton className="h-8 w-8 rounded-full" />
              ) : session.status === "authenticated" ? (
                <>
                  <DropdownMenu open={open} onOpenChange={setOpen}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="relative h-8 w-8 rounded-full"
                        aria-label="avatar"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={
                              session.data.user.image
                                ? session.data.user.image
                                : "hello"
                            }
                          />

                          <AvatarFallback>
                            {session.data.user.name[0]}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-56"
                      align="end"
                      forceMount
                    >
                      <DropdownMenuItem>
                        <Icons.profile className="mr-2 h-4 w-4" />
                        <Link
                          className="w-full"
                          href={"/profile/" + session.data.user.id}
                        >
                          Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => {
                          signOut();
                        }}
                      >
                        <Icons.logout className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <div>
                  <Link
                    href="/sign-in"
                    className={buttonVariants({
                      size: "sm",
                      className: "bg-white",
                    })}
                  >
                    Get Started
                    <Icons.zap className="size-4 ml-0.5 text-orange-500 fill-orange-500" />
                  </Link>
                </div>
              )}
            </div>

            <div className="md:hidden flex justify-center ml-3">
              {/* <MobileNav /> */}
            </div>
          </div>
        </div>
      </nav>
      <div className="h-[72px] print:hidden"></div>
    </>
  );
};

export default Header;
