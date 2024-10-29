"use client";
import { ScaleIn } from "@/components/animations/scale-in";
import { Spotlight } from "@/components/animations/spotlight";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { GitBranch, GitCommit, Github } from "lucide-react";

interface RepoCardProps {
  name: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  className?: string;
}

export function RepoCard({
  name,
  description,
  language,
  stars,
  forks,
  className,
}: RepoCardProps) {
  return (
    <ScaleIn>
      <Spotlight className={className}>
        <Card className="group relative overflow-hidden border p-6 hover:border-primary/50">
          <div className="flex items-center gap-4">
            <Github className="h-8 w-8 text-primary" />
            <div>
              <h3 className="font-semibold">{name}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-4">
            <Badge variant="secondary">{language}</Badge>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <GitBranch className="h-4 w-4" />
              {forks}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <GitCommit className="h-4 w-4" />
              {stars}
            </div>
          </div>
        </Card>
      </Spotlight>
    </ScaleIn>
  );
}
