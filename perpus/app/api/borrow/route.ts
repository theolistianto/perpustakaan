// app/api/borrow/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { userId, bookId, dueDate } = await req.json();

    // basic validation
    if (!userId || !bookId)
      return NextResponse.json(
        { error: "Data tidak lengkap" },
        { status: 400 }
      );

    // create pending borrow request (admin will accept/reject)
    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);

    const borrow = await prisma.borrow.create({
      data: {
        userId,
        bookId,
        dueDate: dueDate ? new Date(dueDate) : sevenDaysLater,
        status: "pending",
      },
      include: {
        user: { select: { id: true, name: true } },
        book: { select: { id: true, title: true } },
      },
    });

    return NextResponse.json(borrow);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Gagal membuat request" },
      { status: 500 }
    );
  }
}
