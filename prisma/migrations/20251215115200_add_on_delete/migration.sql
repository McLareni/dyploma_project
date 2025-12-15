-- DropForeignKey
ALTER TABLE "ConnectionCollectionWord" DROP CONSTRAINT "ConnectionCollectionWord_collectionId_fkey";

-- DropForeignKey
ALTER TABLE "ConnectionCollectionWord" DROP CONSTRAINT "ConnectionCollectionWord_wordId_fkey";

-- DropForeignKey
ALTER TABLE "ConnectionWordUser" DROP CONSTRAINT "ConnectionWordUser_wordId_fkey";

-- AddForeignKey
ALTER TABLE "ConnectionWordUser" ADD CONSTRAINT "ConnectionWordUser_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "Word"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConnectionCollectionWord" ADD CONSTRAINT "ConnectionCollectionWord_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConnectionCollectionWord" ADD CONSTRAINT "ConnectionCollectionWord_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "Word"("id") ON DELETE CASCADE ON UPDATE CASCADE;
