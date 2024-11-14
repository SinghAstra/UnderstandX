import { Alert, AlertDescription } from "@/components/ui/alert";
import { Model } from "@/types/schema";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useDraggable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { AlertCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { ModelTable } from "./ModelTable";

interface Position {
  x: number;
  y: number;
}

interface ModelPosition {
  id: string;
  position: Position;
}

interface SchemaVisualizerProps {
  models: Model[];
  error?: string;
}

const DraggableModel = ({
  model,
  position,
  isDragging,
}: {
  model: Model;
  position: Position;
  isDragging: boolean;
}) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: model.name,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0 : 1,
    position: "absolute" as const,
    top: position.y,
    left: position.x,
    touchAction: "none",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-move"
    >
      <ModelTable model={model} />
    </div>
  );
};

export function SchemaVisualizer({ models, error }: SchemaVisualizerProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [positions, setPositions] = useState<ModelPosition[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Initialize positions in a grid layout
  useEffect(() => {
    const gridCols = 3;
    const spacing = 320;
    const initialPositions = models.map((model, index) => ({
      id: model.name,
      position: {
        x: (index % gridCols) * spacing + 20,
        y: Math.floor(index / gridCols) * spacing + 20,
      },
    }));
    setPositions(initialPositions);
  }, [models]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event;

    setPositions((prevPositions) =>
      prevPositions.map((pos) => {
        if (pos.id === active.id) {
          return {
            ...pos,
            position: {
              x: pos.position.x + delta.x,
              y: pos.position.y + delta.y,
            },
          };
        }
        return pos;
      })
    );

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
      <div className="relative w-full flex-1">
        <div className="absolute inset-0">
          {models.map((model) => {
            const position = positions.find((p) => p.id === model.name)
              ?.position || { x: 0, y: 0 };
            return (
              <DraggableModel
                key={model.name}
                model={model}
                position={position}
                isDragging={activeId === model.name}
              />
            );
          })}
        </div>
      </div>

      <DragOverlay>
        {activeId && models.find((m) => m.name === activeId) ? (
          <div className="opacity-80">
            <ModelTable model={models.find((m) => m.name === activeId)!} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

export default SchemaVisualizer;
