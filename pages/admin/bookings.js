import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuthStore } from '@/store';
import Layout from '@/components/Layout';
import apiClient from '@/lib/api';
import toast from 'react-hot-toast';
import { CheckCircle, XCircle } from 'lucide-react';

export default function AdminBookings() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    useAuthStore.getState().loadFromStorage();
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/auth/login');
    } else {
      fetchBookings();
    }
  }, [isAuthenticated, user, router]);

  const fetchBookings = async () => {
    try {
      const response = await apiClient.get('/admin/bookings');
      setBookings(response.data.data);
    } catch (error) {
      toast.error('Gagal memuat data booking');
    } finally {
      setLoading(false);
    }
  };

  // 🛠️ FIX 1: Fungsi untuk mengubah status booking (Approve/Reject)
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await apiClient.put(`/admin/bookings/${id}`, { status: newStatus });
      toast.success(`Booking berhasil diubah menjadi ${newStatus}`);
      fetchBookings(); // Muat ulang data setelah sukses mengubah status
    } catch (error) {
      toast.error('Gagal memperbarui status');
    }
  };

  // 🛠️ FIX 2: Fungsi untuk merapikan format tanggal
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (!isAuthenticated || user?.role !== 'admin') return null;

  return (
    <Layout>
      <div className="min-h-screen bg-light py-20 pt-20">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-dark mb-8">Kelola Booking</h1>

          <div className="bg-white rounded-lg shadow-lg overflow-x-auto">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-12 text-gray-500">Tidak ada booking</div>
            ) : (
              <table className="w-full">
                <thead className="bg-light border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">User</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Lapangan</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Tanggal</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Waktu</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Harga</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">{booking.user?.name}</td>
                      <td className="px-6 py-4">{booking.court?.name}</td>
                      <td className="px-6 py-4">{formatDate(booking.booking_date)}</td>
                      <td className="px-6 py-4">{booking.start_time} - {booking.end_time}</td>
                      {/* 🛠️ FIX 3: Menggunakan Math.abs agar tidak ada angka minus */}
                      <td className="px-6 py-4">Rp {Math.abs(parseInt(booking.total_price)).toLocaleString('id-ID')}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {booking.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {booking.status === 'pending' ? (
                          <div className="flex justify-center gap-2">
                            <button 
                              onClick={() => handleUpdateStatus(booking.id, 'confirmed')}
                              className="text-green-600 hover:bg-green-100 p-2 rounded-lg transition-colors flex items-center"
                              title="Setujui"
                            >
                              <CheckCircle size={20} />
                            </button>
                            <button 
                              onClick={() => handleUpdateStatus(booking.id, 'cancelled')}
                              className="text-red-600 hover:bg-red-100 p-2 rounded-lg transition-colors flex items-center"
                              title="Tolak"
                            >
                              <XCircle size={20} />
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}