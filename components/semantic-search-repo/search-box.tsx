import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (value: string) => void;
}

export function SearchBox({ value, onChange, onSearch }: SearchBoxProps) {
  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-primary/10 blur-xl rounded-2xl group-hover:bg-primary/20 transition-colors" />
      <div className="relative">
        <Input
          type="text"
          placeholder="Search using natural language..."
          className="w-full pl-12 pr-4 py-6 text-lg bg-background/50 backdrop-blur-sm border-2 border-border/50 hover:border-primary/50 focus:border-primary transition-colors rounded-xl shadow-lg"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSearch(value);
            }
          }}
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      </div>
    </div>
  );
}
