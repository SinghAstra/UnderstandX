import { defaultSchemaString, Field, Model } from "@/types/schema";

export const parseSchema = (
  schemaString: string = defaultSchemaString
): Model[] => {
  const models: Model[] = [];
  const modelDefinitions = schemaString.split("model ").slice(1);

  modelDefinitions.forEach((modelDef, index) => {
    const lines = modelDef.split("\n").map((line) => line.trim());
    const modelName = lines[0].split(" ")[0];
    const fields: Field[] = [];
    let tableName: string | undefined;
    const uniqueConstraints: string[][] = [];
    console.log("lines[0] is ", lines[0]);

    lines.slice(1).forEach((line) => {
      if (!line || line.startsWith("}")) return;

      // Handle model-level attributes
      if (line.startsWith("@@")) {
        const mapMatch = line.match(/@@map\(name:\s*"([^"]+)"\)/);
        if (mapMatch) {
          tableName = mapMatch[1];
          return;
        }

        const uniqueMatch = line.match(/@@unique\(\[(.*)\]\)/);
        if (uniqueMatch) {
          const fields = uniqueMatch[1].split(",").map((f) => f.trim());
          uniqueConstraints.push(fields);
        }
        return;
      }

      // Skip lines that don't start with a valid field name
      if (!/^[a-zA-Z_][a-zA-Z0-9_]*\s/.test(line)) return;

      // Parse relation fields
      if (line.includes("@relation")) {
        const parts = line.trim().split(/\s+/);
        const fieldName = parts[0];
        const fieldType = parts[1];

        const relationMatch = line.match(
          /relation\(fields:\s*\[(.*?)\],\s*references:\s*\[(.*?)\](.*?)\)/
        );

        if (relationMatch) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const [_, relationFields, referencedFields, rest] = relationMatch;
          const onDeleteMatch = rest.match(/onDelete:\s*(.*?)\)/);
          const onDelete = onDeleteMatch ? onDeleteMatch[1] : undefined;

          // Add the relation field
          fields.push({
            name: fieldName,
            type: fieldType.replace("?", ""),
            isRequired: !line.includes("?"),
            isList: false,
            isRelation: true,
            referencedModel: fieldType,
            referencedField: referencedFields,
            onDelete: onDelete,
            attributes: parseAttributes(line),
            displayOrder: fields.length,
            isUnique: line.includes("@unique"),
            isPrimaryKey: line.includes("@id"),
            isForeignKey: false,
          });

          const existingForeignKeyField = fields.find(
            (f) => f.name === relationFields
          );
          if (existingForeignKeyField) {
            existingForeignKeyField.isForeignKey = true;
            existingForeignKeyField.referencedModel = fieldType;
            existingForeignKeyField.referencedField = referencedFields;
          } else {
            fields.push({
              name: relationFields,
              type: "String",
              isRequired: true,
              isList: false,
              isRelation: false,
              isForeignKey: true,
              referencedModel: fieldType,
              referencedField: referencedFields,
              displayOrder: fields.length,
              isUnique: line.includes("@unique"),
              isPrimaryKey: false,
            });
          }
        }
      }
      // Parse array relations (one-to-many)
      else if (line.includes("[]")) {
        const parts = line.trim().split(/\s+/);
        const fieldName = parts[0];
        const fieldType = parts[1].replace("[]", "");

        fields.push({
          name: fieldName,
          type: fieldType,
          isRequired: true,
          isList: true,
          isRelation: true,
          referencedModel: fieldType,
          attributes: parseAttributes(line),
          displayOrder: fields.length,
          isUnique: line.includes("@unique"),
          isPrimaryKey: false,
          isForeignKey: false,
        });
      }
      // Parse regular fields
      else {
        const parts = line.trim().split(/\s+/);
        if (parts.length >= 2) {
          const fieldName = parts[0];
          const fieldType = parts[1];
          const existingField = fields.find((f) => f.name === fieldName);
          if (!existingField) {
            fields.push({
              name: fieldName,
              type: fieldType,
              isRequired: !line.includes("?"),
              isList: false,
              isRelation: false,
              attributes: parseAttributes(line),
              displayOrder: fields.length,
              isUnique: line.includes("@unique"),
              isPrimaryKey: line.includes("@id"),
              isForeignKey: false,
            });
          }
        }
      }
    });

    models.push({
      name: modelName,
      position: {
        x: index * 200,
        y: 0,
      },
      fields,
      tableName,
      uniqueConstraints:
        uniqueConstraints.length > 0 ? uniqueConstraints : undefined,
    });
  });

  // Process relationships between models
  linkRelationships(models);

  return models;
};

function linkRelationships(models: Model[]): void {
  models.forEach((model) => {
    model.fields.forEach((field) => {
      if (field.isRelation && field.isList) {
        console.log("START:field --linkRelationship is ", field);
        const referencedModel = models.find(
          (m) => m.name === field.referencedModel
        );

        if (referencedModel) {
          const foreignKey = referencedModel.fields.find(
            (f) => f.isForeignKey && f.referencedModel === model.name
          );
          if (foreignKey) {
            field.referencedField = foreignKey.name;
          }
        }
        console.log("END:field --linkRelationship is ", field);
      }
    });
  });
}

function parseAttributes(line: string): string[] | undefined {
  const attributes = line.match(/@[^@\s]+/g);
  return attributes ? attributes : undefined;
}

export async function parseSchemaAction(schema: string): Promise<{
  models: Model[];
  error?: string;
}> {
  try {
    const models = parseSchema(schema);
    return { models };
  } catch (error) {
    console.error("Error parsing schema:", error);
    return {
      models: [],
      error: "Failed to parse schema. Please check the format and try again.",
    };
  }
}
