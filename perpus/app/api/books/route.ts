import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const books = await prisma.book.findMany({
    include: { category: true, shelf: true },
  });
  return NextResponse.json(books);
}

export async function POST(req: NextRequest) {
  try {
    const { title, author, categoryId, shelfId, stock, image } = await req.json();

    const book = await prisma.book.create({
      data: {
        title,
        author,
        categoryId,
        shelfId,
        stock: stock || 0,
        totalStock: stock || 0,
        image: image || null,
      },
      include: { category: true, shelf: true },
    });

    return NextResponse.json(book, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to create book" },
      { status: 400 }
    );
  }
}
