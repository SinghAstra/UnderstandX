import { siteConfig } from "@/config/site";
import { Repository } from "@prisma/client";
import { User } from "next-auth";
import Link from "next/link";
import React from "react";
import { Avatar, AvatarImage } from "../ui/avatar";
import { AvatarMenu } from "../ui/avatar-menu";
import { buttonVariants } from "../ui/button";

interface RepoDetailsNavbarProps {
  repository: Repository;
  user: User;
}

const Navbar = ({ repository, user }: RepoDetailsNavbarProps) => {
  return (
    <header className=" px-4 py-2 flex items-center justify-between fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex gap-2 items-center">
        <Link
          href="/dashboard"
          className=" hover:opacity-80 transition-opacity"
        >
          <span className="tracking-wide text-2xl font-medium">
            {siteConfig.name}
          </span>
        </Link>
        <Link
          className="flex gap-2 items-center border p-2  rounded-lg w-fit cursor-pointer hover:bg-secondary transition-colors duration-150 group"
          href={repository?.url}
          target="_blank"
        >
          <Avatar className="w-8 h-8">
            <AvatarImage src={repository.avatarUrl} />
          </Avatar>
          <div className="flex gap-1">
            <span className="text-foreground">{repository.owner}</span>
            <span className="text-muted group-hover:text-muted-foreground ">
              {"/"}
            </span>
            <span className="text-foreground">{repository.name}</span>
          </div>
        </Link>
      </div>
      <div className="flex gap-2 items-center">
        <Link
          href={`/repository/${repository.id}`}
          className={buttonVariants({ variant: "outline" })}
        >
          Overview
        </Link>
        <AvatarMenu user={user} />
      </div>
    </header>
  );
};

export default Navbar;
