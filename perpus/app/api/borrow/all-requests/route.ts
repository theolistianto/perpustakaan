import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    // Get all requests regardless of status (don't filter by status)
    const requests = await prisma.borrow.findMany({
      include: { book: true, user: true },
      orderBy: { borrowDate: "desc" },
    });

    return NextResponse.json(requests);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
