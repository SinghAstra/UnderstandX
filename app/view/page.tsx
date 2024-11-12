"use client";
import { Model } from "@/types/schema";
import { useEffect, useState } from "react";
import { parseSchemaAction } from "../actions/schema/parse-schema";
import { SchemaVisualizer } from "./SchemaVisualizer";

function SchemaViz() {
  const [schemaData, setSchemaData] = useState<{
    models: Model[];
    error?: string;
  }>({ models: [] });

  useEffect(() => {
    const loadSchema = async () => {
      const result = await parseSchemaAction();
      setSchemaData(result);
    };
    loadSchema();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b">
        <div className="container mx-auto py-4">
          <h1 className="text-2xl font-bold">Schema Visualizer</h1>
        </div>
      </header>
      <main className="container mx-auto">
        <SchemaVisualizer models={schemaData.models} error={schemaData.error} />
      </main>
    </div>
  );
}

export default SchemaViz;
