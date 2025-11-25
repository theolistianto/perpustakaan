import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const books = await prisma.book.findMany({
      include: {
        category: true,
        shelf: true,
      },
    });
    return NextResponse.json(books);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
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
        stock,
        totalStock: stock,
        image,
      },
      include: { category: true, shelf: true },
    });

    return NextResponse.json(book, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
