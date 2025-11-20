import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET: ambil daftar buku dengan filter search dan category
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const categoryId = searchParams.get("categoryId");

    const books = await prisma.book.findMany({
      where: {
        AND: [
          { title: { contains: search, mode: "insensitive" } },
          categoryId ? { categoryId: parseInt(categoryId) } : {},
        ],
      },
      include: { category: true, shelf: true },
    });

    return NextResponse.json(books);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Gagal mengambil buku" },
      { status: 500 }
    );
  }
}

// POST: buat buku baru
export async function POST(req: NextRequest) {
  try {
    const { title, author, categoryId, shelfId, stock, totalStock } =
      await req.json();

    // Validasi minimal
    if (!title || !author || !categoryId || !shelfId || stock === undefined) {
      return NextResponse.json(
        { error: "Data tidak lengkap" },
        { status: 400 }
      );
    }

    const book = await prisma.book.create({
      data: {
        title,
        author,
        categoryId,
        shelfId,
        stock,
        totalStock: totalStock ?? stock, // default totalStock sama dengan stock
      },
    });

    return NextResponse.json(book);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal membuat buku" }, { status: 500 });
  }
}
