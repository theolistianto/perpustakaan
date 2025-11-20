import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET: ambil semua user
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true, // admin atau member
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

    // Validasi minimal
    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password, // bisa di-hash jika mau lebih aman
        role, // "member" atau "admin"
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal membuat anggota" }, { status: 500 });
  }
}
