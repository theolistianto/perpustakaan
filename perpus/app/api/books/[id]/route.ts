import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Update buku
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bookId = parseInt(params.id);
    if (isNaN(bookId)) {
      return NextResponse.json({ error: "ID buku tidak valid" }, { status: 400 });
    }

    const { title, author, categoryId, shelfId, stock, totalStock } = await req.json();

    const updatedBook = await prisma.book.update({
      where: { id: bookId },
      data: {
        ...(title && { title }),
        ...(author && { author }),
        ...(categoryId && { categoryId }),
        ...(shelfId && { shelfId }),
        ...(stock !== undefined && { stock }),
        ...(totalStock !== undefined && { totalStock }),
      },
    });

    return NextResponse.json(updatedBook);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal memperbarui buku" }, { status: 500 });
  }
}

// Hapus buku
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bookId = parseInt(params.id);
    if (isNaN(bookId)) {
      return NextResponse.json({ error: "ID buku tidak valid" }, { status: 400 });
    }

    await prisma.book.delete({ where: { id: bookId } });

    return NextResponse.json({ message: "Buku berhasil dihapus" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal menghapus buku" }, { status: 500 });
  }
}
