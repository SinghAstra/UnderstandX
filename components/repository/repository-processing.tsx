import {
  addActiveRepository,
  useRepository,
} from "@/components/context/repository";
import {
  getStepIcon,
  repositorySteps,
} from "@/components/dashboard/active-repositories";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Repository } from "@prisma/client";
import { useEffect } from "react";
import { formatRepoName } from "../semantic-search-repo/search-container";

interface RepositoryProcessingProps {
  repository: Repository;
}

export const RepositoryProcessing = ({
  repository,
}: RepositoryProcessingProps) => {
  const { state, dispatch } = useRepository();

  useEffect(() => {
    dispatch(addActiveRepository(repository));
  }, [repository, dispatch]);

  console.log(
    "state.processingStatuses[repository.id] is ",
    state.processingStatuses[repository.id]
  );

  return (
    <div className="flex flex-col ">
      <div className="flex items-center gap-2 py-4 px-4 border-b">
        <Avatar className="ring-2 ring-border shadow-lg">
          {repository.avatarUrl && <AvatarImage src={repository.avatarUrl} />}
          <AvatarFallback className="text-lg">
            {repository.name[0]}
          </AvatarFallback>
        </Avatar>
        <h1 className="tracking-tight">
          {repository.fullName && formatRepoName(repository.fullName)}
        </h1>
      </div>
      <div className="w-full max-w-sm border h-full mx-auto rounded-md bg-card/50 backdrop-blur-lg space-y-4 p-4 mt-20">
        {repositorySteps.map((step) => (
          <div key={step.status} className="flex items-center gap-3">
            {getStepIcon(state.processingStatuses, repository.id, step.status)}
            <span
              className={`text-sm ${
                state.processingStatuses[repository.id] === step.status
                  ? "text-blue-500 font-medium"
                  : "text-gray-500"
              }`}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
