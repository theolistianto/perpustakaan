import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    // Seed Category
    await prisma.category.createMany({
      data: [{ name: "Fiksi" }, { name: "Non-Fiksi" }, { name: "Teknologi" }],
    });

    // Seed Shelf
    await prisma.shelf.createMany({
      data: [{ name: "Rak A" }, { name: "Rak B" }, { name: "Rak C" }],
    });

    // Ambil kategori & rak
    const cat1 = await prisma.category.findFirst();
    const shelf1 = await prisma.shelf.findFirst();

    // Seed Books
    if (cat1 && shelf1) {
      await prisma.book.createMany({
        data: [
          {
            title: "Atomic Habits",
            author: "James Clear",
            categoryId: cat1.id,
            shelfId: shelf1.id,
          },
          {
            title: "Clean Code",
            author: "Robert C. Martin",
            categoryId: cat1.id,
            shelfId: shelf1.id,
          },
          {
            title: "Madilog",
            author: "James Clear",
            categoryId: cat1.id,
            shelfId: shelf1.id,
          },
          {
            title: "bottle",
            author: "Robert C. Martin",
            categoryId: cat1.id,
            shelfId: shelf1.id,
          },
        ],
      });
    }

    return NextResponse.json({ message: "Seed sukses!" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
