-- CreateTable
CREATE TABLE "ConnectionCollectionWord" (
    "id" SERIAL NOT NULL,
    "collectionId" INTEGER NOT NULL,
    "wordId" INTEGER NOT NULL,

    CONSTRAINT "ConnectionCollectionWord_pkey" PRIMARY KEY ("id")
);
