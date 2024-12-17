import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { Icons } from "../Icons";
import { RepoExplorer } from "./repo-explorer";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid min-h-screen grid-cols-1 items-center gap-8 lg:grid-cols-2">
          <div className="flex flex-col items-start justify-center space-y-8 pt-20 lg:pt-0">
            <div className="flex h-10 items-center rounded-full bg-primary/10 px-4 text-primary">
              <Icons.gitLogo className="mr-2 h-5 w-5" />
              <span className="text-sm font-medium">Now on GitHub</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Understand Repo with{" "}
              <span className="bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent">
                Semantic Searching
              </span>
            </h1>

            <p className="text-lg text-muted-foreground">
              Transform complex repository into accessible, searchable knowledge
              landscapes.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Button size="lg" className="group">
                Try {siteConfig.name} Free
                <Icons.arrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>

          <RepoExplorer />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
