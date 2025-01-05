import { useState } from "react";
import { RecommendedSearch } from "./recommended-search";
import { SearchBox } from "./search-box";

interface SearchContainerProps {
  onSearch: (query: string) => void;
}

const recommendedSearches = [
  {
    query: "authentication flow",
    description: "Find authentication implementation patterns",
  },
  {
    query: "database schema",
    description: "Explore database models and relationships",
  },
  {
    query: "api endpoints",
    description: "Discover API routes and handlers",
  },
];

export function SearchContainer({ onSearch }: SearchContainerProps) {
  const [searchInput, setSearchInput] = useState("");

  return (
    <div className="flex items-center justify-center p-8 relative">
      <div className="w-full max-w-2xl relative">
        {/* Decorative elements */}
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl animate-pulse" />

        <div className="relative space-y-6">
          <SearchBox
            value={searchInput}
            onChange={setSearchInput}
            onSearch={onSearch}
          />

          <RecommendedSearch items={recommendedSearches} onSelect={onSearch} />
        </div>
      </div>
    </div>
  );
}
