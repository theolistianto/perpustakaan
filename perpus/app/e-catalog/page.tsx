"use client";

import Link from "next/link";
import { BookOpen, MapPin, FileText, Info } from "lucide-react";
import Navbar from "@/components/ui/navbar";

export default function ECatalogPage() {
  const catalogItems = [
    {
      id: "book",
      label: "Book",
      href: "/e-catalog/book",
      icon: BookOpen,
    },
    {
      id: "cara-meminjam",
      label: "Cara Meminjam",
      href: "/e-catalog/cara-meminjam",
      icon: MapPin,
    },
    {
      id: "katalog",
      label: "Katalog",
      href: "/e-catalog/katalog",
      icon: FileText,
    },
    {
      id: "informasi",
      label: "Informasi",
      href: "/e-catalog/informasi",
      icon: Info,
    },
  ];

  return (
    <div>
      <Navbar />
      
      {/* Hero Section */}
      <section className="h-80 bg-gradient-to-r from-blue-600 to-blue-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="max-w-7xl mx-auto px-4 h-full flex flex-col justify-center items-center text-center relative z-10">
          <h1 className="text-5xl font-bold text-white mb-4">E - Katalog</h1>
          <h2 className="text-4xl font-bold text-white mb-6">Perpustakaan BPOM</h2>
          <p className="text-xl text-white/90">
            Akses untuk mengetahui informasi<br/>koleksi melalui katalog online
          </p>
        </div>
      </section>

      {/* Catalog Items */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {catalogItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.id} href={item.href}>
                  <div className="bg-white rounded-lg shadow-md p-8 text-center hover:shadow-lg transition cursor-pointer h-full flex flex-col items-center justify-center gap-4">
                    <Icon className="w-12 h-12 text-blue-600" />
                    <p className="text-gray-700 font-semibold">{item.label}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
