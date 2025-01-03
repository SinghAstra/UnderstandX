"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils/utils";
import { Repository } from "@prisma/client";

interface RepositoryCardProps {
  repository: Repository;
}

export function RepositoryCard({ repository }: RepositoryCardProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg border p-3 hover:bg-accent cursor-pointer transition-colors">
      <Avatar className="h-8 w-8">
        <AvatarImage src={repository.avatarUrl || ""} alt={repository.owner} />
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
            repository.status === "SUCCESS" ? "bg-green-500" : "bg-yellow-500"
          )}
        />
      </div>
    </div>
  );
}
