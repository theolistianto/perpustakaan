"use client";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AdminBorrowRequests() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const fetchRequests = async () => {
    const res = await fetch("/api/borrow/requests");
    const data = await res.json();
    setRequests(data);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const decide = async (id: number, accept: boolean) => {
    setLoadingId(id);
    try {
      const res = await fetch(`/api/borrow/${id}/decision`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accept }),
      });
      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Gagal memproses");
      }
      await fetchRequests();
    } catch (err) {
      console.error(err);
      alert("Error jaringan");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Request Peminjaman</h2>
      {requests.length === 0 && <p>Tidak ada request baru.</p>}
      {requests.map((r) => (
        <Card key={r.id}>
          <CardHeader>
            <CardTitle>{r.book.title}</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div>
              <p>
                <strong>Anggota:</strong> {r.user.name}
              </p>
              <p>
                <strong>Pinjam:</strong>{" "}
                {new Date(r.borrowDate).toLocaleDateString()}
              </p>
              <p>
                <strong>Jatuh Tempo:</strong>{" "}
                {r.dueDate ? new Date(r.dueDate).toLocaleDateString() : "-"}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                className="bg-green-500"
                onClick={() => decide(r.id, true)}
                disabled={loadingId === r.id}
              >
                Terima
              </Button>
              <Button
                className="bg-red-500"
                onClick={() => decide(r.id, false)}
                disabled={loadingId === r.id}
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
