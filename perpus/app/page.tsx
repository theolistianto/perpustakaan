"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BookOpen, Users, Search, Users2, Eye, Gift, Mail, MapPin, Phone, Facebook, Twitter, Instagram, ArrowRight } from "lucide-react";

interface Book {
  id: number;
  title: string;
  author: string;
  image?: string;
  stock: number;
}

export default function LandingPage() {
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [loadingBooks, setLoadingBooks] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch("/api/books");
        if (res.ok) {
          const data = await res.json();
          setBooks(data.slice(0, 4));
        }
      } catch (error) {
        console.error("Failed to fetch books:", error);
      } finally {
        setLoadingBooks(false);
      }
    };
    fetchBooks();
  }, []);


  return (
    <div>
      <section className="h-96 bg-cover bg-center relative" style={{ backgroundImage: "url('/library-hero.png')" }}>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="max-w-7xl mx-auto px-4 h-full flex flex-col justify-center relative z-10">
          <h1 className="text-5xl font-bold text-white mb-4">Perpus System</h1>
          <p className="text-xl text-white/90 mb-8">Sistem Manajemen Perpustakaan Modern</p>
          
          <form onSubmit={(e) => {
            e.preventDefault();
            const query = (e.target as HTMLFormElement).querySelector('input')?.value;
            if (query?.trim()) {
              router.push("/dashboard/books?search=" + encodeURIComponent(query));
            }
          }} className="max-w-2xl">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari buku..."
                  className="w-full pl-12 pr-4 py-3 rounded-lg"
                />
              </div>
              <button type="submit" className="px-8 py-3 bg-pink-600 text-white rounded-lg font-semibold">
                Cari
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12">Tentang Kami</h2>
          <p className="text-lg text-gray-600 mb-4">
            Perpus System adalah platform manajemen perpustakaan modern yang dirancang untuk memudahkan pengelolaan koleksi buku.
          </p>
          <button
            onClick={() => router.push("/dashboard/books")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold flex items-center gap-2"
          >
            Jelajahi Katalog <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Koleksi Terbaru Kami</h2>
          {loadingBooks ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Memuat buku...</p>
            </div>
          ) : (
            <>
              <div className="hidden md:grid grid-cols-4 gap-6 mb-8">
                {books.map((book) => (
                  <div key={book.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition">
                    <div className="bg-gray-200 h-48 flex items-center justify-center overflow-hidden">
                      {book.image ? (
                        <img src={book.image} alt={book.title} className="w-full h-full object-cover" />
                      ) : (
                        <BookOpen className="w-12 h-12 text-gray-400" />
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">{book.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{book.author}</p>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Stok: {book.stock}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="md:hidden overflow-x-auto pb-4 mb-8 -mx-4 px-4">
                <div className="flex gap-6" style={{ width: 'max-content' }}>
                  {books.map((book) => (
                    <div key={book.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition flex-shrink-0" style={{ width: '200px' }}>
                      <div className="bg-gray-200 h-48 flex items-center justify-center overflow-hidden">
                        {book.image ? (
                          <img src={book.image} alt={book.title} className="w-full h-full object-cover" />
                        ) : (
                          <BookOpen className="w-12 h-12 text-gray-400" />
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2 text-sm">{book.title}</h3>
                        <p className="text-xs text-gray-600 mb-3">{book.author}</p>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Stok: {book.stock}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-center">
                <button
                  onClick={() => router.push("/dashboard/books")}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
                >
                  Lihat Selengkapnya
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12">Layanan</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow">
              <BookOpen className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">Katalog Digital</h3>
              <p className="text-gray-600">Jelajahi ribuan koleksi buku digital</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow">
              <Users className="w-8 h-8 text-purple-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">Manajemen Peminjaman</h3>
              <p className="text-gray-600">Kelola peminjaman dengan mudah</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow">
              <Search className="w-8 h-8 text-pink-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">Pencarian Cepat</h3>
              <p className="text-gray-600">Temukan buku dalam sekejap</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <Users2 className="w-12 h-12 text-pink-600 mx-auto mb-3" />
              <p className="text-4xl font-bold text-pink-600">1.271</p>
              <p className="text-gray-600 mt-2">Anggota Perpustakaan</p>
            </div>
            <div className="text-center">
              <BookOpen className="w-12 h-12 text-pink-600 mx-auto mb-3" />
              <p className="text-4xl font-bold text-pink-600">15.052+</p>
              <p className="text-gray-600 mt-2">Koleksi Buku</p>
            </div>
            <div className="text-center">
              <Eye className="w-12 h-12 text-pink-600 mx-auto mb-3" />
              <p className="text-4xl font-bold text-pink-600">137+</p>
              <p className="text-gray-600 mt-2">Pengunjung</p>
            </div>
            <div className="text-center">
              <Gift className="w-12 h-12 text-pink-600 mx-auto mb-3" />
              <p className="text-4xl font-bold text-pink-600">14.978+</p>
              <p className="text-gray-600 mt-2">Peminjaman</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-4">Perpus<span className="text-pink-600">System</span></h2>
              <p className="text-gray-400 leading-relaxed">
                Perpustakaan DPR RI hadir sebagai pusat literasi dan sumber pengetahuan untuk masyarakat, menyediakan akses koleksi, informasi, dan layanan yang mendukung pengembangan wawasan serta peningkatan literasi bangsa.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-6">Kontak Kami</h3>
              <div className="space-y-4 text-gray-400">
                <div className="flex gap-3">
                  <MapPin className="w-5 h-5 text-pink-600 flex-shrink-0 mt-1" />
                  <span>Jl. Jenderal Gatot Subroto, Senayan Jakarta 10270 - Indonesia</span>
                </div>
                <div className="flex gap-3">
                  <Phone className="w-5 h-5 text-pink-600 flex-shrink-0 mt-1" />
                  <span>Telp: (021) 5756010, 5756011</span>
                </div>
                <div className="flex gap-3">
                  <Mail className="w-5 h-5 text-pink-600 flex-shrink-0 mt-1" />
                  <span>Email: perpustakaandpr@dpr.go.id</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex justify-between items-center">
            <p className="text-gray-400">© 2025 Perpus System. All Rights Reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
