export interface Field {
  name: string;
  type: string;
  isRequired: boolean;
  isList: boolean;
  isRelation: boolean;
  relationTo?: string;
}

export interface Model {
  name: string;
  fields: Field[];
  position: {
    x: number;
    y: number;
  };
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
  const modelDefinitions = schemaString.split("model ").slice(1);

  modelDefinitions.forEach((modelDef, index) => {
    const lines = modelDef.split("\n").map((line) => line.trim());
    const modelName = lines[0].split(" ")[0];
    const fields: Field[] = [];
    const position = { x: index * 300, y: 0 };

    lines.slice(1).forEach((line) => {
      if (line.includes("@relation")) {
        const fieldName = line.split(" ")[0];
        const fieldType = line.split(" ")[1];
        const relationTo = line.match(
          /relation\(.*references:\s*\[(.*)\].*\)/
        )![1];
        const isRequired = !line.includes("?");

        fields.push({
          name: fieldName,
          type: fieldType,
          isRequired,
          isList: false,
          isRelation: true,
          relationTo: relationTo,
        });
      } else if (line.includes("[]")) {
        const fieldName = line.split(" ")[0];
        const fieldType = line.split(" ")[1].replace("[]", "");
        const isRequired = !line.includes("?");

        fields.push({
          name: fieldName,
          type: fieldType,
          isRequired,
          isList: true,
          isRelation: false,
        });
      } else {
        const fieldName = line.split(" ")[0];
        const fieldType = line.split(" ")[1];
        const isRequired = !line.includes("?");

        fields.push({
          name: fieldName,
          type: fieldType,
          isRequired: isRequired,
          isList: false,
          isRelation: false,
        });
      }
    });

    models.push({
      name: modelName,
      position: position,
      fields: fields,
    });
  });

  models.forEach((model) => {
    model.fields.forEach((field) => {
      if (field.isRelation) {
        const relationField = model.fields.find(
          (f) => f.name === field.name + "Id"
        );
        if (relationField) {
          relationField.isRelation = true;
          relationField.relationTo = field.relationTo;
        }
      }
    });
  });

  return models;
};
