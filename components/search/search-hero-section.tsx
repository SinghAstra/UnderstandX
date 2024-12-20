import { GradientText } from "../custom-ui/gradient-text";

export function SearchHeroSection() {
  return (
    <div className="text-center space-y-6">
      <div className="inline-block bg-primary/10 rounded-full px-4 py-1 text-primary text-sm">
        New: Faster Semantic Search
      </div>
      <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight">
        <GradientText animate className="block">
          Understand GitHub Repositories
        </GradientText>
        into Intelligent Knowledge Bases
      </h1>
    </div>
  );
}
