-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "isScored" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "status" SET DEFAULT 'pending';
