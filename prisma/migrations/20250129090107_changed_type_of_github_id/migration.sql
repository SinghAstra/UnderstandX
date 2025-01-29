/*
  Warnings:

  - Added the required column `avatarUrl` to the `Repository` table without a default value. This is not possible if the table is not empty.
  - Added the required column `githubId` to the `Repository` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Repository" ADD COLUMN     "avatarUrl" TEXT NOT NULL,
ADD COLUMN     "githubId" INTEGER NOT NULL;
