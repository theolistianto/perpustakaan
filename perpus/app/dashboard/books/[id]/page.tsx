"use client";

import { useState } from "react";
import { Heart, Share2, Book } from "lucide-react";

interface BookDetail {
  title: string;
  author: string;
}

const books: Record<number, BookDetail> = {
  1: { title: "Journey Through the Qur'an", author: "Sharif H. Banna" },
  2: { title: "Al-Quran Cordoba Jariyah Wakaf A5", author: "Tim Cordoba" },
  3: {
    title: "Memahami Sejarah dari Al-Quran",
    author: "Wisnu Tanggap Prabowo",
  },
};

interface Props {
  params: { id: string };
}

export default function BookDetailPage({ params }: Props) {
  const { id } = params;
  const [favorite, setFavorite] = useState(false);
  const book = books[Number(id)];

  if (!book) {
    return (
      <p className="text-red-600 text-center mt-10 font-semibold">
        Buku tidak ditemukan.
      </p>
    );
  }

  return (
    <div className="flex flex-col md:flex-row max-w-4xl gap-8 p-6 mx-auto">
      <div className="shrink-0 flex items-center justify-center w-64 h-[380px] border border-gray-300 bg-gray-100 rounded-md shadow-lg">
        <Book className="w-28 h-28 text-gray-600" />
      </div>
      <div className="flex flex-col justify-start gap-6">
        <p className="text-sm text-gray-600">{book.author}</p>
        <h1 className="text-3xl font-semibold text-white">{book.title}</h1>
        <div className="flex items-center gap-6 text-gray-700">
          <button
            onClick={() => setFavorite(!favorite)}
            className="flex items-center gap-1 hover:text-red-600 transition-colors"
          >
            <Heart
              size={20}
              className={favorite ? "fill-red-600" : "stroke-current"}
            />
            <span>Favorit</span>
          </button>
          <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
            <Share2 size={20} />
            <span>Bagikan</span>
          </button>
        </div>
      </div>
    </div>
  );
}
