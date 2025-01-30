"use client";

import { useProcessingStatus } from "@/hooks/use-processing-status";
import { useParams } from "next/navigation";

const RepositoryPage = () => {
  const params = useParams();
  const logs = useProcessingStatus(params.id as string);
  console.log("params.id is ", params.id);
  return (
    <div className="flex flex-col">
      <h1>Repository Details Page {params.id}</h1>
      {logs &&
        logs.map((log, index) => (
          <div key={index}>
            {log.message} - {log.status}
          </div>
        ))}
    </div>
  );
};

export default RepositoryPage;
