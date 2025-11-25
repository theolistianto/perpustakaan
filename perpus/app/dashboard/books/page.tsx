"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen } from "lucide-react";

interface Book {
  id: number;
  title: string;
  author: string;
  stock: number;
  image?: string;
  categoryId: number;
}

interface Category {
  id: number;
  name: string;
}

export default function BookCategoryPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const categories: Category[] = [
    { id: 1, name: "Fiksi" },
    { id: 2, name: "Non-Fiksi" },
    { id: 3, name: "Teknologi" },
  ];

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch("/api/books");
        if (response.ok) {
          const data = await response.json();
          setBooks(data);
          setFilteredBooks(data);
        }
      } catch (error) {
        console.error("Failed to fetch books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  useEffect(() => {
    let filtered = books;

    if (selectedCategory) {
      filtered = filtered.filter((b) => b.categoryId === selectedCategory);
    }

    if (search) {
      filtered = filtered.filter(
        (b) =>
          b.title.toLowerCase().includes(search.toLowerCase()) ||
          b.author.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredBooks(filtered);
  }, [selectedCategory, search, books]);

  return (
    <div className="max-w-7xl mx-auto p-4 font-sans space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <BookOpen className="w-8 h-8 text-blue-600" />
          Katalog Buku
        </h1>
        <Link
          href="/dashboard/books/tambah"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
        >
          + Tambah Buku
        </Link>
      </div>

      {/* Search & Category */}
      <div className="flex flex-wrap gap-4 items-center">
        <input
          type="text"
          placeholder="Cari buku atau pengarang..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 dark:border-gray-600 p-3 rounded-lg flex-1 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`flex items-center gap-2 rounded-full border px-4 py-2 transition ${
              selectedCategory === cat.id
                ? "bg-blue-600 border-blue-600 text-white font-semibold"
                : "border-gray-300 text-gray-700 dark:text-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            {cat.name}
          </button>
        ))}

        {selectedCategory && (
          <button
            onClick={() => setSelectedCategory(null)}
            className="flex items-center gap-2 rounded-full border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            Reset
          </button>
        )}
      </div>

      {/* Grid Buku */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Memuat buku...</p>
        </div>
      ) : filteredBooks.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">Buku tidak ditemukan</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filteredBooks.map((book) => (
            <Link
              key={book.id}
              href={`/dashboard/books/${book.id}`}
              className="group block"
            >
              <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-lg hover:border-blue-500 transition cursor-pointer h-full flex flex-col">
                {/* Image Container */}
                <div className="relative bg-gray-100 dark:bg-gray-700 border-b border-gray-300 dark:border-gray-700 h-56 flex items-center justify-center group-hover:bg-gray-200 dark:group-hover:bg-gray-600 transition overflow-hidden">
                  {book.image ? (
                    <img
                      src={book.image}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <BookOpen className="w-16 h-16 text-gray-400 group-hover:scale-110 group-hover:text-gray-500 transition-all" />
                  )}
                  {book.stock === 0 && (
                    <div className="absolute top-2 left-2 bg-red-600 text-white px-3 py-1 text-xs rounded-full font-semibold">
                      Stok Habis
                    </div>
                  )}
                  {book.stock > 0 && (
                    <div className="absolute top-2 right-2 bg-green-600 text-white px-3 py-1 text-xs rounded-full font-semibold">
                      Stok: {book.stock}
                    </div>
                  )}
                </div>

                {/* Info Container */}
                <div className="p-3 bg-white dark:bg-gray-800 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mb-1">
                      {book.author}
                    </p>
                    <h3 className="font-semibold text-sm text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                      {book.title}
                    </h3>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
