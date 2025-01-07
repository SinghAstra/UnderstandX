import { Repository } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { RecentSearches } from "./recent-search";
import { SearchBox } from "./search-box";
import { SearchSuggestions } from "./search-suggestion";

interface SearchContainerProps {
  repository?: Repository;
  onSearch: (query: string) => void;
}

export const formatRepoName = (fullName: string) => {
  const [owner, repo] = fullName.split("/");
  return (
    <>
      {owner}
      <span className="text-muted-foreground"> / </span>
      {repo}
    </>
  );
};

export function SearchContainer({
  repository,
  onSearch,
}: SearchContainerProps) {
  if (!repository || !repository.avatarUrl) {
    return null;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2 py-4 px-4 border-b backdrop-blur-xl">
        <Avatar className=" ring-2 ring-border shadow-lg">
          <AvatarImage src={repository.avatarUrl} />
          <AvatarFallback className="text-lg">
            {repository.name[0]}
          </AvatarFallback>
        </Avatar>
        <h1 className="tracking-tight">
          {repository.fullName && formatRepoName(repository.fullName)}
        </h1>
      </div>
      <div className="w-full max-w-2xl relative mx-auto">
        {/* Decorative elements */}
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl animate-pulse" />

        <div className="relative space-y-6">
          <SearchBox onSearch={onSearch} showCloseIcon={false} />

          <div className="max-h-[60vh] overflow-y-auto bg-background backdrop-blur-sm border-2 border-border/50 rounded-md ">
            <div className="p-4 space-y-6">
              <RecentSearches onSearch={onSearch} />
              <SearchSuggestions onSearch={onSearch} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
