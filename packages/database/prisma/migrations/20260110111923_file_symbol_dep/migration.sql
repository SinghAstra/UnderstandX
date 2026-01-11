/*
  Warnings:

  - You are about to drop the column `analysis` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `shortSummary` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `File` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "File" DROP COLUMN "analysis",
DROP COLUMN "shortSummary",
DROP COLUMN "updatedAt";

-- CreateTable
CREATE TABLE "Symbol" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "fileId" TEXT NOT NULL,

    CONSTRAINT "Symbol_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dependency" (
    "id" TEXT NOT NULL,
    "fileId" TEXT NOT NULL,
    "importPath" TEXT NOT NULL,
    "sourceValue" TEXT NOT NULL,
    "resolvedFileId" TEXT,

    CONSTRAINT "Dependency_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Symbol" ADD CONSTRAINT "Symbol_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dependency" ADD CONSTRAINT "Dependency_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE CASCADE ON UPDATE CASCADE;
