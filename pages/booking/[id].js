import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useRouter } from 'next/router';
import { useAuthStore } from '@/store';
import apiClient from '@/lib/api';
import toast from 'react-hot-toast';
import { ArrowLeft, Calendar, Clock, DollarSign } from 'lucide-react';

export default function BookingPage() {
  const router = useRouter();
  const { id: courtId } = router.query; // 🛠️ FIX: Membaca parameter dinamis Next.js '[id]' dengan benar
  const { isAuthenticated, user } = useAuthStore();
  const [court, setCourt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    booking_date: '',
    start_time: '',
    end_time: '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    if (courtId) {
      fetchCourt();
    }
  }, [courtId, isAuthenticated]);

  const fetchCourt = async () => {
    try {
      const response = await apiClient.get(`/courts/${courtId}`);
      setCourt(response.data.data);
    } catch (error) {
      toast.error('Gagal memuat data lapangan');
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const calculateTotal = () => {
    if (formData.start_time && formData.end_time && court) {
      const start = new Date(`2024-01-01 ${formData.start_time}`);
      const end = new Date(`2024-01-01 ${formData.end_time}`);
      const hours = (end - start) / (1000 * 60 * 60);
      return hours * court.price_per_hour;
    }
    return 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await apiClient.post('/user/bookings', {
        court_id: courtId,
        booking_date: formData.booking_date,
        start_time: formData.start_time,
        end_time: formData.end_time,
      });

      toast.success('Booking berhasil dibuat!');
      router.push('/user/bookings');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking gagal');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </div>
      </Layout>
    );
  }

  if (!court) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <p>Lapangan tidak ditemukan</p>
        </div>
      </Layout>
    );
  }

  const totalPrice = calculateTotal();

  return (
    <Layout>
      <div className="min-h-screen bg-light py-20 pt-20">
        <div className="max-w-4xl mx-auto px-4">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="flex items-center text-primary hover:text-opacity-80 mb-8 font-semibold"
          >
            <ArrowLeft size={20} className="mr-2" />
            Kembali
          </button>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column - Court Info */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
                <h3 className="text-2xl font-bold text-primary mb-4">{court.name}</h3>
                <p className="text-gray-600 mb-6">{court.description}</p>

                <div className="space-y-4 border-t border-b py-4 my-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Harga/Jam:</span>
                    <span className="font-bold text-primary">
                      Rp {parseInt(court.price_per_hour).toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Kapasitas:</span>
                    <span className="font-bold">{court.capacity} orang</span>
                  </div>
                </div>

                {formData.start_time && formData.end_time && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">Total Harga:</p>
                    <p className="text-3xl font-bold text-primary">
                      Rp {parseInt(totalPrice).toLocaleString('id-ID')}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Booking Form */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold mb-6">Form Booking</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Booking Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="inline-block mr-2" size={16} />
                      Tanggal Booking
                    </label>
                    <input
                      type="date"
                      name="booking_date"
                      value={formData.booking_date}
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                      required
                    />
                  </div>

                  {/* Time Range */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Clock className="inline-block mr-2" size={16} />
                        Jam Mulai
                      </label>
                      <input
                        type="time"
                        name="start_time"
                        value={formData.start_time}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Clock className="inline-block mr-2" size={16} />
                        Jam Selesai
                      </label>
                      <input
                        type="time"
                        name="end_time"
                        value={formData.end_time}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                        required
                      />
                    </div>
                  </div>

                  {/* Price Summary */}
                  {formData.start_time && formData.end_time && (
                    <div className="bg-light border-2 border-primary border-dashed p-4 rounded-lg">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Durasi:</span>
                        <span className="font-semibold">
                          {(() => {
                            const start = new Date(`2024-01-01 ${formData.start_time}`);
                            const end = new Date(`2024-01-01 ${formData.end_time}`);
                            const hours = (end - start) / (1000 * 60 * 60);
                            return `${hours} jam`;
                          })()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total:</span>
                        <span className="font-bold text-primary text-lg">
                          Rp {parseInt(totalPrice).toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Note */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Catatan (Opsional)
                    </label>
                    <textarea
                      placeholder="Tambahkan catatan khusus untuk booking Anda"
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={submitting || !formData.booking_date || !formData.start_time || !formData.end_time}
                    className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {submitting ? 'Memproses...' : 'Konfirmasi Booking'}
                  </button>
                </form>

                <p className="text-sm text-gray-500 mt-6 text-center">
                  Dengan melakukan booking, Anda setuju dengan syarat dan ketentuan kami.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}