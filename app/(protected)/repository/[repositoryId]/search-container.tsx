import { useState } from "react";
import { RecommendedSearch } from "./recommended-search";
import { SearchBox } from "./search-box";

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

export function SearchContainer() {
  const [searchInput, setSearchInput] = useState("");
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const handleSearch = (query: string) => {
    console.log("Searching for:", query);
    // Implement search logic
  };

  return (
    <div className="flex items-center justify-center p-8 relative">
      <div className="w-full max-w-2xl relative">
        {/* Decorative elements */}
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl animate-pulse" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl animate-pulse" />

        <div className="relative space-y-6">
          <SearchBox
            value={searchInput}
            onChange={setSearchInput}
            onSearch={handleSearch}
            onFocus={() => setIsSearchModalOpen(true)}
          />

          <RecommendedSearch
            items={recommendedSearches}
            onSelect={handleSearch}
          />
        </div>
      </div>
    </div>
  );
}
