"use client";
import { Field, Model, parseSchema } from "@/types/schema";
import { Grip } from "lucide-react";
import React, { useState } from "react";
import Draggable from "react-draggable";

// Helper to get center points of a model box
const getModelCenter = (model: Model) => ({
  x: model.position.x + 100,
  y: model.position.y + (model.fields.length * 30 + 60) / 2,
});

const ModelTable = ({
  model,
  onDragStop,
  onDrag,
}: {
  model: Model;
  onDragStop: (name: string, x: number, y: number) => void;
  onDrag: () => void;
}) => {
  const handleDragStop = (_e: unknown, data: { x: number; y: number }) => {
    onDragStop(model.name, data.x, data.y);
  };

  return (
    <Draggable
      defaultPosition={{ x: model.position.x, y: model.position.y }}
      onStop={handleDragStop}
      onDrag={onDrag}
      bounds="parent"
      handle=".drag-handle"
    >
      <div
        className="absolute bg-card rounded-lg shadow-xl border border-border"
        style={{ width: "250px" }}
      >
        <div className="bg-primary text-primary-foreground px-4 py-2 rounded-t-lg font-medium flex justify-between items-center">
          <span>{model.name}</span>
          <Grip className="w-4 h-4 drag-handle cursor-move opacity-50 hover:opacity-100 transition-opacity" />
        </div>
        <div className="p-4 space-y-1">
          {model.fields.map((field) => (
            <FieldRow key={field.name} field={field} />
          ))}
        </div>
      </div>
    </Draggable>
  );
};

const FieldRow = ({ field }: { field: Field }) => {
  const getFieldIcon = () => {
    if (field.isPrimaryKey) return "🔑";
    if (field.isForeignKey) return "🔗";
    if (field.isUnique) return "👤";
    return "";
  };

  return (
    <div className="flex items-center gap-2 py-0.5 text-sm group">
      <span className="w-4 text-xs">{getFieldIcon()}</span>
      <span className="font-medium text-foreground">{field.name}</span>
      <span className="text-muted-foreground">
        {field.type}
        {field.isList && "[]"}
        {!field.isRequired && "?"}
      </span>
      {field.isRelation && (
        <span className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded ml-auto">
          → {field.referencedModel}
        </span>
      )}
    </div>
  );
};

const RelationshipLines = ({ models }: { models: Model[] }) => {
  // Draw relationship lines using SVG
  const getRelationshipPaths = () => {
    const paths: JSX.Element[] = [];

    models.forEach((sourceModel) => {
      sourceModel.fields.forEach((field) => {
        if (field.isRelation) {
          const targetModel = models.find(
            (m) => m.name === field.referencedModel
          );
          if (targetModel) {
            const start = getModelCenter(sourceModel);
            const end = getModelCenter(targetModel);

            // Calculate control points for curve
            const midX = (start.x + end.x) / 2;
            const controlPoint1 = `${midX},${start.y}`;
            const controlPoint2 = `${midX},${end.y}`;

            paths.push(
              <path
                key={`${sourceModel.name}-${field.name}-${targetModel.name}`}
                d={`M${start.x},${start.y} C${controlPoint1} ${controlPoint2} ${end.x},${end.y}`}
                stroke="rgb(100, 116, 139)"
                strokeWidth="1"
                fill="none"
                markerEnd="url(#arrowhead)"
                className="opacity-50"
              />
            );
          }
        }
      });
    });

    return paths;
  };

  return (
    <svg className="absolute inset-0 pointer-events-none">
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon
            points="0 0, 10 3.5, 0 7"
            fill="rgb(100, 116, 139)"
            className="opacity-50"
          />
        </marker>
      </defs>
      {getRelationshipPaths()}
    </svg>
  );
};

const SchemaVisualizer = () => {
  const [models, setModels] = useState(parseSchema());
  const [, forceUpdate] = useState({});

  const handleUpdatePosition = (name: string, x: number, y: number) => {
    setModels((prevModels) =>
      prevModels.map((model) =>
        model.name === name ? { ...model, position: { x, y } } : model
      )
    );
  };

  return (
    <div className="w-full h-screen p-4 bg-white relative overflow-hidden">
      <div className="w-full h-full relative bg-secondary/10 rounded-lg border border-border bg-white">
        <RelationshipLines models={models} />
        {models.map((model) => (
          <ModelTable
            key={model.name}
            model={model}
            onDragStop={handleUpdatePosition}
            onDrag={() => forceUpdate({})}
          />
        ))}
      </div>
    </div>
  );
};

export default SchemaVisualizer;
