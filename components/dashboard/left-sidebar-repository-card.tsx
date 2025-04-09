"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Repository, RepositoryStatus } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface RepositoryCardProps {
  repository: Repository;
}

const getStatusColor = (status: RepositoryStatus) => {
  if (status === "SUCCESS") {
    return "bg-green-500";
  }
  if (status.includes("FAILED")) {
    return "bg-red-500";
  }
  return "bg-yellow-500";
};

export function RepositoryCard({ repository }: RepositoryCardProps) {
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleRepositoryCardClick = (repository: Repository) => {
    console.log("In handleRepositoryCardClick.")
    if (repository.status === RepositoryStatus.SUCCESS) {
      router.push(`/repository/${repository.id}`);
    }
    if (repository.status === RepositoryStatus.FAILED) {
      setMessage("Failed to process repository. Please try again.");
    }
    if (
      repository.status === RepositoryStatus.PROCESSING ||
      repository.status === RepositoryStatus.PENDING
    ) {
      router.push(`/logs/${repository.id}`);
    }
  };

  useEffect(() => {
    if (!message) return;
    toast(message);
    setMessage(null);
  }, [message]);

  return (
    <div
      className="flex items-center gap-3 rounded-lg border p-3 hover:bg-accent cursor-pointer transition-colors"
      onClick={() => handleRepositoryCardClick(repository)}
    >
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
        <div
          className={cn(
            "h-2 w-2 rounded-full",
            getStatusColor(repository.status)
          )}
        />
      </div>
    </div>
  );
}
