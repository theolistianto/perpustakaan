"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type BorrowRequest = {
  id: number;
  user: { id: number; name: string };
  book: { id: number; title: string };
  borrowDate: string;
  returnDate: string | null;
};

export default function AdminBorrowRequests() {
  const [requests, setRequests] = useState<BorrowRequest[]>([]);
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const fetchRequests = async () => {
    const res = await fetch("/api/borrow/requests");
    const data = await res.json();
    setRequests(data);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleDecision = async (id: number, accept: boolean) => {
    setLoadingId(id);
    try {
      await fetch(`/api/borrow/${id}/decision`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accept }),
      });
      fetchRequests(); // refresh list
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold text-blue-600">Request Peminjaman</h1>
      {requests.length === 0 && <p>Tidak ada request baru.</p>}
      {requests.map((req) => (
        <Card key={req.id} className="bg-white/90 shadow-md">
          <CardHeader>
            <CardTitle>{req.book.title}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <p>Anggota: {req.user.name}</p>
              <p>Pinjam: {new Date(req.borrowDate).toLocaleDateString()}</p>
              <p>Kembali: {req.returnDate ? new Date(req.returnDate).toLocaleDateString() : "-"}</p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => handleDecision(req.id, true)}
                disabled={loadingId === req.id}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                Terima
              </Button>
              <Button
                onClick={() => handleDecision(req.id, false)}
                disabled={loadingId === req.id}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                Tolak
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
