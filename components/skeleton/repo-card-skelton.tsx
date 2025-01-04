import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function RepositoryCardSkeleton() {
  return (
    <Card className="flex items-center gap-4 p-4 cursor-pointer hover:bg-accent transition-colors">
      <Avatar className="h-8 w-8">
        <Skeleton className="h-full w-full rounded-full" />
      </Avatar>

      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-[140px]" />
        <Skeleton className="h-3 w-[100px]" />
      </div>

      <Skeleton className="h-4 w-4 rounded-full" />
    </Card>
  );
}
