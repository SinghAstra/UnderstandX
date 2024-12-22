"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
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
