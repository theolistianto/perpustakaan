import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const { userId, bookId, dueDate } = await req.json();

  // Buat record borrow
  const borrow = await prisma.borrow.create({
    data: {
      userId, // ganti memberId → userId
      bookId,
      borrowDate: new Date(),
      returnDate: new Date(dueDate),
    },
  });

  // Kurangi stock buku
  await prisma.book.update({
    where: { id: bookId },
    data: { stock: { decrement: 1 } }, // pastikan field stock ada di schema
  });

  return NextResponse.json(borrow);
}
