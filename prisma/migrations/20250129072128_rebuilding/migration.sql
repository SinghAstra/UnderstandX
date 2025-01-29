/*
  Warnings:

  - You are about to drop the `Repository` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RepositoryChunk` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Repository" DROP CONSTRAINT "Repository_userId_fkey";

-- DropForeignKey
ALTER TABLE "RepositoryChunk" DROP CONSTRAINT "RepositoryChunk_repositoryId_fkey";

-- DropTable
DROP TABLE "Repository";

-- DropTable
DROP TABLE "RepositoryChunk";

-- DropEnum
DROP TYPE "RepositoryStatus";
