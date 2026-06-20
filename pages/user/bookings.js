import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuthStore } from '@/store';
import Layout from '@/components/Layout';
import apiClient from '@/lib/api';
import toast from 'react-hot-toast';
import { Trash2, Clock, DollarSign, Calendar, CheckCircle } from 'lucide-react';

export default function UserBookings() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token && !isAuthenticated) {
      router.push('/auth/login');
    } else {
      fetchBookings();
    }
  }, [isAuthenticated, router]);

  const fetchBookings = async () => {
    try {
      const response = await apiClient.get('/user/bookings');
      setBookings(response.data.data);
    } catch (error) {
      toast.error('Gagal memuat booking');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    if (!confirm('Yakin ingin membatalkan booking ini?')) return;
    try {
      await apiClient.post(`/user/bookings/${bookingId}/cancel`);
      toast.success('Booking berhasil dibatalkan');
      fetchBookings();
    } catch (error) {
      toast.error('Gagal membatalkan booking');
    }
  };

  // 🛠️ FUNGSI BARU: Mengirim file gambar ke Backend
  const handleUploadProof = async (bookingId, file) => {
    if (!file) return;

    const toastId = toast.loading('Mengunggah bukti pembayaran...');
    const formData = new FormData();
    formData.append('payment_proof', file);

    try {
      await apiClient.post(`/user/bookings/${bookingId}/upload-proof`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Bukti pembayaran berhasil diunggah!', { id: toastId });
      fetchBookings(); // Muat ulang data untuk menyembunyikan tombol upload
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal mengunggah bukti', { id: toastId });
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (!isAuthenticated) return null;

  return (
    <Layout>
      <div className="min-h-screen bg-light py-20 pt-20">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-dark mb-8">Pesanan Saya</h1>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            </div>
          ) : bookings.length === 0 ? (
            <div className="bg-white rounded-lg p-8 text-center">
              <p className="text-gray-500 mb-4">Anda belum memiliki pesanan</p>
              <a href="/#courts" className="inline-block bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-opacity-90 transition-all">
                Booking Lapangan Sekarang
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {bookings.map((booking) => (
                <div key={booking.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="p-6">
                    <div className="mb-4 pb-4 border-b flex justify-between items-start">
                      <div>
                        <h2 className="text-2xl font-bold text-primary">{booking.court?.name}</h2>
                        <p className="text-sm text-gray-600 mt-1">{booking.court?.description}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {booking.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-start">
                        <Calendar size={18} className="mr-3 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-600">Tanggal Booking</p>
                          <p className="font-semibold">{formatDate(booking.booking_date)}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Clock size={18} className="mr-3 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-600">Waktu</p>
                          <p className="font-semibold">{booking.start_time} - {booking.end_time}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <DollarSign size={18} className="mr-3 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-600">Total Harga</p>
                          <p className="font-semibold text-lg text-primary">Rp {Math.abs(parseInt(booking.total_price)).toLocaleString('id-ID')}</p>
                        </div>
                      </div>
                    </div>

                    {/* 🛠️ AREA PEMBAYARAN KHUSUS UNTUK STATUS PENDING */}
                    {booking.status === 'pending' && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        {!booking.payment_proof ? (
                          <>
                            <div className="bg-blue-50 p-4 rounded-lg mb-4">
                              <p className="text-sm font-bold text-blue-800 mb-1">💳 Informasi Pembayaran</p>
                              <p className="text-sm text-blue-800">Transfer ke: <strong>BCA 1234567890</strong> (a.n Cahaya Futsal)</p>
                              <p className="text-sm text-blue-800">Sebesar: <strong>Rp {Math.abs(parseInt(booking.total_price)).toLocaleString('id-ID')}</strong></p>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                              <div className="w-full">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Bukti Transfer</label>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleUploadProof(booking.id, e.target.files[0])}
                                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-opacity-90 cursor-pointer"
                                />
                              </div>
                              <button
                                onClick={() => handleCancel(booking.id)}
                                className="text-red-500 hover:bg-red-100 px-4 py-2 rounded-lg transition-colors flex items-center justify-center min-w-[120px] h-fit mt-5"
                              >
                                <Trash2 size={18} className="mr-1" />
                                Batalkan
                              </button>
                            </div>
                          </>
                        ) : (
                          <div className="bg-green-50 text-green-800 px-4 py-3 rounded-lg flex items-center">
                            <CheckCircle size={20} className="mr-2 flex-shrink-0" />
                            <span className="text-sm font-medium">Bukti terkirim. Menunggu konfirmasi Admin.</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}