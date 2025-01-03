"use client";

import Features from "@/components/home/features";
import { Hero } from "@/components/home/hero";
import { features } from "@/config/feature";

export default function Home() {
  return (
    <main className="flex flex-col">
      <Hero />
      <Features features={features} />
    </main>
  );
}
