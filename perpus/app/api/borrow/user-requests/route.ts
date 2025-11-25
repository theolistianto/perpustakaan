import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const userEmail = req.headers.get("x-user-email");
    const bookId = req.nextUrl.searchParams.get("bookId");

    if (!userEmail) {
      return NextResponse.json({ message: "User email not provided" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email: userEmail } });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const whereClause: any = { userId: user.id };
    if (bookId) {
      whereClause.bookId = parseInt(bookId);
    }

    const requests = await prisma.borrow.findMany({
      where: whereClause,
      include: { book: true, user: true },
      orderBy: { borrowDate: "desc" },
    });

    return NextResponse.json(requests);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
