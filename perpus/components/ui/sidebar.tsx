"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun, BookOpen, Users, LogOut, Home } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function Sidebar() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: BookOpen, label: "Buku", path: "/books" },
    { icon: Users, label: "Peminjaman", path: "/borrow" },
  ];

  return (
    <motion.div
      initial={{ width: 250 }}
      animate={{ width: isOpen ? 250 : 60 }}
      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-lg border-r border-gray-200 dark:border-gray-700 flex flex-col"
    >
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
      <nav className="flex-1 px-4 space-y-2">
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
      </nav>
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
