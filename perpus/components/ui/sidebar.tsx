"use client";
import { Button } from "@/components/ui/button";
import { Moon, Sun, BookOpen, Users, BarChart3, Plus, LogOut, Settings, Home } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Sidebar() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    setUserRole(role);
  }, []);

  const adminMenuItems = [
    { icon: Home, label: "Beranda", path: "/" },
    { icon: BarChart3, label: "Dashboard", path: "/dashboard/dashboard" },
    { icon: BookOpen, label: "Buku", path: "/dashboard/books" },
    { icon: Users, label: "Peminjam", path: "/dashboard/peminjam" },
    { icon: BookOpen, label: "Peminjaman", path: "/dashboard/borrow" },
    { icon: Settings, label: "Settings", path: "/dashboard/settings" },
  ];

  const memberMenuItems = [
    { icon: Home, label: "Beranda", path: "/" },
    { icon: BookOpen, label: "Katalog Buku", path: "/dashboard/books" },
    { icon: BookOpen, label: "Peminjaman Saya", path: "/dashboard/borrow" },
  ];

  const menuItems = userRole === "admin" ? adminMenuItems : memberMenuItems;

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("token");
    router.push("/");
  };

  return (
    <div className="w-64 bg-white dark:bg-gray-800 shadow-lg p-4 flex flex-col h-screen">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-blue-600">Perpustakaan</h2>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
          {userRole === "admin" ? "👨‍💼 Admin" : "👤 Pengunjung"}
        </p>
      </div>

      {/* Menu Navigation */}
      <nav className="space-y-2 flex-1">
        {menuItems.map((item) => (
          <Button
            key={item.path}
            variant="ghost"
            className="w-full justify-start"
            onClick={() => router.push(item.path)}
          >
            <item.icon className="mr-2" />
            {item.label}
          </Button>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="space-y-2 border-t border-gray-200 dark:border-gray-700 pt-4">
        <Button
          variant="ghost"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="w-full justify-start"
        >
          {theme === "dark" ? (
            <Sun className="mr-2 w-4 h-4" />
          ) : (
            <Moon className="mr-2 w-4 h-4" />
          )}
          <span className="text-sm">Theme</span>
        </Button>

        <Button
          onClick={handleLogout}
          className="w-full justify-start bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/30"
        >
          <LogOut className="mr-2 w-4 h-4" />
          <span className="text-sm">Logout</span>
        </Button>
      </div>
    </div>
  );
}
