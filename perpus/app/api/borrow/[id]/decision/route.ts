// app/api/borrow/[id]/decision/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const borrowId = parseInt(params.id);
    const { accept } = await req.json(); // { accept: boolean }

    const borrow = await prisma.borrow.findUnique({ where: { id: borrowId } });
    if (!borrow)
      return NextResponse.json(
        { error: "Request tidak ditemukan" },
        { status: 404 }
      );
    if (borrow.status !== "pending")
      return NextResponse.json(
        { error: "Request sudah diproses" },
        { status: 400 }
      );

    if (accept) {
      // cek stok
      const book = await prisma.book.findUnique({
        where: { id: borrow.bookId },
      });
      if (!book)
        return NextResponse.json(
          { error: "Buku tidak ditemukan" },
          { status: 404 }
        );
      if (book.stock <= 0)
        return NextResponse.json({ error: "Stok habis" }, { status: 400 });

      // kurangi stok & terima request
      await prisma.book.update({
        where: { id: book.id },
        data: { stock: { decrement: 1 } },
      });

      const updated = await prisma.borrow.update({
        where: { id: borrowId },
        data: { status: "accepted" },
      });

      return NextResponse.json(updated);
    } else {
      const updated = await prisma.borrow.update({
        where: { id: borrowId },
        data: { status: "rejected" },
      });
      return NextResponse.json(updated);
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Gagal memproses request" },
      { status: 500 }
    );
  }
}
