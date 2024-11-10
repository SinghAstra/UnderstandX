"use client";
import { Field, Model, parseSchema } from "@/types/schema";
import React, { useState } from "react";

interface ModelTableProps {
  model: Model;
}

interface FieldProps {
  field: Field;
}

interface CanvasProps {
  models: Model[];
}

const ModelTable: React.FC<ModelTableProps> = ({ model }) => {
  return (
    <div
      className="absolute bg-card rounded-lg shadow-xl border border-border"
      style={{
        left: model.position.x,
        top: model.position.y,
        minWidth: "200px",
      }}
    >
      <div className="bg-primary text-primary-foreground px-4 py-2 rounded-t-lg font-medium">
        {model.name}
      </div>
      <div className="p-4">
        {model.fields.map((field) => (
          <FieldComp key={field.name} field={field} />
        ))}
      </div>
    </div>
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

export const Canvas: React.FC<CanvasProps> = ({ models }) => {
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
        <ModelTable key={model.name} model={model} />
      ))}
    </div>
  );
};

const SchemaVisualizer = () => {
  const [models] = useState(parseSchema());

  return (
    <div className="w-full h-screen p-4 bg-background">
      <Canvas models={models} />
    </div>
  );
};

export default SchemaVisualizer;
