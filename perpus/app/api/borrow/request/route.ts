import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { bookId } = await req.json();
    const userEmail = req.headers.get("x-user-email");

    if (!userEmail) {
      return NextResponse.json({ message: "User email not provided" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email: userEmail } });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const borrow = await prisma.borrow.create({
      data: {
        userId: user.id,
        bookId,
        status: "pending",
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      },
      include: { book: true, user: true },
    });

    return NextResponse.json(borrow, { status: 201 });
  } catch (error: any) {
    console.error("Borrow request error:", error);
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
