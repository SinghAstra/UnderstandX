"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Repository, RepositoryStatus } from "@prisma/client";
import Link from "next/link";

interface RepositoryCardProps {
  repository: Repository;
}

// Helper function to determine status color
const getStatusColor = (status: RepositoryStatus) => {
  if (status === "SUCCESS") {
    return "bg-green-500";
  }
  if (status === "CANCELLED" || status.includes("FAILED")) {
    return "bg-red-500";
  }
  return "bg-yellow-500";
};

export function RepositoryCard({ repository }: RepositoryCardProps) {
  return (
    <Link
      href={
        repository.status === "SUCCESS"
          ? `/repository/${repository.id}`
          : `/repository-logs/${repository.id}`
      }
    >
      <div className="flex items-center gap-3 rounded-lg border p-3 hover:bg-accent cursor-pointer transition-colors">
        <Avatar className="h-8 w-8">
          <AvatarImage
            src={repository.avatarUrl || ""}
            alt={repository.owner}
          />
          <AvatarFallback>{repository.owner[0].toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="font-medium">{repository.name}</span>
          <span className="text-sm text-muted-foreground">
            {repository.owner}
          </span>
        </div>
        <div className="ml-auto">
          <div
            className={cn(
              "h-2 w-2 rounded-full",
              getStatusColor(repository.status)
            )}
          />
        </div>
      </div>
    </Link>
  );
}
