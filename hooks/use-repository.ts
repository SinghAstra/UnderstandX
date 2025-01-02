import { GitHubStats } from "@/interfaces/github";
import { Repository } from "@prisma/client";
import { useEffect, useState } from "react";

type RepositoryInfo = {
  repository: Repository;
  githubStats: GitHubStats;
};

// Custom hook for fetching repository data
const useRepository = (repositoryId: string) => {
  const [repositoryInfo, setRepositoryInfo] = useState<RepositoryInfo | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRepository = async () => {
      try {
        const response = await fetch(`/api/repository/${repositoryId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch repository");
        }
        const data = await response.json();
        setRepositoryInfo(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    if (repositoryId) {
      fetchRepository();
    }
  }, [repositoryId]);

  return { repositoryInfo, loading, error };
};

export default useRepository;
