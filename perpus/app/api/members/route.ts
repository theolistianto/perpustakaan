import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

function generateRandomId(): string {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
}

function generateUsername(): string {
  return `user_${Date.now()}`;
}

// GET: ambil semua user
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });
    return NextResponse.json(users);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal mengambil anggota" }, { status: 500 });
  }
}

// POST: buat user baru
export async function POST(req: NextRequest) {
  try {
    const { name, email, password, role } = await req.json();

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password,
        role,
        username: generateUsername(),
        displayUserId: generateRandomId(),
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal membuat anggota" }, { status: 500 });
  }
}
