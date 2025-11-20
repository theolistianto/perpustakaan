// lib/db.ts
import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient();

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
