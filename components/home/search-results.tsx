import { motion } from "framer-motion";
import { ArrowRight, FileText } from "lucide-react";

const searchResults = [
  {
    title: "Getting Started Guide",
    path: "docs/getting-started.md",
    preview: "Learn how to integrate NavX into your repository...",
    relevance: 98,
  },
  {
    title: "API Documentation",
    path: "docs/api/reference.md",
    preview: "Complete API reference for NavX integration...",
    relevance: 85,
  },
  {
    title: "Configuration Options",
    path: "docs/config.md",
    preview: "Customize NavX behavior with these options...",
    relevance: 75,
  },
];

export function SearchResults() {
  return (
    <div className="mt-4 space-y-3">
      {searchResults.map((result, index) => (
        <motion.div
          key={result.path}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="group relative rounded-lg border bg-card/50 p-4 hover:bg-card"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              <span className="font-medium">{result.title}</span>
            </div>
            <span className="text-xs text-muted-foreground">
              {result.relevance}% match
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{result.preview}</p>
          <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
            <span>{result.path}</span>
          </div>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100">
            <ArrowRight className="h-4 w-4 text-primary" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
