// app/api/dashboard/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Total peminjam dan peminjaman hari ini
    const totalBorrows = await prisma.borrow.count();
    const totalUsers = await prisma.user.count({ where: { role: "member" } });
    const borrowsToday = await prisma.borrow.count({
      where: { borrowDate: { gte: today } },
    });

    // Ambil semua peminjaman untuk chart
    const borrowings = await prisma.borrow.findMany({
      select: { borrowDate: true },
    });

    const monthlyData = borrowings.reduce((acc, b) => {
      const month = b.borrowDate.toISOString().slice(0, 7);
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Ambil daftar peminjaman aktif untuk tabel
    const activeBorrows = await prisma.borrow.findMany({
      where: { status: "accepted" },
      include: {
        user: { select: { id: true, name: true } },
        book: { include: { category: true, shelf: true } },
      },
      orderBy: { borrowDate: "desc" },
    });

    return NextResponse.json({
      stats: {
        totalBorrows,
        totalUsers,
        borrowsToday,
      },
      chart: Object.entries(monthlyData).map(([month, count]) => ({
        month,
        count,
      })),
      table: activeBorrows.map((b) => ({
        id: b.id,
        user: b.user.name,
        jenisBuku: b.book.category.name,
        temaBuku: b.book.title,
        rak: b.book.shelf.name,
        jumlah: b.book.stock, // atau totalStock tergantung kebutuhan
      })),
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Gagal mengambil data dashboard" },
      { status: 500 }
    );
  }
}
