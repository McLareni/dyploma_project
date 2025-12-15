/*
  Warnings:

  - A unique constraint covering the columns `[wordId,userId]` on the table `ConnectionWordUser` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ConnectionWordUser_wordId_userId_key" ON "ConnectionWordUser"("wordId", "userId");

-- AddForeignKey
ALTER TABLE "ConnectionWordUser" ADD CONSTRAINT "ConnectionWordUser_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "Word"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
