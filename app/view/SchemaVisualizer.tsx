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

  const calculateTableDimensions = (model) => {
    // Base padding and spacing constants
    const HEADER_HEIGHT = 48; // Height for the table header
    const FIELD_HEIGHT = 40; // Height per field row
    const PADDING = 16; // Padding inside the table
    const MIN_WIDTH = 280; // Minimum table width
    const MAX_WIDTH = 400; // Maximum table width

    // Calculate height based on number of fields
    const contentHeight = (model.fields?.length || 0) * FIELD_HEIGHT;
    const totalHeight = HEADER_HEIGHT + contentHeight + PADDING * 2;

    // Calculate width based on field names and types
    const maxFieldWidth =
      model.fields?.reduce((max, field) => {
        // Estimate text width (rough approximation)
        const nameLength = field.name.length * 8; // 8px per character
        const typeLength = field.type.length * 8;
        const rowWidth = nameLength + typeLength + 80; // 80px for padding and icons
        return Math.max(max, rowWidth);
      }, MIN_WIDTH) || MIN_WIDTH;

    const totalWidth = Math.min(
      MAX_WIDTH,
      Math.max(MIN_WIDTH, maxFieldWidth + PADDING * 2)
    );

    return {
      width: totalWidth,
      height: totalHeight,
    };
  };

  useEffect(() => {
    // Get viewport dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const MARGIN = 40; // Margin between tables

    // Calculate dimensions for each table
    const tablesWithDimensions = models.map((model) => ({
      ...model,
      dimensions: calculateTableDimensions(model),
    }));

    // Find the widest and tallest tables for grid calculations
    const maxTableWidth = Math.max(
      ...tablesWithDimensions.map((t) => t.dimensions.width)
    );
    const maxTableHeight = Math.max(
      ...tablesWithDimensions.map((t) => t.dimensions.height)
    );

    // Calculate number of columns that can fit
    const effectiveWidth = maxTableWidth + MARGIN;
    const maxCols = Math.floor((viewportWidth - MARGIN) / effectiveWidth);
    const numCols = Math.min(maxCols, Math.ceil(Math.sqrt(models.length)));

    // Calculate grid position
    const numRows = Math.ceil(models.length / numCols);
    const totalGridWidth = numCols * effectiveWidth;
    const totalGridHeight = numRows * (maxTableHeight + MARGIN);

    // Center the entire grid
    const startX = Math.max(MARGIN, (viewportWidth - totalGridWidth) / 2);
    const startY = Math.max(MARGIN, (viewportHeight - totalGridHeight) / 2);

    // Calculate positions
    const initialPositions = tablesWithDimensions.map((model, index) => {
      const col = index % numCols;
      const row = Math.floor(index / numCols);

      // Center smaller tables within their grid cell
      const widthDiff = maxTableWidth - model.dimensions.width;
      const heightDiff = maxTableHeight - model.dimensions.height;

      return {
        id: model.name,
        dimensions: model.dimensions,
        position: {
          x: startX + col * effectiveWidth + widthDiff / 2,
          y: startY + row * (maxTableHeight + MARGIN) + heightDiff / 2,
        },
      };
    });

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
      <div className="relative w-full flex-1 mt-16">
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

        <DragOverlay>
          {activeId && models.find((m) => m.name === activeId) ? (
            <div className="opacity-80">
              <ModelTable model={models.find((m) => m.name === activeId)!} />
            </div>
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
}

export default SchemaVisualizer;
