import { RecentSearches } from "./recent-search";
import { SearchBox } from "./search-box";
import { SearchSuggestions } from "./search-suggestion";

interface SearchContainerProps {
  onSearch: (query: string) => void;
}

export function SearchContainer({ onSearch }: SearchContainerProps) {
  return (
    <div className="flex items-center justify-center p-8 relative">
      <div className="w-full max-w-2xl relative">
        {/* Decorative elements */}
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl animate-pulse" />

        <div className="relative space-y-6">
          <SearchBox
            onSearch={onSearch}
            showCloseIcon={false}
            className="border-b mb-2"
          />

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
