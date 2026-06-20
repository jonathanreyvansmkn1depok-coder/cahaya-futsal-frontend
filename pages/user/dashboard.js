import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuthStore } from '@/store';
import Layout from '@/components/Layout';
import apiClient from '@/lib/api';
import toast from 'react-hot-toast';
import { Calendar, MapPin, DollarSign, Clock } from 'lucide-react';

export default function UserDashboard() {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    useAuthStore.getState().loadFromStorage();
    if (!isAuthenticated || user?.role !== 'user') {
      router.push('/auth/login');
    } else {
      fetchBookings();
    }
  }, [isAuthenticated, user, router]);

  const fetchBookings = async () => {
    try {
      const response = await apiClient.get('/user/bookings/upcoming');
      setUpcomingBookings(response.data.data);
    } catch (error) {
      toast.error('Gagal memuat booking');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  if (!isAuthenticated || user?.role !== 'user') return null;

  return (
    <Layout>
      <div className="min-h-screen bg-light py-20 pt-20">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="flex justify-between items-center mb-12">
            <div>
              <h1 className="text-4xl font-bold text-dark mb-2">Dashboard User</h1>
              <p className="text-gray-600">Selamat datang, {user?.name}!</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-all"
            >
              Logout
            </button>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <a href="/#courts" className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-2">🏟️</div>
              <h3 className="font-bold mb-1">Booking Lapangan</h3>
              <p className="text-sm text-gray-600">Pesan lapangan favorit Anda</p>
            </a>
            <a href="/user/bookings" className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-2">📅</div>
              <h3 className="font-bold mb-1">Pesanan Saya</h3>
              <p className="text-sm text-gray-600">Lihat semua pesanan Anda</p>
            </a>
            <a href="/user/profile" className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-2">👤</div>
              <h3 className="font-bold mb-1">Profil Saya</h3>
              <p className="text-sm text-gray-600">Kelola informasi akun Anda</p>
            </a>
          </div>

          {/* Upcoming Bookings */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Pesanan Mendatang</h2>
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
              </div>
            ) : upcomingBookings.length === 0 ? (
              <div className="bg-white rounded-lg p-8 text-center">
                <p className="text-gray-500 mb-4">Anda belum memiliki pesanan</p>
                <a href="/#courts" className="inline-block bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-opacity-90 transition-all">
                  Booking Lapangan Sekarang
                </a>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingBookings.map((booking) => (
                  <div key={booking.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                    <div className="mb-4">
                      <h3 className="text-lg font-bold text-primary">{booking.court?.name}</h3>
                      <p className="text-sm text-gray-600">{booking.court?.description}</p>
                    </div>

                    <div className="space-y-2 mb-4 pb-4 border-b">
                      <div className="flex items-center text-sm">
                        <Calendar size={16} className="mr-2 text-primary" />
                        <span>{booking.booking_date}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Clock size={16} className="mr-2 text-primary" />
                        <span>{booking.start_time} - {booking.end_time}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <DollarSign size={16} className="mr-2 text-primary" />
                        <span>Rp {parseInt(booking.total_price).toLocaleString('id-ID')}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {booking.status}
                      </span>
                      <a href={`/booking/${booking.court_id}`} className="text-primary font-semibold hover:underline">
                        Detail
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
