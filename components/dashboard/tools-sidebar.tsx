"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

export function ToolsSidebar() {
  return (
    <div className="w-80 border-l bg-card p-4">
      <h2 className="mb-4 text-lg font-semibold">NavX Ecosystem</h2>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            ChatRepoX
          </CardTitle>
          <CardDescription>
            Chat with your GitHub repositories using AI
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">
            Ask questions about your code and get intelligent responses based on
            your repository content.
          </p>
          <Button className="w-full">Try ChatRepoX</Button>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-muted-foreground">Coming Soon</CardTitle>
          <CardDescription>
            More tools are being developed to enhance your development workflow.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
