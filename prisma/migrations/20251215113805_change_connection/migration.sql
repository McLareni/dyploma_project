/*
  Warnings:

  - A unique constraint covering the columns `[collectionId,wordId]` on the table `ConnectionCollectionWord` will be added. If there are existing duplicate values, this will fail.
  - Made the column `nextReview` on table `ConnectionWordUser` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ConnectionWordUser" ALTER COLUMN "nextReview" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ConnectionCollectionWord_collectionId_wordId_key" ON "ConnectionCollectionWord"("collectionId", "wordId");

-- AddForeignKey
ALTER TABLE "ConnectionCollectionWord" ADD CONSTRAINT "ConnectionCollectionWord_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConnectionCollectionWord" ADD CONSTRAINT "ConnectionCollectionWord_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "Word"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
