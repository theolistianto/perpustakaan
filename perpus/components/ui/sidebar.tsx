"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun, BookOpen, Users, LogOut, Home, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard/dashboard" },
    { icon: BookOpen, label: "Buku", path: "/dashboard/books" },
    { icon: Users, label: "Peminjaman", path: "/borrow/borrow" },
  ];

  // Fungsi tambah buku
  async function addBook() {
    try {
      const res = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Harry Potter",
          author: "J.K. Rowling",
          categoryId: 1,
          shelfId: 1,
        }),
      });
      const data = await res.json();
      alert("Buku berhasil ditambahkan: " + JSON.stringify(data));
    } catch (error) {
      console.error(error);
      alert("Gagal menambahkan buku");
    }
  }

  return (
    <motion.div
      initial={{ width: 250 }}
      animate={{ width: isOpen ? 250 : 60 }}
      className="fixed top-0 left-0 h-screen bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-lg border-r border-gray-200 dark:border-gray-700 flex flex-col z-50"
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <motion.h2
          animate={{ opacity: isOpen ? 1 : 0 }}
          className="text-xl font-bold text-indigo-600 dark:text-indigo-400"
        >
          Perpustakaan
        </motion.h2>
        <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)}>
          ☰
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2 overflow-auto">
        {menuItems.map((item) => (
          <motion.div
            key={item.path}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="ghost"
              className="w-full justify-start hover:bg-indigo-100 dark:hover:bg-indigo-900"
              onClick={() => router.push(item.path)}
            >
              <item.icon className="mr-2 h-5 w-5" />
              {isOpen && <span>{item.label}</span>}
            </Button>
          </motion.div>
        ))}

        {/* Tombol Tambah Buku */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="ghost"
            className="w-full justify-start text-green-600 hover:bg-green-100 dark:hover:bg-green-900"
            onClick={addBook}
          >
            <Plus className="mr-2 h-5 w-5" />
            {isOpen && "Tambah Buku"}
          </Button>
        </motion.div>
      </nav>

      {/* Footer */}
      <div className="p-4 space-y-2">
        <Button
          variant="ghost"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="w-full justify-start"
        >
          {theme === "dark" ? (
            <Sun className="mr-2 h-5 w-5" />
          ) : (
            <Moon className="mr-2 h-5 w-5" />
          )}
          {isOpen && "Toggle Theme"}
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-red-500 hover:bg-red-100 dark:hover:bg-red-900"
        >
          <LogOut className="mr-2 h-5 w-5" />
          {isOpen && "Logout"}
        </Button>
      </div>
    </motion.div>
  );
}
