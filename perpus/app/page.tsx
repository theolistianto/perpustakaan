"use client";

import { useRouter } from "next/navigation";
import { Search, BookOpen, Users, ArrowRight, Mail, MapPin, Phone, Facebook, Twitter, Instagram, Users2, Eye, Gift } from "lucide-react";
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
