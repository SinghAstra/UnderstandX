import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Code2, FileSearch } from "lucide-react";

export function ProblemSolution() {
  return (
    <div className="py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">The Problem</h2>
            <Card>
              <CardContent className="p-6 space-y-4">
                <FileSearch className="h-12 w-12 text-destructive" />
                <h3 className="text-xl font-semibold">Complex Documentation</h3>
                <p className="text-muted-foreground">
                  Developers spend countless hours navigating through complex
                  documentation, struggling to find relevant information quickly
                  and efficiently.
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Our Solution</h2>
            <div className="space-y-4">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <BookOpen className="h-12 w-12 text-primary" />
                  <h3 className="text-xl font-semibold">
                    Smart Documentation Analysis
                  </h3>
                  <p className="text-muted-foreground">
                    AI-powered analysis breaks down complex documentation into
                    digestible, context-aware chunks.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 space-y-4">
                  <Code2 className="h-12 w-12 text-primary" />
                  <h3 className="text-xl font-semibold">
                    Intelligent Code Understanding
                  </h3>
                  <p className="text-muted-foreground">
                    Advanced semantic analysis helps you understand code
                    patterns and best practices instantly.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
