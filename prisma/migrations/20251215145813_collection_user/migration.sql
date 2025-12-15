-- AlterTable
ALTER TABLE "Collection" ADD COLUMN     "leghth" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "ConnectionUserCollection" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "collectionId" INTEGER NOT NULL,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "completed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ConnectionUserCollection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ConnectionUserCollection_userId_collectionId_key" ON "ConnectionUserCollection"("userId", "collectionId");

-- AddForeignKey
ALTER TABLE "ConnectionUserCollection" ADD CONSTRAINT "ConnectionUserCollection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConnectionUserCollection" ADD CONSTRAINT "ConnectionUserCollection_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;
