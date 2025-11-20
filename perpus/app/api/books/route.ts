import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const books = await prisma.book.findMany();
  return NextResponse.json(books);
}

export async function POST(req: NextRequest) {
  const { title, author } = await req.json();
  const book = await prisma.book.create({ data: { title, author } });
  return NextResponse.json(book, { status: 201 });
}
