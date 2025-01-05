import { Button } from "@/components/ui/button";
import { Clock, History, X } from "lucide-react";
import { useState } from "react";

interface RecentSearchesProps {
  onSearch: (query: string) => void;
}

export function RecentSearches({ onSearch }: RecentSearchesProps) {
  const [isVisible, setIsVisible] = useState(true);
  const recentSearches = ["React hooks", "Authentication flow", "API routes"];

  if (!isVisible) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Clock className="h-5 w-5 text-muted-foreground" />
          <h3 className="leading-tight">Recent Search</h3>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setIsVisible(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {recentSearches.map((query) => (
          <Button
            key={query}
            variant="outline"
            size="sm"
            className="hover:bg-primary/10 hover:text-primary transition-colors"
            onClick={() => onSearch(query)}
          >
            <History className="mr-2 h-4 w-4" />
            {query}
          </Button>
        ))}
      </div>
    </div>
  );
}
