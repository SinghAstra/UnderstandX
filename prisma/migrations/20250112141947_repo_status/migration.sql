-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "RepositoryStatus" ADD VALUE 'FETCHING_GITHUB_REPO_FILES';
ALTER TYPE "RepositoryStatus" ADD VALUE 'CHUNKING_FILES';
ALTER TYPE "RepositoryStatus" ADD VALUE 'EMBEDDING_CHUNKS';
ALTER TYPE "RepositoryStatus" ADD VALUE 'FAILED';
ALTER TYPE "RepositoryStatus" ADD VALUE 'CANCELED';

-- DropForeignKey
ALTER TABLE "Repository" DROP CONSTRAINT "Repository_userId_fkey";

-- AddForeignKey
ALTER TABLE "Repository" ADD CONSTRAINT "Repository_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
