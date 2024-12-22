-- DropForeignKey
ALTER TABLE "RepositoryChunk" DROP CONSTRAINT "RepositoryChunk_repositoryId_fkey";

-- AddForeignKey
ALTER TABLE "RepositoryChunk" ADD CONSTRAINT "RepositoryChunk_repositoryId_fkey" FOREIGN KEY ("repositoryId") REFERENCES "Repository"("id") ON DELETE CASCADE ON UPDATE CASCADE;
