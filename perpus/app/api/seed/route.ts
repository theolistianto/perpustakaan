import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    // Create categories
    await prisma.category.createMany({
      data: [
        { name: "Teknologi" },
        { name: "Fiksi" },
        { name: "Non-Fiksi" },
        { name: "Sejarah" },
        { name: "Pendidikan" },
      ],
    });

    // Create shelves
    await prisma.shelf.createMany({
      data: [
        { name: "Rak A" },
        { name: "Rak B" },
        { name: "Rak C" },
        { name: "Rak D" },
      ],
    });

    // Create sample books
    await prisma.book.createMany({
      data: [
        {
          title: "Belajar Next.js",
          author: "John Doe",
          categoryId: 1,
          shelfId: 1,
          stock: 5,
          totalStock: 5,
          image: null,
        },
        {
          title: "Dunia Fantasi",
          author: "Jane Smith",
          categoryId: 2,
          shelfId: 2,
          stock: 3,
          totalStock: 3,
          image: null,
        },
      ],
    });

    const categoryCount = await prisma.category.count();
    const shelfCount = await prisma.shelf.count();
    const bookCount = await prisma.book.count();

    return NextResponse.json({
      message: "Database seeded successfully",
      stats: {
        categories: categoryCount,
        shelves: shelfCount,
        books: bookCount,
      },
    });
  } catch (error: any) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { message: error.message || "Seeding failed" },
      { status: 400 }
    );
  }
}
