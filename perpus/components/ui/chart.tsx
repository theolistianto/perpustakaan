"use client";

import * as React from "react";
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Data dummy sampai 2024-06-30
const chartData = [
  { date: "2023-07-01", pengunjung: 200, peminjam: 50 },
  { date: "2023-08-01", pengunjung: 180, peminjam: 40 },
  { date: "2023-09-01", pengunjung: 250, peminjam: 60 },
  { date: "2023-10-01", pengunjung: 300, peminjam: 80 },
  { date: "2023-11-01", pengunjung: 220, peminjam: 55 },
  { date: "2023-12-01", pengunjung: 190, peminjam: 45 },
  { date: "2024-01-01", pengunjung: 270, peminjam: 70 },
  { date: "2024-02-01", pengunjung: 310, peminjam: 90 },
  { date: "2024-03-01", pengunjung: 260, peminjam: 60 },
  { date: "2024-04-01", pengunjung: 280, peminjam: 75 },
  { date: "2024-05-01", pengunjung: 300, peminjam: 80 },
  { date: "2024-06-01", pengunjung: 320, peminjam: 100 },
  { date: "2024-06-25", pengunjung: 350, peminjam: 120 },
  { date: "2024-06-28", pengunjung: 380, peminjam: 140 },
  { date: "2024-06-30", pengunjung: 400, peminjam: 150 },
];

export default function ChartAreaInteractive() {
  const [timeRange, setTimeRange] = React.useState<"7d" | "1y">("1y");

  const filteredData = React.useMemo(() => {
    const referenceDate = new Date("2024-06-30"); // pakai tanggal terakhir data
    let startDate = new Date(referenceDate);

    if (timeRange === "7d") {
      startDate.setDate(referenceDate.getDate() - 7);
    } else if (timeRange === "1y") {
      startDate.setFullYear(referenceDate.getFullYear() - 1);
    }

    return chartData.filter((item) => {
      const date = new Date(item.date);
      return date >= startDate && date <= referenceDate;
    });
  }, [timeRange]);

  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Statistic Pengunjung & Peminjam</CardTitle>
          <CardDescription>
            Menampilkan total pengunjung dan peminjam selama periode terakhir
          </CardDescription>
        </div>
        <Select
          value={timeRange}
          onValueChange={(val) => setTimeRange(val as "7d" | "1y")}
        >
          <SelectTrigger className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex">
            <SelectValue placeholder="1 Tahun" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="1y" className="rounded-lg">
              1 minggu Terakhir
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              1 Tahun Terakhir
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={filteredData}
              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
            >
              <defs>
                <linearGradient id="fillPengunjung" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="fillPeminjam" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={20}
                tickFormatter={(value) =>
                  new Date(value).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }
              />
              <YAxis />
              <Tooltip
                formatter={(value: number, name: string) => [
                  value,
                  name === "pengunjung" ? "Pengunjung" : "Peminjam",
                ]}
                labelFormatter={(label) =>
                  new Date(label).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }
              />
              <Legend
                formatter={(value) =>
                  value === "pengunjung" ? "Pengunjung" : "Peminjam"
                }
              />
              <Area
                type="natural"
                dataKey="pengunjung"
                stroke="#8884d8"
                fill="url(#fillPengunjung)"
                stackId="a"
              />
              <Area
                type="natural"
                dataKey="peminjam"
                stroke="#82ca9d"
                fill="url(#fillPeminjam)"
                stackId="a"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
