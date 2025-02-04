import { useProcessingStatus } from "@/hooks/use-processing-status";
import { useParams } from "next/navigation";
import React from "react";

const RepoProcessingLogs = () => {
  const params = useParams();
  const pathSegments = (params.path as string[]) || [];
  const repositoryId = pathSegments[0];
  const logs = useProcessingStatus(repositoryId as string);

  return (
    <div>
      <h1>Processing logs for repository {repositoryId}</h1>

      {logs.map((log, index) => (
        <div key={index}>
          {log.message} - {log.status}
        </div>
      ))}
    </div>
  );
};

export default RepoProcessingLogs;
