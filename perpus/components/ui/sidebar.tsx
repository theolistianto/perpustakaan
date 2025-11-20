"use client";
import { Button } from "@/components/ui/button";
import { Moon, Sun, BookOpen, Users, BarChart3 } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";

export default function Sidebar() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  const menuItems = [
    { icon: BarChart3, label: "Dashboard", path: "/dashboard" },
    { icon: BookOpen, label: "Buku", path: "/books" },
    { icon: Users, label: "Anggota", path: "/members" },
  ];

  return (
    <div className="w-64 bg-white dark:bg-gray-800 shadow-lg p-4">
      <h2 className="text-xl font-bold mb-4 text-blue-600">Perpustakaan</h2>
      <nav className="space-y-2">
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
