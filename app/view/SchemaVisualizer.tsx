import { Alert, AlertDescription } from "@/components/ui/alert";
import { Model } from "@/types/schema";
import { AlertCircle } from "lucide-react";
import { ModelTable } from "./ModelTable";

interface SchemaVisualizerProps {
  models: Model[];
  error?: string;
}

export function SchemaVisualizer({ models, error }: SchemaVisualizerProps) {
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {models.map((model) => (
          <ModelTable key={model.name} model={model} />
        ))}
      </div>
    </div>
  );
}
