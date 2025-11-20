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
    title: "Journey Through the Qur'an; Menjelajah...",
    author: "Sharif H. Banna",
    stock: 0,
  },
  {
    id: 2,
    title: "Al-Quran Cordoba Jariyah Wakaf A5",
    author: "Tim Cordoba",
    stock: 15,
  },
  {
    id: 3,
    title: "Memahami Sejarah dari Al-Quran",
    author: "Wisnu Tanggap Prabowo",
    stock: 10,
  },
  { id: 4, title: "Al Quran Mushaf Tajwid Warna", author: "Tim Gip", stock: 5 },
  {
    id: 5,
    title: "Al-Quran The Greatest Miracle",
    author: "Tim Cordoba Kids",
    stock: 20,
  },
  { id: 6, title: "Kalbu Al-Quran", author: "Asim Khan", stock: 0 },
  {
    id: 7,
    title: "Zikir dan Doa Setelah Shalat",
    author: "Hamdan Hameedan",
    stock: 8,
  },
];

export default function BookCategoryPage() {
  const [selectedCategory, setSelectedCategory] = useState(1);

  const filteredBooks = books;

  return (
    <div className="max-w-7xl mx-auto p-4 font-sans">
      {/* Category Buttons */}
      <div className="flex gap-4 mb-6">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`flex items-center gap-2 rounded-full border px-4 py-2 text-gray-700 hover:bg-gray-100
              ${
                selectedCategory === cat.id
                  ? "bg-blue-100 border-blue-600 font-semibold"
                  : "border-gray-300"
              }`}
          >
            <div className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-300 text-white">
              G
            </div>
            {cat.name}
          </button>
        ))}
      </div>

      {/* Books */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
        {filteredBooks.map((book) => (
          <Link
            key={book.id}
            href={`/books/${book.id}`}
            className="group block"
          >
            <div className="border border-gray-300 rounded-md overflow-hidden hover:border-gray-500 transition cursor-pointer h-full flex flex-col">
              {/* Book Icon Box */}
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

              {/* Info Box – fixed height */}
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
