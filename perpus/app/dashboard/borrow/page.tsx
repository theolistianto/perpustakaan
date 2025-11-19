'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { motion } from 'framer-motion';
import { BookOpen, Calendar, CheckCircle } from 'lucide-react';

export default function BorrowPage() {
  const [bookId, setBookId] = useState('');
  const [isBorrowing, setIsBorrowing] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleBorrow = async () => {
    setIsBorrowing(true);
    try {
      const res = await fetch('/api/borrow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookId: parseInt(bookId) }),
      });
      if (res.ok) {
        setSuccess(true);
        setBookId('');
      } else {
        alert('Gagal meminjam buku');
      }
    } catch (error) {
      alert('Terjadi kesalahan');
    } finally {
      setIsBorrowing(false);
    }
  };

  return (
    <div className="space-y-6">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
      >
        Sistem Peminjaman Buku
      </motion.h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-xl border-0">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <BookOpen className="mr-2 h-8 w-8 text-indigo-600" />
                Pinjam Buku
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <BookOpen className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Masukkan ID Buku"
                  value={bookId}
                  onChange={(e) => setBookId(e.target.value)}
                  className="pl-10"
                  type="number"
                />
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    disabled={!bookId || isBorrowing}
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-3 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105"
                  >
                    {isBorrowing ? 'Memproses...' : 'Pinjam Buku'}
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center">
                      <Calendar className="mr-2 h-6 w-6 text-indigo-600" />
                      Konfirmasi Peminjaman
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p>Apakah Anda yakin ingin meminjam buku dengan ID {bookId}?</p>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setBookId('')}>Batal</Button>
                      <Button onClick={handleBorrow} disabled={isBorrowing}>
                        {isBorrowing ? 'Memproses...' : 'Ya, Pinjam'}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-green-400 to-blue-500 text-white shadow-xl border-0">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <CheckCircle className="mr-2 h-8 w-8" />
                Status Peminjaman
              </CardTitle>
            </CardHeader>
            <CardContent>
              {success ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-center"
                >
                  <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-300" />
                  <p className="text-lg font-semibold">Buku berhasil dipinjam!</p>
                  <p className="text-sm opacity-80">Silakan ambil buku di rak yang sesuai.</p>
                </motion.div>
              ) : (
                <p className="text-lg">Belum ada peminjaman aktif.</p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}