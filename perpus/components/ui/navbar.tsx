"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Library, LogOut } from "lucide-react";
import { useState, useEffect } from "react";

export default function Navbar() {
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userUsername, setUserUsername] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    const name = localStorage.getItem("userName");
    const username = localStorage.getItem("userUsername");
    const email = localStorage.getItem("userEmail");
    setUserRole(role);
    setUserName(name);
    setUserUsername(username);
    setUserEmail(email);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    localStorage.removeItem("userUsername");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("token");
    router.push("/auth/signup");
    window.location.reload();
  };

  const menuItems = [
    { label: "E-Catalog", href: "/e-catalog" },
    ...(userRole === "admin" ? [{ label: "Setting", href: "/dashboard/settings" }] : [
      { label: "Beranda", href: "/" },
      { label: "Cara Meminjam", href: "/panduan/meminjam" },
    ]),
    { label: "Tentang", href: "#about" },
    { label: "Buku", href: "#books" },
  ];

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white">
              <Library className="w-5 h-5" />
            </div>
            <span className="text-gray-900 dark:text-white">
              Perpus<span className="text-blue-600">System</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition font-medium"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Login/Logout Section */}
          {userRole ? (
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-3 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {userUsername?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="flex flex-col">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {userUsername || "User"}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {userRole === "admin" ? "Admin" : "Pengunjung"}
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="hidden md:block px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
            >
              Masuk
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
