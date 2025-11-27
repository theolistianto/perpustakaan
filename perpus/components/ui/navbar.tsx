"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Library, LogOut, Menu, X, Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";
import { navigateWithAuth } from "@/lib/auth-middleware";

export default function Navbar() {
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userUsername, setUserUsername] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    const name = localStorage.getItem("userName");
    const username = localStorage.getItem("userUsername");
    const email = localStorage.getItem("userEmail");
    setUserRole(role);
    setUserName(name);
    setUserUsername(username);
    setUserEmail(email);

    // Check dark mode from document
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);
  }, []);

  const toggleDarkMode = () => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    localStorage.removeItem("userUsername");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("token");
    router.push("/auth/signup");
    window.location.reload();
  };

  const [isOpen, setIsOpen] = useState(false);

  const menuItems = userRole 
    ? (userRole === "admin" 
      ? [
          { label: "Setting", href: "/dashboard/settings" },
          { label: "Cara Meminjam", href: "/panduan/meminjam" },
          { label: "Buku", href: "/dashboard/books" },
        ]
      : [
          { label: "Peminjaman Saya", href: "/dashboard/borrow" },
          { label: "Cara Meminjam", href: "/panduan/meminjam" },
          { label: "Buku", href: "/dashboard/books" },
        ]
    )
    : [
        { label: "Buku", href: "/dashboard/books" },
        { label: "Cara Meminjam", href: "/panduan/meminjam" },
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
    PERPUS<span className="text-blue-600">CIS</span>
  </span>
</Link>


          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {menuItems.map((item) => (
              <button
                key={item.href}
                onClick={() => navigateWithAuth(item.href, router)}
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition font-medium bg-transparent border-none cursor-pointer"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Login/Logout Section */}
          {userRole ? (
            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              >
                {isDark ? (
                  <Sun className="w-5 h-5 text-yellow-600" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-600" />
                )}
              </button>
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
            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              >
                {isDark ? (
                  <Sun className="w-5 h-5 text-yellow-600" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-600" />
                )}
              </button>
              <Link
                href="/auth/login"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
              >
                Masuk
              </Link>
            </div>
          )}

          {/* Mobile Menu Button  */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="block lg:hidden text-gray-700 dark:text-gray-300"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden pb-4 border-t border-gray-200 dark:border-gray-800">
            {menuItems.map((item) => (
              <button
                key={item.href}
                onClick={() => {
                  navigateWithAuth(item.href, router);
                  setIsOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition bg-transparent border-none cursor-pointer"
              >
                {item.label}
              </button>
            ))}
            
            {/* Dark Mode Toggle - Mobile */}
            <button
              onClick={toggleDarkMode}
              className="w-full px-4 py-2 flex items-center justify-between text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              <span>{isDark ? "Mode Gelap" : "Mode Terang"}</span>
              {isDark ? (
                <Sun className="w-5 h-5 text-yellow-600" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600" />
              )}
            </button>
            
            {userRole ? (
              <>
                <div className="px-4 py-2 text-sm">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {userUsername || "User"}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {userRole === "admin" ? "Admin" : "Pengunjung"}
                  </p>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="w-full mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/auth/login"
                onClick={() => setIsOpen(false)}
                className="w-full mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition block text-center"
              >
                Masuk
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
