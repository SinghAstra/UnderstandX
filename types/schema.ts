// Interfaces for the parsed schema structure
export interface Field {
  name: string;
  type: string;
  isRequired: boolean;
  isList: boolean;
  isRelation: boolean;
  relationTo?: string;
  isForeignKey?: boolean;
  referencedModel?: string;
  referencedField?: string;
  onDelete?: string;
  attributes?: string[];
  displayOrder: number; // Order in which fields should be displayed
  isUnique: boolean; // Field has @unique attribute
  isPrimaryKey: boolean; // Field is a primary key (@id)
}

export interface Model {
  name: string;
  fields: Field[];
  position: {
    x: number;
    y: number;
  };
  dimensions: {
    width: number;
    height: number;
  };
  tableName?: string;
  uniqueConstraints?: string[][];
}

const defaultSchemaString = `
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url               = env("DATABASE_URL")
  directUrl         = env("DIRECT_URL")
}

model Account {
  id                String   @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?  @db.Text
  access_token      String?  @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?  @db.Text
  session_state     String?
  createdAt         DateTime @default(now()) @map(name: "created_at")
  updatedAt         DateTime @default(now()) @map(name: "updated_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@map(name: "accounts")
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map(name: "sessions")
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  createdAt     DateTime  @default(now()) @map(name: "created_at")
  updatedAt     DateTime  @default(now()) @map(name: "updated_at")

  accounts Account[]
  sessions Session[]
  webhooks Webhook[]

  @@map(name: "users")
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
  @@map(name: "verification_tokens")
}

model Webhook {
  id            String    @id @default(cuid())
  userId        String
  repoFullName  String
  lastTriggered DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map(name: "webhooks")
}
`;

export const parseSchema = (
  schemaString: string = defaultSchemaString
): Model[] => {
  const models: Model[] = [];
  const VERTICAL_SPACING = 250; // Space between rows
  const HORIZONTAL_SPACING = 400; // Space between columns
  const MAX_MODELS_PER_ROW = 3; // Number of models per row for grid layout

  // Split the schema into model definitions, skipping the first element (empty or config)
  const modelDefinitions = schemaString.split("model ").slice(1);

  modelDefinitions.forEach((modelDef, index) => {
    // Calculate grid-based position
    const row = Math.floor(index / MAX_MODELS_PER_ROW);
    const col = index % MAX_MODELS_PER_ROW;

    // Split model definition into lines and clean them
    const lines = modelDef.split("\n").map((line) => line.trim());
    const modelName = lines[0].split(" ")[0];
    const fields: Field[] = [];
    const position = {
      x: col * HORIZONTAL_SPACING + 50, // Add 50px padding
      y: row * VERTICAL_SPACING + 50, // Add 50px padding
    };
    let tableName: string | undefined;
    const uniqueConstraints: string[][] = [];

    // Process each line in the model definition
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

          fields.push({
            name: fieldName,
            type: fieldType,
            isRequired: !line.includes("?"),
            isList: false,
            isRelation: false,
            attributes: parseAttributes(line),
            displayOrder: fields.length, // Add display order for visualization
            isUnique: line.includes("@unique"),
            isPrimaryKey: line.includes("@id"),
            isForeignKey: false,
          });
        }
      }
    });

    // Calculate model dimensions based on number of fields
    const modelHeight = fields.length * 30 + 60; // 30px per field + padding
    const modelWidth = 250; // Fixed width for now

    // Create the model with dimensions
    models.push({
      name: modelName,
      position,
      dimensions: {
        width: modelWidth,
        height: modelHeight,
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

// Helper function to parse field attributes
function parseAttributes(line: string): string[] | undefined {
  const attributes = line.match(/@[^@\s]+/g);
  return attributes ? attributes : undefined;
}

// Helper function to link relationships between models
function linkRelationships(models: Model[]): void {
  models.forEach((model) => {
    model.fields.forEach((field) => {
      if (field.isRelation || field.isForeignKey) {
        if (model.tableName === "accounts") {
          console.log("Start: field is ", field);
        }
        const referencedModel = models.find(
          (m) => m.name === field.referencedModel
        );
        if (model.tableName === "accounts") {
          console.log("referencedModel is ", referencedModel);
        }

        if (referencedModel) {
          // Handle one-to-many relationships
          if (field.isList) {
            if (model.tableName === "accounts") {
              console.log("In field.isList ");
            }
            const foreignKey = referencedModel.fields.find(
              (f) => f.isForeignKey && f.referencedModel === model.name
            );
            if (model.tableName === "accounts") {
              console.log("foreignKey is ", foreignKey);
            }
            if (foreignKey) {
              field.relationTo = foreignKey.name;
            }
          }
          // Handle many-to-one relationships
          else if (field.isForeignKey) {
            if (model.tableName === "accounts") {
              console.log("In field.isForeignKey");
            }
            const relationField = model.fields.find(
              (f) => f.isRelation && f.referencedModel === field.referencedModel
            );
            if (model.tableName === "accounts") {
              console.log("relationField is ", relationField);
            }
            if (relationField) {
              field.relationTo = relationField.referencedField;
            }
          }
        }
        if (model.tableName === "accounts") {
          console.log("End: field is ", field);
        }
      }
    });
  });
}
