import { Button } from "@/components/ui/button";
import { Icons } from "../Icons";

export function HeroSection() {
  return (
    <div className="text-center space-y-8">
      <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400 animate-gradient">
        Democratizing Technical Knowledge
      </h1>
      <div className="max-w-2xl mx-auto">
        <p className="typewriter text-xl md:text-2xl text-muted-foreground mb-8">
          Explore repositories with AI-powered insights
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button size="lg" className="group">
          Explore Repositories
          <Icons.arrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
        <Button size="lg" variant="outline">
          <Icons.gitLogo className="mr-2 h-4 w-4" />
          Star on GitHub
        </Button>
      </div>
    </div>
  );
}
