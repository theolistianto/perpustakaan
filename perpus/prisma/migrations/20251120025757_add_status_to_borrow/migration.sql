-- AlterTable
ALTER TABLE "Borrow" ADD COLUMN     "fine" INTEGER,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'pending';
