/*
  Warnings:

  - A unique constraint covering the columns `[word,translation]` on the table `Word` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Word_word_translation_key" ON "Word"("word", "translation");
