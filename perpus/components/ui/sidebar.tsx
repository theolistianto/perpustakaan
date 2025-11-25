"use client";
import { Button } from "@/components/ui/button";
import { Moon, Sun, BookOpen, Users, BarChart3, Plus } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Sidebar() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [isAddingBook, setIsAddingBook] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    categoryId: "",
    shelfId: "",
    stock: "0",
  });

  const menuItems = [
    { icon: BarChart3, label: "Dashboard", path: "/dashboard/dashboard" },
    { icon: BookOpen, label: "Buku", path: "/dashboard/books" },
    { icon: Users, label: "Peminjam", path: "/dashboard/peminjam" },
    { icon: BookOpen, label: "peminjaman saya", path: "/dashboard/borrow" },
  ];

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          author: formData.author,
          categoryId: parseInt(formData.categoryId),
          shelfId: parseInt(formData.shelfId),
          stock: parseInt(formData.stock),
        }),
      });

      if (response.ok) {
        alert("Buku berhasil ditambahkan!");
        setFormData({ title: "", author: "", categoryId: "", shelfId: "", stock: "0" });
        setIsAddingBook(false);
        router.push("/dashboard/books");
      } else {
        alert("Gagal menambahkan buku");
      }
    } catch (error) {
      alert("Error: " + (error as Error).message);
    }
  };

  return (
    <div className="w-64 bg-white dark:bg-gray-800 shadow-lg p-4 flex flex-col h-screen">
      <h2 className="text-xl font-bold mb-4 text-blue-600">Perpustakaan</h2>
      
      {/* Primary Add Book Button */}
      <button
        onClick={() => setIsAddingBook(!isAddingBook)}
        className="w-full mb-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
      >
        <Plus className="w-5 h-5" />
        Tambah Buku
      </button>

      {/* Add Book Form Modal */}
      {isAddingBook && (
        <div className="mb-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
            Tambah Buku Baru
          </h3>
          <form onSubmit={handleAddBook} className="space-y-2">
            <input
              type="text"
              placeholder="Judul Buku"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded text-sm dark:bg-gray-700 dark:text-white"
            />
            <input
              type="text"
              placeholder="Pengarang"
              required
              value={formData.author}
              onChange={(e) =>
                setFormData({ ...formData, author: e.target.value })
              }
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded text-sm dark:bg-gray-700 dark:text-white"
            />
            <select
              required
              value={formData.categoryId}
              onChange={(e) =>
                setFormData({ ...formData, categoryId: e.target.value })
              }
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded text-sm dark:bg-gray-700 dark:text-white"
            >
              <option value="">Pilih Kategori</option>
              <option value="1">Fiksi</option>
              <option value="2">Non-Fiksi</option>
              <option value="3">Teknologi</option>
            </select>
            <select
              required
              value={formData.shelfId}
              onChange={(e) =>
                setFormData({ ...formData, shelfId: e.target.value })
              }
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded text-sm dark:bg-gray-700 dark:text-white"
            >
              <option value="">Pilih Rak</option>
              <option value="1">Rak A</option>
              <option value="2">Rak B</option>
              <option value="3">Rak C</option>
            </select>
            <input
              type="number"
              placeholder="Stok"
              required
              value={formData.stock}
              onChange={(e) =>
                setFormData({ ...formData, stock: e.target.value })
              }
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded text-sm dark:bg-gray-700 dark:text-white"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded text-sm font-medium transition-colors"
              >
                Simpan
              </button>
              <button
                type="button"
                onClick={() => setIsAddingBook(false)}
                className="flex-1 bg-gray-400 hover:bg-gray-500 text-white py-2 rounded text-sm font-medium transition-colors"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

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
