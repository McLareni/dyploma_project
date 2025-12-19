/*
  Warnings:

  - You are about to drop the column `leghth` on the `Collection` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Collection" DROP COLUMN "leghth",
ADD COLUMN     "length" INTEGER NOT NULL DEFAULT 0;
