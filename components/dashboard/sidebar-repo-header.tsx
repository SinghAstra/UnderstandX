import { Plus, Search } from "lucide-react";
import Link from "next/link";
import React from "react";
import { SidebarRepoHeaderSkeleton } from "../skeleton/sidebar-repo-header-skeleton";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface SidebarRepoHeaderProps {
  loading?: boolean;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const SidebarRepoHeader = ({
  loading,
  value,
  onChange,
}: SidebarRepoHeaderProps) => {
  if (loading) {
    return <SidebarRepoHeaderSkeleton />;
  }
  return (
    <div className="p-4">
      <Link href="/new">
        <Button className="w-full" size="sm">
          <Plus className="mr-2 h-4 w-4" />
          New Repository
        </Button>
      </Link>
      <div className="relative mt-2">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search repositories..."
          className="pl-8"
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export default SidebarRepoHeader;
