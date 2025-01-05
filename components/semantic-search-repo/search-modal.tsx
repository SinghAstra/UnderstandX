import { RecentSearches } from "./recent-search";
import { SearchBox } from "./search-box";
import { SearchSuggestions } from "./search-suggestion";

interface SearchModalProps {
  value?: string;
  isOpen: boolean;
  onClose: () => void;
  onSearch: (query: string) => void;
}

export function SearchModal({
  value,
  isOpen,
  onClose,
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
      <div className="fixed inset-x-0 top-12 max-w-3xl mx-auto p-4">
        <div className="border-2 bg-card/50 backdrop-blur-sm shadow-2xl rounded-md">
          {/* Search Input */}
          <SearchBox
            value={value}
            onSearch={onSearch}
            showCloseIcon={true}
            onClose={onClose}
            className="m-4"
          />

          <div className="max-h-[60vh] overflow-y-auto ">
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
