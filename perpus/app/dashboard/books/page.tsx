"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function BooksPage() {
  const [books, setBooks] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");

  useEffect(() => {
    fetchBooks();
  }, [search, categoryId]);

  const fetchBooks = () => {
    fetch(`/api/books?search=${search}&categoryId=${categoryId}`)
      .then((res) => res.json())
      .then(setBooks);
  };

  const deleteBook = async (id: number) => {
    await fetch(`/api/books/${id}`, { method: "DELETE" });
    fetchBooks();
  };

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold text-blue-600">Manajemen Buku</h1>
      <div className="flex gap-4">
        <Input
          placeholder="Cari judul..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select onValueChange={setCategoryId}>
          <SelectTrigger>
            <SelectValue placeholder="Filter Kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Semua</SelectItem>
            {/* Fetch categories */}
          </SelectContent>
        </Select>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Tambah Buku</Button>
          </DialogTrigger>
          <DialogContent>{/* Form tambah buku */}</DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Judul</TableHead>
            <TableHead>Pengarang</TableHead>
            <TableHead>Kategori</TableHead>
            <TableHead>Stok</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {books.map((book) => (
            <TableRow key={book.id}>
              <TableCell>{book.title}</TableCell>
              <TableCell>{book.author}</TableCell>
              <TableCell>{book.category.name}</TableCell>
              <TableCell>
                {book.available}/{book.stock}
              </TableCell>
              <TableCell>
                <Button variant="outline" onClick={() => deleteBook(book.id)}>
                  Hapus
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
