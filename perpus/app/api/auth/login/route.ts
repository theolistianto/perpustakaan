import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { comparePassword, generateToken, hashPassword } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password, role } = await req.json();

    // Try to find existing user
    let user = await prisma.user.findUnique({ where: { email } });

    // If user doesn't exist, create demo accounts
    if (!user) {
      if (email === "admin@perpus.id" && password === "admin123" && role === "admin") {
        user = await prisma.user.create({
          data: {
            email,
            password: hashPassword(password),
            role: "admin",
            name: "Administrator",
          },
        });
      } else if (email === "visitor@perpus.id" && password === "visitor123" && role === "member") {
        user = await prisma.user.create({
          data: {
            email,
            password: hashPassword(password),
            role: "member",
            name: "Pengunjung",
          },
        });
      } else {
        return NextResponse.json(
          { error: "Email atau password salah" },
          { status: 401 }
        );
      }
    } else {
      // Verify existing user
      if (!comparePassword(password, user.password) || user.role !== role) {
        return NextResponse.json(
          { error: "Email atau password salah" },
          { status: 401 }
        );
      }
    }

    const token = generateToken({ id: user.id, role: user.role, email: user.email });
    return NextResponse.json({
      success: true,
      token,
      role: user.role,
      email: user.email,
      name: user.name,
    });
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan. Silakan coba lagi." },
      { status: 500 }
    );
  }
}
