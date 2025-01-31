/*
  Warnings:

  - You are about to drop the column `summary` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `summary` on the `Repository` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "FeatureCategory" AS ENUM ('AUTHENTICATION', 'DATABASE', 'UI_COMPONENTS', 'STATE_MANAGEMENT', 'API_INTEGRATION', 'TESTING', 'DEVOPS', 'SECURITY', 'PERFORMANCE', 'DOCUMENTATION', 'OTHER');

-- AlterTable
ALTER TABLE "File" DROP COLUMN "summary",
ADD COLUMN     "longSummary" TEXT,
ADD COLUMN     "shortSummary" TEXT;

-- AlterTable
ALTER TABLE "Repository" DROP COLUMN "summary",
ADD COLUMN     "longSummary" TEXT,
ADD COLUMN     "shortSummary" TEXT;

-- CreateTable
CREATE TABLE "Feature" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "FeatureCategory" NOT NULL,
    "repositoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Feature_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Feature_category_idx" ON "Feature"("category");

-- AddForeignKey
ALTER TABLE "Feature" ADD CONSTRAINT "Feature_repositoryId_fkey" FOREIGN KEY ("repositoryId") REFERENCES "Repository"("id") ON DELETE CASCADE ON UPDATE CASCADE;
