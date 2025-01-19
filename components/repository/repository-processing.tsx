// import {
//   addActiveRepository,
//   useRepository,
// } from "@/components/context/repository";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Repository } from "@prisma/client";
import { formatRepoName } from "../semantic-search-repo/search-container";

interface RepositoryProcessingProps {
  repository: Repository;
}

export const RepositoryProcessing = ({
  repository,
}: RepositoryProcessingProps) => {
  // useEffect(() => {
  //   dispatch(addActiveRepository(repository));
  // }, [repository, dispatch]);

  // console.log(
  //   "state.processingStatuses[repository.id] is ",
  //   state.processingStatuses[repository.id]
  // );

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
    </div>
  );
};
