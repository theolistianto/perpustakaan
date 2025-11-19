import { NextResponse } from "next/server";
import { verifyToken } from "./lib/auth";

export function middleware(req: any) {
  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.redirect(new URL("/login", req.url));
  try {
    verifyToken(token);
  } catch {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/books/:path*", "/borrow/:path*"],
};
