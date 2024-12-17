import { Features } from "@/components/home/features";
import { HeroSection } from "@/components/home/hero-section";
import { ProblemSolution } from "@/components/home/problem-solution";

export default function Home() {
  return (
    <main className="mt-32">
      <HeroSection />
      <ProblemSolution />
      <Features />
    </main>
  );
}
