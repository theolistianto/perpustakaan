import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const month = searchParams.get("month");
    const year = searchParams.get("year");

    const where: any = {};

    // Filter bulan & tahun
    if (month && year) {
      where.borrowDate = {
        gte: new Date(`${year}-${month}-01`),
        lt: new Date(
          `${year}-${String(Number(month) + 1).padStart(2, "0")}-01`
        ),
      };
    }

    const borrowings = await prisma.borrow.findMany({
      where,
      include: {
        user: {
          select: { id: true, name: true },
        },
        book: {
          select: {
            id: true,
            title: true,
            category: { select: { name: true } },
            shelf: { select: { name: true } },
          },
        },
      },
      orderBy: {
        borrowDate: "desc",
      },
    });

    return NextResponse.json(borrowings);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Gagal mengambil data peminjaman" },
      { status: 500 }
    );
  }
}
