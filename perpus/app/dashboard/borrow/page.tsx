"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { BookOpen, Calendar, CheckCircle, Trash2 } from "lucide-react";

interface Borrow {
  id: number;
  userId: string;
  userName: string;
  bookId: number;
  bookTitle: string;
  date: string;
}

// Daftar buku
const books = [
  { id: 1, title: "Journey Through the Qur'an", stock: 5 },
  { id: 2, title: "Al-Quran Cordoba Jariyah Wakaf A5", stock: 15 },
  { id: 3, title: "Memahami Sejarah dari Al-Quran", stock: 10 },
];

// Fungsi generate user id acak 8 karakter
function generateUserId() {
  const chars = "0123456789";
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export default function BorrowPage() {
  const [bookName, setBookName] = useState("");
  const [isBorrowing, setIsBorrowing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [borrowings, setBorrowings] = useState<Borrow[]>([]);

  // Cari buku sesuai nama (partial match)
  const filteredBooks = books.filter((b) =>
    b.title.toLowerCase().includes(bookName.toLowerCase())
  );

  const selectedBook = filteredBooks.length === 1 ? filteredBooks[0] : null;

  const handleBorrow = async () => {
    if (!selectedBook) {
      alert("Buku tidak ditemukan!");
      return;
    }

    setIsBorrowing(true);
    try {
      await new Promise((res) => setTimeout(res, 500));

      // Generate user acak
      const userId = generateUserId();
      const userName = `User-${userId.slice(0, 4)}`;

      const newBorrow: Borrow = {
        id: borrowings.length + 1,
        userId,
        userName,
        bookId: selectedBook.id,
        bookTitle: selectedBook.title,
        date: new Date().toISOString(),
      };
      setBorrowings([...borrowings, newBorrow]);
      setSuccess(true);
      setBookName("");
    } catch (error) {
      alert("Terjadi kesalahan saat meminjam buku.");
    } finally {
      setIsBorrowing(false);
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus peminjaman ini?")) {
      setBorrowings(borrowings.filter((b) => b.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
      >
        Sistem Peminjaman Buku
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* FORM PINJAM BUKU */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-xl border-0">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <BookOpen className="mr-2 h-8 w-8 text-indigo-600" />
                Pinjam Buku
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <BookOpen className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Masukkan Nama Buku"
                  value={bookName}
                  onChange={(e) => setBookName(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* CARD INFORMASI BUKU TERKAIT */}
              {bookName && filteredBooks.length > 0 && (
                <div className="mt-2">
                  {filteredBooks.map((book) => (
                    <Card
                      key={book.id}
                      className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 shadow-sm mb-2 p-2"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold">{book.title}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            ID: {book.id} | Stok: {book.stock}
                          </p>
                        </div>
                        <span className="text-green-600 dark:text-green-400 font-semibold">
                          {book.stock > 0 ? "Tersedia" : "Habis"}
                        </span>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {/* DIALOG KONFIRMASI */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    disabled={!selectedBook || isBorrowing}
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-3 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105"
                  >
                    {isBorrowing ? "Memproses..." : "Pinjam Buku"}
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center">
                      <Calendar className="mr-2 h-6 w-6 text-indigo-600" />
                      Konfirmasi Peminjaman
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p>
                      Apakah Anda yakin ingin meminjam buku{" "}
                      <strong>{selectedBook?.title}</strong>?
                    </p>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setBookName("")}>
                        Batal
                      </Button>
                      <Button onClick={handleBorrow} disabled={isBorrowing}>
                        {isBorrowing ? "Memproses..." : "Ya, Pinjam"}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </motion.div>

        {/* STATUS PINJAMAN */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-green-400 to-blue-500 text-white shadow-xl border-0">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <CheckCircle className="mr-2 h-8 w-8" />
                Status Peminjaman
              </CardTitle>
            </CardHeader>
            <CardContent>
              {success ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-center"
                >
                  <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-300" />
                  <p className="text-lg font-semibold">
                    Buku berhasil dipinjam!
                  </p>
                  <p className="text-sm opacity-80">
                    Silakan ambil buku di rak yang sesuai.
                  </p>
                </motion.div>
              ) : (
                <p className="text-lg">Belum ada peminjaman aktif.</p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* TABEL PEMINJAMAN */}
      <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-xl border-0">
        <CardHeader>
          <CardTitle>Peminjaman Aktif</CardTitle>
        </CardHeader>
        <CardContent>
          {borrowings.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-300">
              Belum ada peminjaman aktif.
            </p>
          ) : (
            <table className="w-full text-left border">
              <thead>
                <tr>
                  <th className="border p-2">No</th>
                  <th className="border p-2">ID User</th>
                  <th className="border p-2">Nama User</th>
                  <th className="border p-2">Nama Buku</th>
                  <th className="border p-2">Tanggal Pinjam</th>
                  <th className="border p-2">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {borrowings.map((b, i) => (
                  <tr key={b.id}>
                    <td className="border p-2">{i + 1}</td>
                    <td className="border p-2">{b.userId}</td>
                    <td className="border p-2">{b.userName}</td>
                    <td className="border p-2">{b.bookTitle}</td>
                    <td className="border p-2">
                      {new Date(b.date).toLocaleDateString()}
                    </td>
                    <td className="border p-2">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(b.id)}
                        className="flex items-center space-x-1"
                      >
                        <Trash2 className="h-4 w-4" /> <span>Hapus</span>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
