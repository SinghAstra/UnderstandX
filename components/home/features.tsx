import { Card, CardContent } from "@/components/ui/card";
import {
  BookMarked,
  GitBranch,
  Search,
  Share2,
  Sparkles,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Get instant answers to your technical questions",
  },
  {
    icon: Search,
    title: "Smart Search",
    description: "Find exactly what you need with semantic search",
  },
  {
    icon: GitBranch,
    title: "Version Control",
    description: "Track changes and evolution of documentation",
  },
  {
    icon: Share2,
    title: "Collaboration",
    description: "Share insights with your team effortlessly",
  },
  {
    icon: BookMarked,
    title: "Custom Collections",
    description: "Create personalized documentation collections",
  },
  {
    icon: Sparkles,
    title: "AI Insights",
    description: "Get AI-powered recommendations and insights",
  },
];

export function Features() {
  return (
    <div className="py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group hover:shadow-lg transition-shadow"
            >
              <CardContent className="p-6">
                <feature.icon className="h-12 w-12 mb-4 text-primary group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
