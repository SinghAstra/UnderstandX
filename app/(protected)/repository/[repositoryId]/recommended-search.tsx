import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Command } from "lucide-react";

interface SearchItem {
  query: string;
  description: string;
}

interface RecommendedSearchProps {
  items: SearchItem[];
  onSelect: (query: string) => void;
}

export function RecommendedSearch({ items, onSelect }: RecommendedSearchProps) {
  return (
    <Card className="w-full space-y-4 p-6 bg-card/50 backdrop-blur-sm border-2 border-border/50">
      <div className="flex items-center space-x-2">
        <Command className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">Recommended Searches</h2>
      </div>
      <div className="grid gap-2">
        {items.map((item) => (
          <Button
            key={item.query}
            variant="ghost"
            className="w-full justify-start text-left h-auto py-4 px-4 hover:bg-primary/10 hover:text-primary transition-colors rounded-lg group"
            onClick={() => onSelect(item.query)}
          >
            <div>
              <p className="font-medium group-hover:text-primary transition-colors">
                {item.query}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {item.description}
              </p>
            </div>
          </Button>
        ))}
      </div>
    </Card>
  );
}
