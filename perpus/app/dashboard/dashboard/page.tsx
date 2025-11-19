"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { BookOpen, Users, Settings, TrendingUp } from "lucide-react";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // Decode token (gunakan js-cookie atau logic serupa)
    setUser({ role: "admin" }); // Placeholder
  }, []);

  const stats = [
    {
      icon: BookOpen,
      title: "Total Buku",
      value: "1,234",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Users,
      title: "Peminjaman Aktif",
      value: "567",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: TrendingUp,
      title: "Pengunjung Bulan Ini",
      value: "890",
      color: "from-purple-500 to-pink-500",
    },
  ];

  return (
    <div className="space-y-6">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
      >
        Dashboard
      </motion.h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-xl border-0 hover:shadow-2xl transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon
                  className={`h-8 w-8 bg-gradient-to-r ${stat.color} p-2 rounded-lg text-white`}
                />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-xl border-0">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="mr-2 h-6 w-6" />
              Kelola Buku
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => router.push("/books")}
              className="bg-white text-indigo-600 hover:bg-gray-100 font-semibold"
            >
              Lihat Buku
            </Button>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-xl border-0">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-6 w-6" />
              Sistem Peminjaman
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => router.push("/borrow")}
              className="bg-white text-green-600 hover:bg-gray-100 font-semibold"
            >
              Pinjam Buku
            </Button>
          </CardContent>
        </Card>
        {user?.role === "admin" && (
          <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-xl border-0 md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="mr-2 h-6 w-6" />
                Admin Panel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button className="bg-white text-purple-600 hover:bg-gray-100 font-semibold">
                Kelola Sistem
              </Button>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  );
}
