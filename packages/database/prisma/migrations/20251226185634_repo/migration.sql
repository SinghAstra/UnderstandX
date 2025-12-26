-- CreateEnum
CREATE TYPE "RepositoryStatus" AS ENUM ('PENDING', 'PROCESSING', 'SUCCESS', 'FAILED');

-- CreateEnum
CREATE TYPE "DirectoryStatus" AS ENUM ('PENDING', 'PROCESSING', 'SUCCESS', 'FAILED');

-- CreateTable
CREATE TABLE "Repository" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "avatarUrl" TEXT NOT NULL,
    "githubId" INTEGER NOT NULL,
    "status" "RepositoryStatus" NOT NULL DEFAULT 'PENDING',
    "overview" TEXT,

    CONSTRAINT "Repository_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Directory" (
    "id" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "summary" TEXT,
    "repositoryId" TEXT NOT NULL,
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Directory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "File" (
    "id" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "content" TEXT,
    "directoryId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "repositoryId" TEXT NOT NULL,
    "analysis" TEXT,
    "shortSummary" TEXT,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Log" (
    "id" TEXT NOT NULL,
    "repositoryId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" "RepositoryStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Log_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Repository" ADD CONSTRAINT "Repository_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Directory" ADD CONSTRAINT "Directory_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Directory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Directory" ADD CONSTRAINT "Directory_repositoryId_fkey" FOREIGN KEY ("repositoryId") REFERENCES "Repository"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_directoryId_fkey" FOREIGN KEY ("directoryId") REFERENCES "Directory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_repositoryId_fkey" FOREIGN KEY ("repositoryId") REFERENCES "Repository"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_repositoryId_fkey" FOREIGN KEY ("repositoryId") REFERENCES "Repository"("id") ON DELETE CASCADE ON UPDATE CASCADE;
