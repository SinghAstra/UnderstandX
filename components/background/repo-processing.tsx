import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React from "react";

const RepoProcessingBackground = () => {
  const repositories = [
    {
      id: "1",
      name: "next.js",
      owner: "vercel",
      avatarUrl: "https://avatars.githubusercontent.com/u/14985020",
      status: "PROCESSING",
    },
    {
      id: "2",
      name: "ui",
      owner: "shadcn-ui",
      avatarUrl: "https://avatars.githubusercontent.com/u/139895814",
      status: "PROCESSING",
    },
  ];

  // Function to determine status color based on repository status
  const getStatusColor = (status: string) => {
    if (status === "SUCCESS") {
      return "bg-green-500";
    }
    if (status.includes("FAILED")) {
      return "bg-red-500";
    }
    if (status === "PROCESSING") {
      return "bg-yellow-500";
    }
    return "bg-blue-500"; // For QUEUED
  };

  return (
    <div className="absolute top-8 inset-x-4  shadow-md overflow-hidden transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_0%,#000_100%)] group-hover:scale-105">
      <div className="flex flex-col gap-2">
        {repositories.map((repo) => (
          <div
            key={repo.id}
            className="flex items-center gap-3 rounded-lg border p-3 hover:bg-accent transition-colors"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={repo.avatarUrl} alt={repo.owner} />
              <AvatarFallback>{repo.owner[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium">{repo.name}</span>
              <span className="text-sm text-muted-foreground">
                {repo.owner}
              </span>
            </div>
            <div className="ml-auto">
              <div
                className={`h-2 w-2 rounded-full ${getStatusColor(
                  repo.status
                )}`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RepoProcessingBackground;
