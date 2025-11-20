"use client";

import { useEffect, useState } from "react";

interface Book {
  id: number;
  title: string;
  author: string;
  status: string;
}

export default function BookList() {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    fetch("/api/books")
      .then((res) => res.json())
      .then((data) => setBooks(data));
  }, []);

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Daftar Buku</h3>
      <table className="w-full bg-white shadow-md rounded">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 text-left">Judul</th>
            <th className="p-2 text-left">Penulis</th>
            <th className="p-2 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id} className="border-t">
              <td className="p-2">{book.title}</td>
              <td className="p-2">{book.author}</td>
              <td className="p-2">{book.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
