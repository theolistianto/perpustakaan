import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

function generateRandomId(): string {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
}

export async function POST(req: NextRequest) {
  try {
    const { username, email, password } = await req.json();

    // Check if username already exists
    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
      return NextResponse.json(
        { error: "Username sudah digunakan" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) {
      return NextResponse.json(
        { error: "Email sudah terdaftar" },
        { status: 400 }
      );
    }

    // Create new member user (visitor/member only, not admin)
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashPassword(password),
        role: "member",
        name: username,
        displayUserId: generateRandomId(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Pendaftaran berhasil!",
      username: user.username,
    }, { status: 201 });
  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan. Silakan coba lagi." },
      { status: 500 }
    );
  }
}
