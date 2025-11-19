import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { comparePassword, generateToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { email, password, role } = await req.json();
  const user = await prisma.user.findUnique({ where: { email } });
  if (
    !user ||
    !comparePassword(password, user.password) ||
    user.role !== role
  ) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
  const token = generateToken({ id: user.id, role: user.role });
  const res = NextResponse.json({ success: true });
  res.cookies.set("token", token, { httpOnly: true });
  return res;
}
