// app/api/dashboard/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const todayStart = new Date();
    todayStart.setHours(0,0,0,0);

    // stats
    const totalBorrows = await prisma.borrow.count(); // total peminjaman
    const totalMembers = await prisma.user.count({ where: { role: "member" } });
    const borrowsToday = await prisma.borrow.count({ where: { borrowDate: { gte: todayStart } } });

    // chart: monthly borrow counts (last 12 months)
    const borrowings = await prisma.borrow.findMany({ select: { borrowDate: true } });
    const monthlyMap = borrowings.reduce((acc: Record<string, number>, b) => {
      const month = b.borrowDate.toISOString().slice(0,7);
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});
    const chart = Object.entries(monthlyMap).map(([month, count]) => ({ month, count }));

    // table: active borrows (accepted and not returned)
    const activeBorrows = await prisma.borrow.findMany({
      where: { status: "accepted", returnDate: null },
      include: {
        user: { select: { id: true, name: true } },
        book: { include: { category: true, shelf: true } },
      },
      orderBy: { borrowDate: "desc" },
    });

    const table = activeBorrows.map(b => ({
      id: b.id,
      user: b.user.name,
      jenisBuku: b.book.category?.name ?? "-",
      temaBuku: b.book.title,
      rak: b.book.shelf?.name ?? "-",
      jumlah: 1, // karena model menyimpan satu record per buku. Jika memungkinkan multiple quantity, perlu field qty
      borrowDate: b.borrowDate,
      dueDate: b.dueDate
    }));

    return NextResponse.json({
      stats: { totalBorrows, totalMembers, borrowsToday },
      chart,
      table
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Gagal mengambil data dashboard" }, { status: 500 });
  }
}
