/*
  Warnings:

  - You are about to drop the column `jobRole` on the `JobPosting` table. All the data in the column will be lost.
  - You are about to drop the column `militaryRequired` on the `JobPosting` table. All the data in the column will be lost.
  - Added the required column `jobTrack` to the `JobPosting` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `JobPosting` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `JobPosting` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PostingStatus" AS ENUM ('OPEN', 'CLOSED');

-- CreateEnum
CREATE TYPE "FilterPolicy" AS ENUM ('NOT_RELEVANT', 'REQUIRED', 'BONUS', 'NOT_REFLECTED');

-- AlterTable
ALTER TABLE "JobPosting" DROP COLUMN "jobRole",
DROP COLUMN "militaryRequired",
ADD COLUMN     "aiEvalAward" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "aiEvalCredential" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "aiEvalExperience" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "applicationUrl" TEXT,
ADD COLUMN     "careerPolicy" "FilterPolicy" NOT NULL DEFAULT 'NOT_RELEVANT',
ADD COLUMN     "deadline" TIMESTAMP(3),
ADD COLUMN     "jobTrack" TEXT NOT NULL,
ADD COLUMN     "militaryPolicy" "FilterPolicy" NOT NULL DEFAULT 'NOT_RELEVANT',
ADD COLUMN     "preferredCondition" TEXT,
ADD COLUMN     "status" "PostingStatus" NOT NULL DEFAULT 'OPEN',
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "CompanyTag" (
    "id" TEXT NOT NULL,
    "corporationId" TEXT NOT NULL,
    "tagName" TEXT NOT NULL,

    CONSTRAINT "CompanyTag_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CompanyTag" ADD CONSTRAINT "CompanyTag_corporationId_fkey" FOREIGN KEY ("corporationId") REFERENCES "Corporation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
