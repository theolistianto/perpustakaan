import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json();

    const borrow = await prisma.borrow.findUnique({ where: { id } });
    if (!borrow) {
      return NextResponse.json({ error: "Data peminjaman tidak ditemukan" }, { status: 404 });
    }

    // Hitung denda
    const today = new Date();
    let fine = 0;

    if (borrow.returnDate === null && today > borrow.dueDate) {
      const daysLate = Math.floor(
        (today.getTime() - borrow.dueDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      fine = daysLate * 1000;
    }

    // Update peminjaman
    await prisma.borrow.update({
      where: { id },
      data: { status: "returned", returnDate: today, fine },
    });

    // Kembalikan stok buku
    await prisma.book.update({
      where: { id: borrow.bookId },
      data: { stock: { increment: 1 } },
    });

    return NextResponse.json({ message: "Buku dikembalikan", fine });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Gagal mengembalikan buku" }, { status: 500 });
  }
}
