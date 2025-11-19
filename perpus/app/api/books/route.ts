import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  console.log("API /api/books called"); // Log untuk debug
  try {
    const books = await prisma.book.findMany({
      include: { category: true, shelf: true },
    });
    console.log("Books fetched:", books.length);
    return NextResponse.json(books);
  } catch (error) {
    console.error("Error fetching books:", error);
    return NextResponse.json(
      { error: "Failed to fetch books" },
      { status: 500 }
    );
  }
}
