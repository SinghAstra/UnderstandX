/*
  Warnings:

  - The values [CANCELLED] on the enum `RepositoryStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `longSummary` on the `Repository` table. All the data in the column will be lost.
  - You are about to drop the column `shortSummary` on the `Repository` table. All the data in the column will be lost.
  - You are about to drop the `Feature` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Search` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "DirectoryStatus" AS ENUM ('PENDING', 'PROCESSING', 'SUCCESS', 'FAILED');

-- AlterEnum
BEGIN;
CREATE TYPE "RepositoryStatus_new" AS ENUM ('PENDING', 'PROCESSING', 'SUCCESS', 'FAILED');
ALTER TABLE "Repository" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Repository" ALTER COLUMN "status" TYPE "RepositoryStatus_new" USING ("status"::text::"RepositoryStatus_new");
ALTER TYPE "RepositoryStatus" RENAME TO "RepositoryStatus_old";
ALTER TYPE "RepositoryStatus_new" RENAME TO "RepositoryStatus";
DROP TYPE "RepositoryStatus_old";
ALTER TABLE "Repository" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- DropForeignKey
ALTER TABLE "Feature" DROP CONSTRAINT "Feature_repositoryId_fkey";

-- DropForeignKey
ALTER TABLE "Search" DROP CONSTRAINT "Search_userId_fkey";

-- AlterTable
ALTER TABLE "Repository" DROP COLUMN "longSummary",
DROP COLUMN "shortSummary",
ADD COLUMN     "overview" TEXT;

-- DropTable
DROP TABLE "Feature";

-- DropTable
DROP TABLE "Search";

-- DropEnum
DROP TYPE "FeatureCategory";
