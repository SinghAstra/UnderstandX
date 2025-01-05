import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/utils";
import { Search, X } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";

interface SearchBoxProps {
  value?: string;
  onSearch: (value: string) => void;
  showCloseIcon: boolean;
  className?: string;
  onClose?: () => void;
}

export function SearchBox({
  value,
  onSearch,
  showCloseIcon,
  onClose,
  className,
}: SearchBoxProps) {
  const [searchInput, setSearchInput] = useState(value || "");

  return (
    <div className={cn("relative flex items-center", className)}>
      <Search className="absolute left-4 h-5 w-5 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search code..."
        className="w-full pl-12 pr-24 py-6 text-lg bg-background/50 border-2 border-border/50 focus:border-primary transition-all rounded-lg"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onSearch(searchInput);
          }
        }}
        autoFocus
      />
      <div className="absolute right-4 flex items-center gap-2">
        <kbd className="px-2 py-1 text-xs font-mono bg-muted rounded">↵</kbd>
        {showCloseIcon && onClose && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
