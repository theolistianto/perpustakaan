import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id: userId } = verifyToken(token) as any;
  const { bookId } = await req.json();
  await prisma.borrow.create({ data: { userId, bookId } });
  return NextResponse.json({ success: true });
}
