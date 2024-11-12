"use client";
import { Field, Model, parseSchema } from "@/types/schema";
import { Grip } from "lucide-react";
import React, { useState } from "react";
import Draggable from "react-draggable";

interface ModelTableProps {
  model: Model;
  onDragStop: (name: string, x: number, y: number) => void;
}

interface FieldProps {
  field: Field;
}

const ModelTable = ({ model, onDragStop }: ModelTableProps) => {
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
        <div className="bg-primary text-primary-foreground px-4 py-2 rounded-t-lg font-medium flex justify-between">
          {model.name}
          <Grip className="w-5 h-5 drag-handle cursor-move" />
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

const FieldComp = ({ field }: FieldProps) => {
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
      <div className="w-full h-full relative bg-background overflow-hidden">
        {models.map((model) => (
          <ModelTable
            key={model.name}
            model={model}
            onDragStop={handleUpdatePosition}
          />
        ))}
      </div>
    </div>
  );
};

export default SchemaVisualizer;
