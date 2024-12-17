import FeatureGrid from "./feature-card";
import SearchDemo from "./search-demo";

const DemoCard = () => {
  return (
    <div className="relative w-full max-w-xl">
      {/* Decorative elements */}
      <div className="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl" />

      {/* Main content */}
      <div className="relative rounded-xl bg-background/50 backdrop-blur-lg shadow-2xl border border-border/50 p-6">
        <FeatureGrid />
        <SearchDemo />
      </div>
    </div>
  );
};

export default DemoCard;
