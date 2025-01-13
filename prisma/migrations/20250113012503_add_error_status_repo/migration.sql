/*
  Warnings:

  - The values [FAILED] on the enum `RepositoryStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "RepositoryStatus_new" AS ENUM ('PENDING', 'FETCHING_GITHUB_REPO_FILES', 'FETCHING_GITHUB_REPO_FILES_FAILED', 'CHUNKING_FILES', 'CHUNKING_FILES_FAILED', 'EMBEDDING_CHUNKS', 'EMBEDDING_CHUNKS_FAILED', 'SUCCESS', 'CANCELED');
ALTER TABLE "Repository" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Repository" ALTER COLUMN "status" TYPE "RepositoryStatus_new" USING ("status"::text::"RepositoryStatus_new");
ALTER TYPE "RepositoryStatus" RENAME TO "RepositoryStatus_old";
ALTER TYPE "RepositoryStatus_new" RENAME TO "RepositoryStatus";
DROP TYPE "RepositoryStatus_old";
ALTER TABLE "Repository" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;
