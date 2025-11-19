import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET semua buku
export async function GET() {
  const books = await prisma.book.findMany({
    include: { category: true, shelf: true },
  });
  return NextResponse.json(books);
}

// POST tambah buku baru
export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.title || !body.author || !body.categoryId || !body.shelfId) {
      return NextResponse.json(
        { error: "title, author, categoryId, shelfId wajib diisi" },
        { status: 400 }
      );
    }

    const book = await prisma.book.create({
      data: {
        title: body.title,
        author: body.author,
        categoryId: body.categoryId,
        shelfId: body.shelfId,
      },
    });

    return NextResponse.json(book);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
