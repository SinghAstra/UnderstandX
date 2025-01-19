// import { useRepository } from "@/components/context/repository";
// import { RepositoryStatus } from "@prisma/client";
// import { useEffect, useRef, useState } from "react";

// interface ProcessingLog {
//   timestamp: Date;
//   status: RepositoryStatus;
//   message: string;
// }
// const EXPRESS_API_URL = process.env.EXPRESS_API_URL;

// export const useRepositoryLogs = (repositoryId: string) => {
//   const [logs, setLogs] = useState<ProcessingLog[]>([]);
//   const { state } = useRepository();
//   const eventSourceRef = useRef<EventSource | null>(null);

//   useEffect(() => {
//     // Check if repository is in active repositories
//     // const isActive = state.activeRepositories.some(
//     //   (repo) => repo.id === repositoryId
//     // );

//     if (isActive && !eventSourceRef.current) {
//       const eventSource = new EventSource(
//         `${EXPRESS_API_URL}/api/repository/${repositoryId}/stream`
//       );
//       eventSourceRef.current = eventSource;

//       eventSource.onmessage = (event) => {
//         try {
//           const data = JSON.parse(event.data);
//           console.log("data --useRepositoryLogs is ", data);

//           setLogs((prev) => [
//             ...prev,
//             {
//               timestamp: new Date(),
//               status: data.status,
//               message: data.message,
//             },
//           ]);

//           // Close connection on terminal states
//           if (data.status === "SUCCESS" || data.status === "FAILED") {
//             eventSource.close();
//             eventSourceRef.current = null;
//           }
//         } catch (error) {
//           console.log("Error processing log message:", error);
//         }
//       };

//       eventSource.onerror = () => {
//         eventSource.close();
//         eventSourceRef.current = null;
//       };

//       return () => {
//         eventSource.close();
//         eventSourceRef.current = null;
//       };
//     }

//     // Cleanup if repository becomes inactive
//     if (!isActive && eventSourceRef.current) {
//       eventSourceRef.current.close();
//       eventSourceRef.current = null;
//     }
//   }, [repositoryId, state.activeRepositories]);

//   // Optional: Clear logs when repository becomes inactive
//   useEffect(() => {
//     const isActive = state.activeRepositories.some(
//       (repo) => repo.id === repositoryId
//     );
//     if (!isActive) {
//       setLogs([]);
//     }
//   }, [repositoryId, state.activeRepositories]);

//   return logs;
// };
