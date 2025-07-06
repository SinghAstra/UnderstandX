"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Repository } from "@prisma/client";

export const SidebarRepositoryCard = ({
  repository,
}: {
  repository: Repository;
}) => {
  return (
    <div className="flex items-center gap-3 rounded border p-3 hover:bg-muted/20  cursor-pointer transition-colors">
      <Avatar className="h-8 w-8">
        <AvatarImage src={repository.avatarUrl || ""} alt={repository.owner} />
        <AvatarFallback>{repository.owner[0].toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <span className="font-medium line-clamp-1">{repository.name}</span>
        <span className="text-sm text-muted-foreground">
          {repository.owner}
        </span>
      </div>
      <div className="ml-auto">
        <div className={cn("h-2 w-2 rounded-full bg-green-500")} />
      </div>
    </div>
  );
};
