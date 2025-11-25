"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Library, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { label: "Beranda", href: "/" },
    { label: "Katalog", href: "/dashboard/books" },
    { label: "Tentang", href: "#about" },
    { label: "Fasilitas", href: "#features" },
  ];

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50">
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

          {/* Login Button */}
          <button
            onClick={() => router.push("/auth/login")}
            className="hidden md:block px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
          >
            Login
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-700 dark:text-gray-300"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-gray-200 dark:border-gray-800">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                {item.label}
              </Link>
            ))}
            <button
              onClick={() => {
                router.push("/auth/login");
                setIsOpen(false);
              }}
              className="w-full mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
            >
              Login
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
