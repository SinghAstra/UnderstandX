/*
  Warnings:

  - The `status` column on the `Repository` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "RepositoryStatus" AS ENUM ('PENDING', 'PROCESSING', 'SUCCESS', 'FAILED', 'CANCELLED');

-- AlterTable
ALTER TABLE "Repository" DROP COLUMN "status",
ADD COLUMN     "status" "RepositoryStatus" NOT NULL DEFAULT 'PENDING';

-- DropEnum
DROP TYPE "ProcessingStatus";
