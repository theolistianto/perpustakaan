import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { borrowingId } = await req.json();

    const borrow = await prisma.borrow.findUnique({
      where: { id: borrowingId },
    });

    if (!borrow) {
      return NextResponse.json(
        { error: "Borrowing not found" },
        { status: 404 }
      );
    }

    if (borrow.returnDate) {
      return NextResponse.json(
        { error: "Buku sudah dikembalikan" },
        { status: 400 }
      );
    }

    // Hitung denda (Rp1000/hari keterlambatan)
    const today = new Date();
    const dueDate = borrow.returnDate ?? borrow.borrowDate; // jika returnDate null
    const daysLate = Math.max(
      0,
      Math.floor(
        (today.getTime() - borrow.borrowDate.getTime()) / (1000 * 60 * 60 * 24)
      )
    );
    const fine = daysLate > 0 ? daysLate * 1000 : 0;

    // Update borrow (set returnDate dan denda)
    await prisma.borrow.update({
      where: { id: borrowingId },
      data: { returnDate: today },
    });

    // Update stock buku (kembalikan 1)
    await prisma.book.update({
      where: { id: borrow.bookId },
      data: { stock: { increment: 1 } },
    });

    return NextResponse.json({ message: "Buku berhasil dikembalikan", fine });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Gagal mengembalikan buku" },
      { status: 500 }
    );
  }
}
