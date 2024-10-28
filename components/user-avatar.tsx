"use client";
import { LogOut, User } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function UserAvatar() {
  const session = useSession();
  const user = session.data?.user;
  const isAuthenticated = session.status === "authenticated" ? true : false;
  const isAuthenticating = session.status === "loading" ? true : false;

  if (isAuthenticating) {
    return (
      <div className="rounded-full w-8 h-8 animate-pulse bg-slate-500"></div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="cursor-pointer">
        {user?.name && user?.image ? (
          <Image
            src={user?.image}
            alt={user?.name}
            width={36}
            height={36}
            className="rounded-full hidden md:block bg-primary p-1"
          />
        ) : (
          <span className="w-8 h-8 rounded-full flex items-center justify-center bg-primary">
            {user?.name?.charAt(0)}
          </span>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 cursor-pointer m-2">
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => signOut()}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
