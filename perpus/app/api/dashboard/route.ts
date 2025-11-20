import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    // Total buku
    const totalBooks = await prisma.book.count();

    // Total anggota / user
    const totalMembers = await prisma.user.count();

    // Buku yang sedang dipinjam (returnDate null)
    const borrowedBooks = await prisma.borrow.count({
      where: { returnDate: null },
    });

    // Total stock buku tersedia
    const availableBooksData = await prisma.book.aggregate({
      _sum: { stock: true },
    });
    const availableBooks = availableBooksData._sum.stock ?? 0;

    // Grafik peminjaman per bulan (contoh sederhana)
    const borrowings = await prisma.borrow.findMany({
      select: { borrowDate: true },
    });

    const monthlyData = borrowings.reduce((acc, b) => {
      const month = b.borrowDate.toISOString().slice(0, 7); // format YYYY-MM
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json({
      stats: {
        totalBooks,
        totalMembers,
        borrowedBooks,
        availableBooks,
      },
      chart: Object.entries(monthlyData).map(([month, count]) => ({
        month,
        count,
      })),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Gagal mengambil statistik" },
      { status: 500 }
    );
  }
}
