import { siteConfig } from "@/config/site";
import { File, Repository } from "@prisma/client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { FaGithub } from "react-icons/fa";
import { AvatarMenu } from "../custom-ui/avatar-menu";
import SignInButton from "../custom-ui/sign-in-button";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Button, buttonVariants } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

interface RepoDetailsNavbarProps {
  repository: Repository | null;
  selectedFile?: File | null;
  clearSelectedFile?: () => void;
}

const RepositorySkeleton = () => (
  <div className="flex gap-2 items-center border p-2 rounded-lg w-fit">
    <Skeleton className="w-8 h-8 rounded-full" />
    <div className="flex gap-2">
      <Skeleton className="h-8 w-24" />
      <Skeleton className="h-8 w-24" />
    </div>
  </div>
);

const Navbar = ({
  repository,
  selectedFile,
  clearSelectedFile,
}: RepoDetailsNavbarProps) => {
  const { data: session, status } = useSession();
  const isLoadingRepository = repository === null;

  return (
    <header className=" px-4 py-2 flex items-center justify-between fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex gap-2 items-center">
        <Link href="/" className=" hover:opacity-80 transition-opacity">
          <span className="tracking-wide text-2xl font-medium">
            {siteConfig.name}
          </span>
        </Link>
        {isLoadingRepository ? (
          <RepositorySkeleton />
        ) : (
          <Link
            className="flex gap-2 items-center border p-2  rounded-lg w-fit cursor-pointer hover:bg-secondary transition-colors duration-150 group"
            href={`/repository/${repository.id}`}
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
        )}
      </div>
      <div className="flex gap-2 items-center">
        {selectedFile && (
          <Button onClick={clearSelectedFile} variant={"outline"}>
            Overview
          </Button>
        )}
        <a
          href={repository?.url}
          target="_blank"
          className={buttonVariants({ variant: "outline" })}
        >
          <FaGithub />
        </a>
        {status === "loading" ? (
          <Skeleton className="h-10 w-10 rounded-full  border-primary border-2" />
        ) : session?.user ? (
          <AvatarMenu />
        ) : (
          <SignInButton />
        )}
      </div>
    </header>
  );
};

export default Navbar;
