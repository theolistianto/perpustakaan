"use client";
import { Button } from "@/components/ui/button";
import { Moon, Sun, BookOpen, Users, BarChart3, Plus } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";

export default function Sidebar() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  const menuItems = [
    { icon: BarChart3, label: "Dashboard", path: "/dashboard/dashboard" },
    { icon: BookOpen, label: "Buku", path: "/dashboard/books" },
    { icon: Users, label: "Peminjam", path: "/dashboard/peminjam" },
    { icon: BookOpen, label: "peminjaman saya", path: "/dashboard/borrow" },
  ];

  return (
    <div className="w-64 bg-white dark:bg-gray-800 shadow-lg p-4 flex flex-col h-screen">
      <h2 className="text-xl font-bold mb-4 text-blue-600">Perpustakaan</h2>
      
      {/* Primary Add Book Button */}
      <button
        onClick={() => router.push("/dashboard/books/tambah")}
        className="w-full mb-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
      >
        <Plus className="w-5 h-5" />
        Tambah Buku
      </button>

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

      {/* Theme Toggle */}
      <Button
        variant="ghost"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="mt-4 w-full"
      >
        {theme === "dark" ? (
          <Sun className="mr-2" />
        ) : (
          <Moon className="mr-2" />
        )}
        Toggle Theme
      </Button>
    </div>
  );
}
