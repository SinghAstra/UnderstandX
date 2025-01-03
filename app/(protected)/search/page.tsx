import { Navbar } from "@/components/home/home-navbar";
import { SearchHeroSection } from "@/components/search/search-hero-section";
import { SearchRepositoryForm } from "@/components/search/search-repository-form";

export default function SearchPage() {
  return (
    <main className="min-h-screen flex items-center relative">
      <Navbar />
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center space-y-12 mt-20 z-10">
        <SearchHeroSection />
        <SearchRepositoryForm />
      </div>
    </main>
  );
}
