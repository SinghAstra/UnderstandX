import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { Button } from "../ui/button";
import { RecentSearches } from "./recent-search";
import { SearchSuggestions } from "./search-suggestion";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  searchInput: string;
  onSearchChange: (value: string) => void;
  onSearch: (query: string) => void;
}

export function SearchModal({
  isOpen,
  onClose,
  searchInput,
  onSearchChange,
  onSearch,
}: SearchModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-x-0 top-24 max-w-3xl mx-auto p-4">
        <Card className="border-2 bg-card/50 backdrop-blur-sm shadow-2xl">
          {/* Search Input */}
          <div className="p-4 border-b">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/5 blur-lg rounded-lg" />
              <div className="relative flex items-center">
                <Search className="absolute left-4 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search code..."
                  className="w-full pl-12 pr-24 py-6 text-lg bg-background/50 border-2 border-border/50 focus:border-primary transition-all rounded-lg"
                  value={searchInput}
                  onChange={(e) => onSearchChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      onSearch(searchInput);
                    }
                  }}
                  autoFocus
                />
                <div className="absolute right-4 flex items-center gap-2">
                  <kbd className="px-2 py-1 text-xs font-mono bg-muted rounded">
                    ↵
                  </kbd>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={onClose}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="max-h-[60vh] overflow-y-auto">
            <div className="p-4 space-y-6">
              <RecentSearches onSelect={onSearch} />
              <SearchSuggestions onSelect={onSearch} />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
