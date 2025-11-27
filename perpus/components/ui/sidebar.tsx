"use client";
import { BookOpen, LogOut, Settings, Home, HelpCircle, X, BarChart3, Users, Moon, Sun } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userUsername, setUserUsername] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    const username = localStorage.getItem("userUsername");
    setUserRole(role);
    setUserUsername(username);

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

  const adminMenuItems = [
    { icon: Home, label: "Beranda", path: "/" },
    { icon: BarChart3, label: "Dashboard", path: "/dashboard/dashboard" },
    { icon: BookOpen, label: "Buku", path: "/dashboard/books" },
    { icon: BookOpen, label: "Peminjaman", path: "/dashboard/borrow" },
    { icon: HelpCircle, label: "Cara Meminjam", path: "/panduan/meminjam" },
    { icon: Settings, label: "Settings", path: "/dashboard/settings" },
  ];

  const memberMenuItems = [
    { icon: Home, label: "Beranda", path: "/" },
    { icon: BookOpen, label: "Katalog Buku", path: "/dashboard/books" },
    { icon: BookOpen, label: "Peminjaman Saya", path: "/dashboard/borrow" },
    { icon: HelpCircle, label: "Cara Meminjam", path: "/panduan/meminjam" },
  ];

  const menuItems = userRole === "admin" ? adminMenuItems : memberMenuItems;

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    localStorage.removeItem("userUsername");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("token");
    router.push("/auth/signup");
    window.location.reload();
  };

  const handleNavigate = (path: string) => {
    router.push(path);
    onClose();
  };

  return (
    <>
      {/* Overlay untuk mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:relative w-64 bg-gradient-to-b from-gray-900 to-gray-800 dark:from-gray-950 dark:to-gray-900 text-white shadow-2xl flex flex-col h-screen z-50 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 border-b border-gray-700 dark:border-gray-800 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white shadow-lg">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="font-bold text-sm sm:text-base">
              Perpus<span className="text-blue-400">System</span>
            </span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-gray-400 hover:text-white transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* User Info */}
        {userRole && (
          <div className="px-4 sm:px-6 py-4 border-b border-gray-700 dark:border-gray-800 bg-gray-800/50 dark:bg-gray-900/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center font-semibold text-white shadow-md flex-shrink-0">
                {userUsername?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-white truncate">{userUsername || "User"}</p>
                <p className="text-xs text-gray-400">
                  {userRole === "admin" ? "Admin" : "Pengunjung"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Menu Items */}
        <nav className="px-3 sm:px-4 py-4 space-y-2 flex-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => handleNavigate(item.path)}
                className="w-full flex items-center gap-3 px-3 sm:px-4 py-2.5 rounded-lg text-gray-300 hover:bg-gray-700 dark:hover:bg-gray-700 hover:text-white transition duration-150"
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-left text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Logout Button & Dark Mode Toggle */}
        {userRole && (
          <div className="px-3 sm:px-4 py-4 border-t border-gray-700 dark:border-gray-800 space-y-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 bg-red-600 hover:bg-red-700 dark:hover:bg-red-600 rounded-lg font-semibold transition duration-150 text-sm"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
              <span className="sm:hidden">Log out</span>
            </button>
            <button
              onClick={toggleDarkMode}
              className="w-full flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 bg-gray-700 hover:bg-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg font-semibold transition duration-150 text-sm"
            >
              {isDark ? (
                <>
                  <Sun className="w-4 h-4" />
                  <span className="hidden sm:inline">Light Mode</span>
                  <span className="sm:hidden">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4" />
                  <span className="hidden sm:inline">Dark Mode</span>
                  <span className="sm:hidden">Dark</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
