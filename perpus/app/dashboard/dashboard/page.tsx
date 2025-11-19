"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { BookOpen, Users, Settings, TrendingUp } from "lucide-react";
import Link from "next/link";
import ChartDashboard from "@/components/ui/chart";

// Import chart yang sudah dibuat sebelumnya

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
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
      {/* Statistik utama */}
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

      {/* Chart Pengunjung & Peminjam */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <ChartDashboard />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-xl border-0 hover:shadow-2xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="mr-2 h-6 w-6" />
              Kelola Buku
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => router.push("/books")}
              className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-xl border-0"
            >
              Lihat Buku
            </Button>
          </CardContent>
        </Card>
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-xl border-0 hover:shadow-2xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-6 w-6" />
              Sistem Peminjaman
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => router.push("/borrow")}
              className="bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-xl border-0"
            >
              Pinjam Buku
            </Button>
          </CardContent>
        </Card>

        {user?.role === "admin" && (
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-xl border-0 hover:shadow-2xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="mr-2 h-6 w-6" />
                Admin Panel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Link href="">
                <Button className="bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-xl border-0 md:col-span-2">
                  Kelola Sistem
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  );
}
