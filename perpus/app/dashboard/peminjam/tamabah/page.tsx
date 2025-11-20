"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function BorrowForm() {
  const [loanNumber] = useState("PJ00325");
  const [loanDate, setLoanDate] = useState("2025-11-20");
  const [memberId, setMemberId] = useState("");
  const [biodata, setBiodata] = useState<string | null>(null);
  const [loanDuration, setLoanDuration] = useState("");
  const [bookCode, setBookCode] = useState("");

  const [borrowedBooks, setBorrowedBooks] = useState([
    {
      id: 1,
      title: "Cerita Anak",
      publisher: "Anak Cerdas / 2024",
      quantity: 1,
    },
  ]);

  function searchMember() {
    if (memberId === "12345") setBiodata("John Doe, Anggota Aktif");
    else setBiodata(null);
  }

  function searchBook() {
    if (bookCode === "BK001") {
      setBorrowedBooks((b) => [
        ...b,
        {
          id: b.length + 1,
          title: "Buku Baru",
          publisher: "Penerbit ABC / 2022",
          quantity: 1,
        },
      ]);
      setBookCode("");
    }
  }

  function updateQuantity(id: number, qty: number) {
    setBorrowedBooks((b) =>
      b.map((book) =>
        book.id === id ? { ...book, quantity: qty > 0 ? qty : 1 } : book
      )
    );
  }

  function removeBook(id: number) {
    setBorrowedBooks((b) => b.filter((book) => book.id !== id));
  }

  return (
    <div
      className="
      p-4 rounded-md space-y-6 shadow-md
      bg-gray-100 border border-gray-300
      dark:bg-gray-800 dark:border-gray-700
      transition-colors
    "
    >
      <div className="flex flex-col md:flex-row gap-6">
        {/* LEFT CARD */}
        <div
          className="
          md:w-1/2 p-4 rounded shadow-sm
          bg-gray-200 border border-gray-300
          dark:bg-gray-700 dark:border-gray-600
        "
        >
          <h3 className="font-semibold mb-4 text-lg text-gray-800 dark:text-gray-100">
            📘 Data Transaksi
          </h3>

          <div className="grid grid-cols-3 gap-y-4 items-center">
            <Label className="text-right text-gray-700 dark:text-gray-200">
              No Peminjaman :
            </Label>
            <Input
              readOnly
              value={loanNumber}
              className="
                col-span-2 bg-gray-300 cursor-not-allowed
                dark:bg-gray-600 dark:text-white
              "
            />

            <Label className="text-right text-gray-700 dark:text-gray-200">
              Tgl Peminjaman :
            </Label>
            <Input
              type="date"
              value={loanDate}
              onChange={(e) => setLoanDate(e.target.value)}
              className="col-span-2 bg-white dark:bg-gray-600 dark:text-white"
            />

            <Label className="text-right text-gray-700 dark:text-gray-200">
              ID Anggota / NIM :
            </Label>
            <div className="col-span-2 flex gap-2">
              <Input
                value={memberId}
                placeholder="Masukkan ID / NIM"
                onChange={(e) => setMemberId(e.target.value)}
                className="bg-white dark:bg-gray-600 dark:text-white"
              />
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Cari
              </Button>
            </div>

            <Label className="text-right text-gray-700 dark:text-gray-200">
              Biodata :
            </Label>
            <p
              className={`col-span-2 font-semibold ${
                biodata
                  ? "text-green-700 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {biodata ?? "* Belum Ada Hasil"}
            </p>

            <Label className="text-right text-gray-700 dark:text-gray-200">
              Lama Pinjam :
            </Label>
            <Input
              placeholder="Contoh: 2 Hari"
              value={loanDuration}
              onChange={(e) => setLoanDuration(e.target.value)}
              className="col-span-2 bg-white dark:bg-gray-600 dark:text-white"
            />
          </div>
        </div>

        {/* RIGHT CARD */}
        <div
          className="
          md:w-1/2 p-4 rounded shadow-sm
          bg-gray-200 border border-gray-300
          dark:bg-gray-700 dark:border-gray-600
        "
        >
          <h3 className="font-semibold mb-4 text-lg text-gray-800 dark:text-gray-100">
            📚 Pinjam Buku
          </h3>

          <div className="flex gap-2 mb-4 items-center">
            <Label className="min-w-[120px] text-gray-700 dark:text-gray-200">
              Kode Buku :
            </Label>
            <Input
              placeholder="BK001"
              value={bookCode}
              onChange={(e) => setBookCode(e.target.value)}
              className="flex-1 bg-white dark:bg-gray-600 dark:text-white"
            />
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              Tambah
            </Button>
          </div>

          {/* TABLE */}
          <Table
            className="
              bg-white border border-gray-300
              dark:bg-gray-600 dark:border-gray-500
            "
          >
            <TableHeader className="bg-gray-300 dark:bg-gray-500">
              <TableRow>
                <TableHead className="dark:text-white">No</TableHead>
                <TableHead className="dark:text-white">Title</TableHead>
                <TableHead className="dark:text-white">
                  Penerbit / Tahun
                </TableHead>
                <TableHead className="dark:text-white">Jml</TableHead>
                <TableHead className="dark:text-white">Aksi</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {borrowedBooks.map((book, i) => (
                <TableRow key={book.id} className="dark:border-gray-500">
                  <TableCell className="dark:text-white">{i + 1}</TableCell>
                  <TableCell className="dark:text-white">
                    {book.title}
                  </TableCell>
                  <TableCell className="dark:text-white">
                    {book.publisher}
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min={1}
                      value={book.quantity}
                      onChange={(e) =>
                        updateQuantity(book.id, parseInt(e.target.value))
                      }
                      className="w-20 bg-white dark:bg-gray-500 dark:text-white"
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="bg-red-600 hover:bg-red-700 text-white"
                      onClick={() => removeBook(book.id)}
                    >
                      ✕
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex justify-end gap-4">
        <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6">
          Submit
        </Button>
        <Button className="bg-gray-500 hover:bg-gray-600 text-white px-6">
          Kembali
        </Button>
      </div>
    </div>
  );
}
