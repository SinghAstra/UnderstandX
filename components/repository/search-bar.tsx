"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { SearchBarSkeleton } from "../skeleton/search-bar-skeleton";

interface SearchBarProps {
  value?: string;
  onChange?: (value: string) => void;
  isLoading?: boolean;
}

export function SearchBar({ value, onChange, isLoading }: SearchBarProps) {
  if (isLoading || !onChange) {
    return <SearchBarSkeleton />;
  }
  return (
    <div className="relative">
      <Search className="absolute left-3 top-3 h-5 w-5 text-primary" />
      <Input
        className="w-full bg-secondary/50 pl-10 h-12 text-foreground placeholder:text-muted-foreground border-border/50 focus:border-primary/50 focus:ring-primary/20"
        placeholder="Search code, functions, or concepts..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
