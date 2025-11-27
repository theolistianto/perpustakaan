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
      
      {/* Hero Section with Background Image */}
      <section className="py-4 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-contain bg-center bg-no-repeat rounded-3xl" style={{ backgroundImage: "url('/e-catalog-hero.png')", paddingBottom: "55%" }}></div>
        </div>
      </section>

      {/* Catalog Items */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
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
