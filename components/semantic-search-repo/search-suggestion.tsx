import { Button } from "@/components/ui/button";
import { ArrowRight, Command } from "lucide-react";

interface SearchSuggestionsProps {
  onSearch: (query: string) => void;
}

export function SearchSuggestions({ onSearch }: SearchSuggestionsProps) {
  const suggestions = [
    {
      query: "useEffect dependencies",
      description: "Find examples of useEffect hook usage with dependencies",
      category: "React Hooks",
    },
    {
      query: "api endpoints",
      description: "Locate API endpoint definitions and implementations",
      category: "Backend",
    },
    {
      query: "auth middleware",
      description: "Search for authentication middleware patterns",
      category: "Security",
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <Command className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">Suggested Searches</h3>
      </div>
      <div className="grid gap-2">
        {suggestions.map((item) => (
          <Button
            key={item.query}
            variant="ghost"
            className="w-full justify-start text-left h-auto p-4 hover:bg-primary/10 group"
            onClick={() => onSearch(item.query)}
          >
            <div className="flex items-center justify-between w-full">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">
                    {item.category}
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium group-hover:text-primary transition-colors">
                    {item.query}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}
