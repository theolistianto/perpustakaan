"use client";

import { useRouter } from "next/navigation";
import { Search, BookOpen, Users, ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import Navbar from "@/components/ui/navbar";

export default function LandingPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push("/dashboard/books?search=" + encodeURIComponent(searchQuery));
    }
  };

  return (
    <div>
      <Navbar />
      
      <section className="h-96 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 h-full flex flex-col justify-center">
          <h1 className="text-5xl font-bold text-white mb-4">Perpus System</h1>
          <p className="text-xl text-white/90 mb-8">Sistem Manajemen Perpustakaan Modern</p>
          
          <form onSubmit={handleSearch} className="max-w-2xl">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari buku..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
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

      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-bold mb-4">Perpus System</h3>
              <p className="text-gray-400">Platform manajemen perpustakaan modern</p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Tautan</h3>
              <ul className="text-gray-400 space-y-2">
                <li><a href="/" className="hover:text-white">Beranda</a></li>
                <li><a href="/dashboard/books" className="hover:text-white">Katalog</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Hubungi</h3>
              <div className="text-gray-400 space-y-2">
                <div className="flex gap-2"><MapPin className="w-5 h-5" /><span>Jakarta</span></div>
                <div className="flex gap-2"><Phone className="w-5 h-5" /><span>(021) 123456</span></div>
                <div className="flex gap-2"><Mail className="w-5 h-5" /><span>info@perpus.id</span></div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8">
            <p className="text-gray-400">© 2025 Perpus System. All Rights Reserved.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
