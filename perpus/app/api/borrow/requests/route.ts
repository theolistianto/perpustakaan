import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const requests = await prisma.borrow.findMany({
      where: { status: "pending" },
      include: {
        user: {
          select: { id: true, name: true },
        },
        book: {
          include: {
            category: true,
            shelf: true,
          },
        },
      },
      orderBy: { borrowDate: "desc" },
    });

    return NextResponse.json(requests);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Gagal mengambil request" },
      { status: 500 }
    );
  }
}
