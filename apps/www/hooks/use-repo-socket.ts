import { env } from "@/env";
import { useQueryClient } from "@tanstack/react-query";
import { SOCKET_EVENTS } from "@understand-x/shared";
import { useEffect } from "react";
import { io } from "socket.io-client";

export const useRepoSocket = (repoId: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = io(env.NEXT_PUBLIC_API_URL, {
      query: { repoId },
    });

    socket.on(SOCKET_EVENTS.LOG_UPDATED, (newLog) => {
      queryClient.setQueryData(["repo-logs", repoId], (oldLogs: any) => {
        return [newLog, ...(oldLogs || [])].slice(0, 50);
      });

      if (newLog.status) {
        queryClient.setQueryData(["repo", repoId], (oldRepo: any) => ({
          ...oldRepo,
          status: newLog.status,
        }));
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [repoId, queryClient]);
};
