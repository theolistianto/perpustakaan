"use client";

import { Book } from "lucide-react";

export default function BookCardPage() {
  return (
    <div className="flex flex-col md:flex-row max-w-4xl gap-8 p-6 mx-auto">
      <div className="shrink-0 flex items-center justify-center w-64 h-[380px] border border-gray-300 bg-gray-100 rounded-md shadow-lg">
        <Book className="w-28 h-28 text-gray-600" />
      </div>
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">Card Umum</h1>
        <p>
          Ini adalah halaman card umum, bisa dipakai untuk promosi atau detail
          umum.
        </p>
      </div>
    </div>
  );
}
