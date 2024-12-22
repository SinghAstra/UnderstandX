"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SearchFiltersProps {
  language: string;
  fileType: string;
  onLanguageChange: (value: string) => void;
  onFileTypeChange: (value: string) => void;
}

export function SearchFilters({
  language,
  fileType,
  onLanguageChange,
  onFileTypeChange,
}: SearchFiltersProps) {
  return (
    <div className="flex flex-wrap gap-4">
      <Select value={language} onValueChange={onLanguageChange}>
        <SelectTrigger className="w-[180px] bg-secondary/50 border-border/50">
          <SelectValue placeholder="Language" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Languages</SelectItem>
          <SelectItem value="javascript">JavaScript</SelectItem>
          <SelectItem value="typescript">TypeScript</SelectItem>
          <SelectItem value="python">Python</SelectItem>
        </SelectContent>
      </Select>

      <Select value={fileType} onValueChange={onFileTypeChange}>
        <SelectTrigger className="w-[180px] bg-secondary/50 border-border/50">
          <SelectValue placeholder="File Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Files</SelectItem>
          <SelectItem value="code">Code Files</SelectItem>
          <SelectItem value="docs">Documentation</SelectItem>
          <SelectItem value="test">Test Files</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
