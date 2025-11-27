import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Create test user if doesn't exist
    const user = await prisma.user.upsert({
      where: { email: "test@perpus.id" },
      update: {},
      create: {
        email: "test@perpus.id",
        password: "hashed_password",
        role: "member",
        name: "Test User",
        username: "testuser",
        displayUserId: "TEST0001",
      },
    });

    // Create test book if doesn't exist
    let category = await prisma.category.findFirst();
    if (!category) {
      category = await prisma.category.create({
        data: { name: "Teknologi" },
      });
    }

    let shelf = await prisma.shelf.findFirst();
    if (!shelf) {
      shelf = await prisma.shelf.create({
        data: { name: "Rak A" },
      });
    }

    const book = await prisma.book.upsert({
      where: { displayBookId: "BOOK0001" },
      update: {},
      create: {
        title: "Buku Test Denda",
        author: "Penulis Test",
        categoryId: category.id,
        shelfId: shelf.id,
        stock: 5,
        totalStock: 10,
        displayBookId: "BOOK0001",
      },
    });

    // Create borrow records with past due dates (for fine calculation)
    const today = new Date();

    // Borrow 1: 30 days late = 5 periods × Rp1000 = Rp5000 denda
    await prisma.borrow.create({
      data: {
        userId: user.id,
        bookId: book.id,
        borrowDate: new Date(today.getTime() - 37 * 24 * 60 * 60 * 1000), // 37 days ago
        dueDate: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000), // Due 30 days ago
        status: "borrowed",
      },
    });

    // Borrow 2: 14 days late = 2 periods × Rp1000 = Rp2000 denda
    await prisma.borrow.create({
      data: {
        userId: user.id,
        bookId: book.id,
        borrowDate: new Date(today.getTime() - 21 * 24 * 60 * 60 * 1000), // 21 days ago
        dueDate: new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000), // Due 14 days ago
        status: "borrowed",
      },
    });

    // Borrow 3: 7 days late = 1 period × Rp1000 = Rp1000 denda
    await prisma.borrow.create({
      data: {
        userId: user.id,
        bookId: book.id,
        borrowDate: new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
        dueDate: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000), // Due 7 days ago
        status: "borrowed",
      },
    });

    // Borrow 4: Returned (no fine)
    await prisma.borrow.create({
      data: {
        userId: user.id,
        bookId: book.id,
        borrowDate: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        dueDate: new Date(today.getTime() - 23 * 24 * 60 * 60 * 1000), // Due 23 days ago
        returnDate: new Date(today.getTime() - 20 * 24 * 60 * 60 * 1000), // Returned 20 days ago
        status: "returned",
      },
    });

    return NextResponse.json({
      message: "Test data seeded successfully",
      user: {
        email: user.email,
        name: user.name,
        username: user.username,
      },
      fineExamples: {
        "30 days late": "Rp 5.000",
        "14 days late": "Rp 2.000",
        "7 days late": "Rp 1.000",
        "returned": "Rp 0 (Tidak ada)",
      },
    });
  } catch (error) {
    console.error("Error seeding data:", error);
    return NextResponse.json(
      { error: "Failed to seed data", details: (error as Error).message },
      { status: 500 }
    );
  }
}
