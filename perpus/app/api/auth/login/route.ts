import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { comparePassword, generateToken, hashPassword } from "@/lib/auth";

function generateRandomId(): string {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
}

export async function POST(req: NextRequest) {
  try {
    const { username, password, role } = await req.json();

    // Try to find existing user by username
    let user = await prisma.user.findUnique({ where: { username } });

    // If user doesn't exist, create demo accounts
    if (!user) {
      if (username === "admin" && password === "admin123" && role === "admin") {
        user = await prisma.user.create({
          data: {
            email: "admin@perpus.id",
            password: hashPassword(password),
            role: "admin",
            name: "Administrator",
            username: "admin",
            displayUserId: generateRandomId(),
          },
        });
      } else if (username === "visitor" && password === "visitor123" && role === "member") {
        user = await prisma.user.create({
          data: {
            email: "visitor@perpus.id",
            password: hashPassword(password),
            role: "member",
            name: "Pengunjung",
            username: "visitor",
            displayUserId: generateRandomId(),
          },
        });
      } else {
        return NextResponse.json(
          { error: "Username atau password salah" },
          { status: 401 }
        );
      }
    } else {
      // Verify existing user
      if (!comparePassword(password, user.password) || user.role !== role) {
        return NextResponse.json(
          { error: "Username atau password salah" },
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
      username: user.username,
      displayUserId: user.displayUserId,
    });
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan. Silakan coba lagi." },
      { status: 500 }
    );
  }
}
