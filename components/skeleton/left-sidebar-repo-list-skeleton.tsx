import { ScrollArea } from "@/components/ui/scroll-area";
import { RepositoryCardSkeleton } from "./left-sidebar-repo-card-skelton";

export function SidebarRepoListSkeleton() {
  return (
    <ScrollArea className="flex-1 px-4">
      <div className="space-y-2 pb-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <RepositoryCardSkeleton key={index} />
        ))}
      </div>
    </ScrollArea>
  );
}
