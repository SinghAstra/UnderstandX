"use client";
import { Field, Model, parseSchema } from "@/types/schema";
import React, { useState } from "react";
import Draggable from "react-draggable";

interface ModelTableProps {
  model: Model;
  onDragStop: (name: string, x: number, y: number) => void;
}

interface FieldProps {
  field: Field;
}

interface CanvasProps {
  models: Model[];
  onUpdatePosition: (name: string, x: number, y: number) => void;
}

const ModelTable: React.FC<ModelTableProps> = ({ model, onDragStop }) => {
  const handleDragStop = (_e: unknown, data: { x: number; y: number }) => {
    onDragStop(model.name, data.x, data.y);
  };

  return (
    <Draggable
      defaultPosition={{ x: model.position.x, y: model.position.y }}
      onStop={handleDragStop}
      bounds="parent"
      handle=".drag-handle"
    >
      <div
        className="absolute bg-card rounded-lg shadow-xl border border-border"
        style={{ minWidth: "200px" }}
      >
        <div className="bg-primary text-primary-foreground px-4 py-2 rounded-t-lg font-medium drag-handle cursor-move">
          {model.name}
        </div>
        <div className="p-4">
          {model.fields.map((field) => (
            <FieldComp key={field.name} field={field} />
          ))}
        </div>
      </div>
    </Draggable>
  );
};

const FieldComp: React.FC<FieldProps> = ({ field }) => {
  return (
    <div className="flex items-center gap-2 py-1">
      <span className="font-medium text-foreground">{field.name}</span>
      <span className="text-sm text-muted-foreground">
        {field.type}
        {field.isList && "[]"}
      </span>
      {field.isRelation && (
        <span className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded">
          → {field.relationTo}
        </span>
      )}
    </div>
  );
};

export const Canvas: React.FC<CanvasProps> = ({ models, onUpdatePosition }) => {
  return (
    <div
      className="w-full h-full relative bg-background overflow-hidden"
      style={{
        backgroundImage:
          "radial-gradient(circle, hsl(217.2 32.6% 17.5%) 1px, transparent 1px)",
        backgroundSize: "20px 20px",
      }}
    >
      {models.map((model) => (
        <ModelTable
          key={model.name}
          model={model}
          onDragStop={onUpdatePosition}
        />
      ))}
    </div>
  );
};

const SchemaVisualizer = () => {
  const [models, setModels] = useState(parseSchema());

  const handleUpdatePosition = (name: string, x: number, y: number) => {
    setModels((prevModels) =>
      prevModels.map((model) =>
        model.name === name ? { ...model, position: { x, y } } : model
      )
    );
  };

  return (
    <div className="w-full h-screen p-4 bg-background">
      <Canvas models={models} onUpdatePosition={handleUpdatePosition} />
    </div>
  );
};

export default SchemaVisualizer;
