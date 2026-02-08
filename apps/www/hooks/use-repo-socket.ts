import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { io } from "socket.io-client";

export const useRepoSocket = (repoId: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = io(
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
    );

    socket.emit("join-repo", repoId);

    socket.on("log-update", (newLog) => {
      queryClient.setQueryData(["repo-logs", repoId], (oldLogs: any) => {
        return [newLog, ...(oldLogs || [])].slice(0, 50);
      });
    });

    socket.on("status-update", (newStatus) => {
      queryClient.setQueryData(["repo", repoId], (oldRepo: any) => ({
        ...oldRepo,
        status: newStatus,
      }));
    });

    return () => {
      socket.disconnect();
    };
  }, [repoId, queryClient]);
};
