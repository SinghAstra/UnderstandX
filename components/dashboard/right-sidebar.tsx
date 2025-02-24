"use client";

import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function RightSidebar() {
  return (
    <div className="w-80 bg-background py-2 pr-2 ">
      {/* <Card>
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
      </Card> */}

      <Card>
        <CardHeader>
          <CardTitle className="text-muted-foreground">
            Follow For Updates
          </CardTitle>
          <CardDescription>
            More tools are being developed to enhance your development workflow.
          </CardDescription>
          <a
            className={cn(buttonVariants({ variant: "outline" }))}
            href={siteConfig.links.twitter}
            target="_blank"
          >
            Twitter
          </a>
        </CardHeader>
      </Card>
    </div>
  );
}
