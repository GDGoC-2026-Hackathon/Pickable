-- CreateEnum
CREATE TYPE "BrandingCardStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- CreateTable
CREATE TABLE "BrandingCard" (
    "id" TEXT NOT NULL,
    "corporationId" TEXT NOT NULL,
    "catchphrase" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "backgroundStyle" TEXT NOT NULL DEFAULT 'navy',
    "backgroundUrl" TEXT,
    "thumbnailUrl" TEXT,
    "thumbnailSource" TEXT NOT NULL DEFAULT 'file',
    "status" "BrandingCardStatus" NOT NULL DEFAULT 'DRAFT',
    "prompt" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BrandingCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BrandingKeyword" (
    "id" TEXT NOT NULL,
    "brandingCardId" TEXT NOT NULL,
    "keyword" TEXT NOT NULL,

    CONSTRAINT "BrandingKeyword_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BrandingCard_corporationId_key" ON "BrandingCard"("corporationId");

-- AddForeignKey
ALTER TABLE "BrandingCard" ADD CONSTRAINT "BrandingCard_corporationId_fkey" FOREIGN KEY ("corporationId") REFERENCES "Corporation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BrandingKeyword" ADD CONSTRAINT "BrandingKeyword_brandingCardId_fkey" FOREIGN KEY ("brandingCardId") REFERENCES "BrandingCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;
