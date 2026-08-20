/*
  Warnings:

  - You are about to drop the column `isScored` on the `Match` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Match" DROP COLUMN "isScored",
ALTER COLUMN "status" SET DEFAULT 'upcoming';
