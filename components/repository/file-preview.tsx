"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, History } from "lucide-react";

export function FilePreview() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="rounded-full bg-primary/10 p-2">
            <Code className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium text-foreground">SearchEngine.ts</h3>
            <p className="text-xs text-muted-foreground">
              Last updated 2 hours ago
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground hover:bg-primary/10"
        >
          <History className="mr-2 h-4 w-4" />
          History
        </Button>
      </div>

      <Tabs defaultValue="code" className="w-full">
        <TabsList className="bg-secondary/50 border-b border-border/50">
          <TabsTrigger
            value="code"
            className="data-[state=active]:bg-primary/10"
          >
            Code
          </TabsTrigger>
          <TabsTrigger
            value="preview"
            className="data-[state=active]:bg-primary/10"
          >
            Preview
          </TabsTrigger>
        </TabsList>
        <TabsContent value="code" className="mt-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
            <pre className="relative rounded-lg bg-secondary/30 p-4 text-foreground border border-border/50 overflow-x-auto">
              {`export class SearchEngine implements ISearchEngine {
  private index: SearchIndex;
              
  constructor() {
    this.index = new SearchIndex();
  }
              
  public async search(query: string): Promise<SearchResult[]> {
    // Implementation
  }
}`}
            </pre>
          </div>
        </TabsContent>
        <TabsContent value="preview">
          <div className="mt-4 rounded-lg border border-border/50 bg-secondary/30 p-4 text-foreground">
            <p>Rendered preview of the file (if applicable)</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
