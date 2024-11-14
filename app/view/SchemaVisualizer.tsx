import { Alert, AlertDescription } from "@/components/ui/alert";
import { Model } from "@/types/schema";
import {
  DndContext,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { AlertCircle } from "lucide-react";
import { useState } from "react";
import { ModelTable } from "./ModelTable";

interface SchemaVisualizerProps {
  models: Model[];
  error?: string;
}

export function SchemaVisualizer({ models, error }: SchemaVisualizerProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const activeModel = activeId ? models.find((m) => m.name === activeId) : null;

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = () => {
    setActiveId(null);
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="w-full p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {models.map((model) => (
          <div key={model.name}>
            <ModelTable model={model} />
          </div>
        ))}
      </div>

      <DragOverlay>
        {activeId && activeModel ? (
          <div className="opacity-80">
            <ModelTable model={activeModel} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
