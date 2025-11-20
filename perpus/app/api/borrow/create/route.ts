import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { userId, bookId, borrowDate, dueDate } = await req.json();

    if (!userId || !bookId || !borrowDate || !dueDate) {
      return NextResponse.json(
        { error: "Semua field harus diisi" },
        { status: 400 }
      );
    }

    // VALIDASI USER
    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
    });

    if (!user) {
      return NextResponse.json(
        { error: `User dengan ID ${userId} tidak ditemukan` },
        { status: 400 }
      );
    }

    // VALIDASI BOOK
    const book = await prisma.book.findUnique({
      where: { id: Number(bookId) },
    });

    if (!book) {
      return NextResponse.json(
        { error: `Buku dengan ID ${bookId} tidak ditemukan` },
        { status: 400 }
      );
    }

    // BUAT PEMINJAMAN
    const newBorrow = await prisma.borrow.create({
      data: {
        userId: Number(userId),
        bookId: Number(bookId),
        borrowDate: new Date(borrowDate),
        dueDate: new Date(dueDate),
        status: "borrowed",
      },
      include: {
        user: true,
        book: true,
      },
    });

    // KURANGI STOK
    await prisma.book.update({
      where: { id: Number(bookId) },
      data: { stock: { decrement: 1 } },
    });

    return NextResponse.json(newBorrow);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Kesalahan server saat membuat peminjaman." },
      { status: 500 }
    );
  }
}
