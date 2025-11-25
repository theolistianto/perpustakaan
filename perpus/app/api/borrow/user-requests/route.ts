import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const userEmail = req.headers.get("x-user-email");

    if (!userEmail) {
      return NextResponse.json({ message: "User email not provided" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email: userEmail } });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const requests = await prisma.borrow.findMany({
      where: { userId: user.id },
      include: {
        book: {
          include: {
            category: true,
            shelf: true,
          },
        },
        user: true,
      },
      orderBy: { borrowDate: "desc" },
    });

    return NextResponse.json(requests);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
