-- CreateTable
CREATE TABLE "FineSettings" (
    "id" SERIAL NOT NULL,
    "finePerSevenDays" INTEGER NOT NULL DEFAULT 1000,
    "maxFine" INTEGER NOT NULL DEFAULT 50000,

    CONSTRAINT "FineSettings_pkey" PRIMARY KEY ("id")
);
