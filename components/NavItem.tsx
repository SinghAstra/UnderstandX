"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const NavItem = ({
  path,
  label,
  roleRequired,
  isPrivate,
}: {
  path: string;
  label: string;
  roleRequired?: string[];
  isPrivate?: boolean;
}) => {
  const session = useSession();
  const pathname = usePathname();
  if (session.status === "loading") {
    return null;
  }
  if (!session.data?.user && isPrivate) {
    return null;
  }
  if (
    session &&
    roleRequired &&
    session.data?.user.role &&
    !roleRequired.includes(session.data?.user.role)
  ) {
    return null;
  }

  return (
    <li>
      <Link
        href={path}
        aria-selected={pathname === path}
        className="transition-colors hover:text-foreground/80 text-foreground/60 font-medium"
      >
        {label}
      </Link>
    </li>
  );
};
