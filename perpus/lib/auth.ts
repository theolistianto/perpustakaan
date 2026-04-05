import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Helper untuk ambil env dengan validasi
function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Environment variable ${name} belum diset`);
  }
  return value;
}

const JWT_SECRET = getEnv("JWT_SECRET");

// Hash password
export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10);
}

// Compare password
export function comparePassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
}

// Generate JWT
export function generateToken(payload: object): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "1h",
  });
}

// Verify JWT
export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error("Token tidak valid atau expired");
  }
}