"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { Search, Book, MapPin } from "lucide-react";

export default function BooksPage() {
  const [books, setBooks] = useState<any[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [shelfFilter, setShelfFilter] = useState("all");

  useEffect(() => {
    fetch("/api/books")
      .then(async (res) => {
        const raw = await res.text();
        console.log("RAW API:", raw);
        const data = JSON.parse(raw);

        if (!Array.isArray(data)) {
          console.error("API error:", data);
          return;
        }

        setBooks(data);
        setFilteredBooks(data);
      })
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  useEffect(() => {
    let filtered = books.filter(
      (book) =>
        book.title.toLowerCase().includes(search.toLowerCase()) ||
        book.author.toLowerCase().includes(search.toLowerCase())
    );

    if (categoryFilter !== "all") {
      filtered = filtered.filter(
        (book) => book.category.name === categoryFilter
      );
    }

    if (shelfFilter !== "all") {
      filtered = filtered.filter((book) => book.shelf.name === shelfFilter);
    }

    setFilteredBooks(filtered);
  }, [search, categoryFilter, shelfFilter, books]);

  const categories = [...new Set(books.map((book) => book.category.name))];
  const shelves = [...new Set(books.map((book) => book.shelf.name))];

  return (
    <div className="space-y-6">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
      >
        Daftar Buku
      </motion.h1>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Cari judul atau penulis..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* CATEGORY SELECT */}
        <Select onValueChange={setCategoryFilter} defaultValue="all">
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Filter Kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Kategori</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* SHELF SELECT */}
        <Select onValueChange={setShelfFilter} defaultValue="all">
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Filter Rak" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Rak</SelectItem>
            {shelves.map((shelf) => (
              <SelectItem key={shelf} value={shelf}>
                {shelf}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredBooks.map((book, index) => (
          <motion.div
            key={book.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            className="group"
          >
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-lg border-0 hover:shadow-2xl transition-all duration-300 overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
                <Book className="h-16 w-16 text-white opacity-80 group-hover:opacity-100 transition-opacity" />
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-200 line-clamp-2">
                  {book.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>Penulis:</strong> {book.author}
                </p>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Book className="h-4 w-4 mr-1" />
                  <span>
                    <strong>Kategori:</strong> {book.category.name}
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>
                    <strong>Rak:</strong> {book.shelf.name}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {filteredBooks.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Book className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Tidak ada buku yang ditemukan.
          </p>
        </motion.div>
      )}
    </div>
  );
}
