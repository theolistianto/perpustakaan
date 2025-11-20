"use client";
import { useState } from "react";
import Link from "next/link";
import { Book } from "lucide-react";

const categories = [
  { id: 1, name: "Alquran & Tulisan Suci" },
  { id: 2, name: "Ritual & Praktik" },
];

const books = [
  {
    id: 1,
    title: "Journey Through the Qur'an",
    author: "Sharif H. Banna",
    stock: 0,
    category: 1,
  },
  {
    id: 2,
    title: "Al-Quran Cordoba Jariyah Wakaf A5",
    author: "Tim Cordoba",
    stock: 15,
    category: 1,
  },
  {
    id: 3,
    title: "Memahami Sejarah dari Al-Quran",
    author: "Wisnu Tanggap Prabowo",
    stock: 10,
    category: 2,
  },
];

export default function BookCategoryPage() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  // Filter berdasarkan kategori dan search keyword
  const filteredBooks = books.filter((b) => {
    const matchCategory = selectedCategory
      ? b.category === selectedCategory
      : true;
    const matchSearch = b.title.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto p-4 font-sans space-y-6">
      {/* Search & Category */}
      <div className="flex flex-wrap gap-4 items-center">
        <input
          type="text"
          placeholder="Cari buku..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded flex-1"
        />

        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`flex items-center gap-2 rounded-full border px-4 py-2 text-gray-700 hover:bg-gray-100 transition
              ${
                selectedCategory === cat.id
                  ? "bg-blue-100 border-blue-600 font-semibold"
                  : "border-gray-300"
              }`}
          >
            {cat.name}
          </button>
        ))}

        {/* Reset */}
        <button
          onClick={() => setSelectedCategory(null)}
          className="flex items-center gap-2 rounded-full border px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
        >
          Semua
        </button>
      </div>

      {/* Grid Buku */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
        {filteredBooks.length === 0 && (
          <p className="text-gray-500 col-span-full text-center">
            Buku tidak ditemukan
          </p>
        )}

        {filteredBooks.map((book) => (
          <Link
            key={book.id}
            href={`/dashboard/books/${book.id}`}
            className="group block"
          >
            <div className="border border-gray-300 rounded-md overflow-hidden hover:border-gray-500 transition cursor-pointer h-full flex flex-col">
              <div className="relative bg-gray-100 border-b border-gray-300 h-48 flex items-center justify-center group-hover:bg-gray-200 transition">
                <Book className="w-16 h-16 text-gray-600 group-hover:scale-105 transition-transform" />
                {book.stock === 0 && (
                  <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 text-xs rounded">
                    Stok Habis
                  </div>
                )}
                <button className="absolute top-2 right-2 text-gray-400 hover:text-red-600">
                  ♥
                </button>
              </div>
              <div className="p-2 bg-gray-50 border-t border-gray-300 group-hover:bg-gray-100 transition h-20 flex flex-col justify-between">
                <p className="text-xs text-gray-600 line-clamp-1">
                  {book.author}
                </p>
                <h3 className="font-medium text-sm text-gray-800 line-clamp-2">
                  {book.title}
                </h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
