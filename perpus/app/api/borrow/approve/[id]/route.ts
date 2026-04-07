import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const borrowId = Number(params.id);

    // ambil data borrow
    const borrow = await prisma.borrow.findUnique({
      where: { id: borrowId },
    });

    if (!borrow) {
      return NextResponse.json(
        { error: "Data peminjaman tidak ditemukan" },
        { status: 404 }
      );
    }

    // cek stok buku
    const book = await prisma.book.findUnique({
      where: { id: borrow.bookId },
    });

    if (!book || book.stock <= 0) {
      return NextResponse.json(
        { error: "Stok buku habis" },
        { status: 400 }
      );
    }

    // approve + kurangi stok
    await prisma.$transaction([
      prisma.borrow.update({
        where: { id: borrowId },
        data: {
          status: "approved",
        },
      }),

      prisma.book.update({
        where: { id: borrow.bookId },
        data: {
          stock: {
            decrement: 1,
          },
        },
      }),
    ]);

    return NextResponse.json({
      message: "Peminjaman disetujui",
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Terjadi kesalahan" },
      { status: 500 }
    );
  }
}