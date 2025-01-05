import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { siteConfig } from "@/config/site";
import { Plus, Search } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { AvatarMenu } from "../custom-ui/avatar-menu";
import SignInButton from "../custom-ui/sign-in-button";
import { Skeleton } from "../ui/skeleton";
import { SearchModal } from "./search-modal";

export function Navbar() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentSearch = searchParams.get("q") || "";
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(currentSearch);

  const handleSearch = (query: string) => {
    if (!query.trim()) return;
    setIsSearchModalOpen(false);
    const params = new URLSearchParams(searchParams);
    if (query) {
      params.set("q", query);
      params.delete("file");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <>
      <nav className="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center px-4">
          <div className="flex items-center gap-6">
            <span className="text-xl leading-loose font-semibold">
              {siteConfig.name}
            </span>
          </div>

          <div className="ml-auto flex items-center gap-4">
            {currentSearch && (
              <div className="relative w-96">
                <Input
                  type="text"
                  placeholder="Search code..."
                  className="w-full pl-10 pr-4"
                  defaultValue={currentSearch}
                  onClick={() => setIsSearchModalOpen(true)}
                />
                <Search className="absolute left-3 top-2 h-5 w-5 text-muted-foreground" />
              </div>
            )}
            <Link href="/new">
              <Button variant="outline">
                <Plus className="h-5 w-5" />
                Connect New Repository
              </Button>
            </Link>
            {status === "loading" ? (
              <Skeleton className="h-10 w-10 rounded-full border-primary border-2" />
            ) : session?.user ? (
              <AvatarMenu />
            ) : (
              <SignInButton />
            )}
          </div>
        </div>
      </nav>

      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        searchInput={searchInput}
        onSearchChange={setSearchInput}
        onSearch={handleSearch}
      />
    </>
  );
}

export default Navbar;
