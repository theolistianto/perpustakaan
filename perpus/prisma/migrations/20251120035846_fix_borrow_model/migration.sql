/*
  Warnings:

  - Made the column `fine` on table `Borrow` required. This step will fail if there are existing NULL values in that column.
  - Made the column `dueDate` on table `Borrow` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Borrow" ALTER COLUMN "fine" SET NOT NULL,
ALTER COLUMN "fine" SET DEFAULT 0,
ALTER COLUMN "status" SET DEFAULT 'borrowed',
ALTER COLUMN "dueDate" SET NOT NULL;
