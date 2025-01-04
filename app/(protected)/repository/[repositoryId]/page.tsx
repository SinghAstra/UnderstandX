"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { SearchContainer } from "./search-container";

interface RecommendedSearch {
  query: string;
  description: string;
}

const RepositoryPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Get current states
  const currentSearch = searchParams.get("q") || "";
  const selectedFile = searchParams.get("file") || "";

  // Local states
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(currentSearch);

  // TODO:Mock recommended searches - replace with actual data
  const recommendedSearches: RecommendedSearch[] = [
    {
      query: "useEffect dependencies",
      description: "Find examples of useEffect hook usage with dependencies",
    },
    {
      query: "api endpoints",
      description: "Locate API endpoint definitions and implementations",
    },
    {
      query: "auth middleware",
      description: "Search for authentication middleware patterns",
    },
  ];

  const handleSearch = (query: string) => {
    if (!query.trim()) return;
    setIsSearchModalOpen(false);
    const params = new URLSearchParams(searchParams);
    if (query) {
      params.set("q", query);
    } else {
      params.delete("q");
    }
    router.push(`${pathname}?${params.toString()}`);
    setIsSearchModalOpen(false);
  };

  // const handleFileSelect = (filePath: string) => {
  //   const params = new URLSearchParams(searchParams);
  //   params.set("file", filePath);
  //   router.push(`${pathname}?${params.toString()}`);
  // };

  // Initial UI - Centered search when no query
  if (!currentSearch) {
    return (
      // <div className=" flex items-center justify-center p-8 relative">
      //   <div className="w-full max-w-2xl relative backdrop-blur-sm bg-background border-2 py-2 px-4 rounded-md">
      //     {/* Decorative elements */}
      //     <div className="absolute -top-8 -right-8 h-48 w-48 rounded-full bg-primary/20 blur-3xl" />
      //     <div className="absolute -bottom-8 -left-8 h-48 w-48 rounded-full bg-purple-500/20 blur-3xl" />
      //     <div className="pt-6 z-20">
      //       <div className="flex flex-col items-center space-y-6">
      //         <div className="w-full relative">
      //           <Input
      //             type="text"
      //             placeholder="Search code..."
      //             className="w-full pl-10 pr-4 py-2"
      //             value={searchInput}
      //             onChange={(e) => setSearchInput(e.target.value)}
      //             onKeyDown={(e) => {
      //               if (e.key === "Enter") {
      //                 handleSearch(searchInput);
      //               }
      //             }}
      //             onClick={() => setIsSearchModalOpen(true)}
      //           />
      //           <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
      //         </div>

      //         {/* Recommended Searches */}
      //         <div className="w-full space-y-4">
      //           <h2 className="text-lg font-semibold">Recommended Searches</h2>
      //           <div className="grid gap-2">
      //             {recommendedSearches.map((item) => (
      //               <Button
      //                 key={item.query}
      //                 variant="ghost"
      //                 className="w-full justify-start text-left h-auto py-3"
      //                 onClick={() => handleSearch(item.query)}
      //               >
      //                 <div>
      //                   <p className="font-medium">{item.query}</p>
      //                   <p className="text-sm text-muted-foreground">
      //                     {item.description}
      //                   </p>
      //                 </div>
      //               </Button>
      //             ))}
      //           </div>
      //         </div>
      //       </div>
      //     </div>
      //   </div>
      // </div>
      <SearchContainer />
    );
  }

  // Search results view with split pane
  return (
    <div className="h-screen flex flex-col">
      {/* Top Navigation with Search */}
      <div className="border-b p-4">
        <div className="max-w-screen-xl mx-auto flex items-center gap-4">
          <div className="relative flex-1 max-w-xl">
            <Input
              type="text"
              placeholder="Search code..."
              className="w-full pl-10 pr-4 py-2"
              value={currentSearch}
              onClick={() => setIsSearchModalOpen(true)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* File List */}
        <div className="w-80 border-r overflow-y-auto p-4">
          <h2 className="font-semibold mb-4">Search Results</h2>
          {/* Add your FileList component here */}
        </div>

        {/* File Viewer */}
        <div className="flex-1 overflow-y-auto p-4">
          {selectedFile ? (
            <div>{/* Add your FileViewer component here */}</div>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Select a file to view its contents
            </div>
          )}
        </div>
      </div>

      {/* Search Modal */}
      {isSearchModalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm">
          <div className="fixed inset-x-0 top-0 p-4">
            <Card>
              <CardContent className="pt-6 pb-4">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search code..."
                    className="w-full pl-10 pr-4 py-2"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSearch(searchInput);
                      }
                    }}
                    autoFocus
                  />
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                </div>

                {/* Modal Search Suggestions */}
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2">Recommended</h3>
                  <div className="space-y-1">
                    {recommendedSearches.map((item) => (
                      <Button
                        key={item.query}
                        variant="ghost"
                        className="w-full justify-start text-left h-auto py-2"
                        onClick={() => handleSearch(item.query)}
                      >
                        <div>
                          <p className="font-medium">{item.query}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.description}
                          </p>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Click outside to close */}
          <div
            className="fixed inset-0 -z-10"
            onClick={() => setIsSearchModalOpen(false)}
          />
        </div>
      )}
    </div>
  );
};

export default RepositoryPage;
