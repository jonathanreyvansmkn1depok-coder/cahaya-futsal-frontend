import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuthStore } from '@/store';
import Layout from '@/components/Layout';
import { LayoutDashboard, Users, Calendar, MessageSquare, LogOut } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuthStore();

  useEffect(() => {
    useAuthStore.getState().loadFromStorage();
  }, []);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/auth/login');
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  const handleLogout = () => {
    logout();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  const menuItems = [
    {
      title: 'Kelola Lapangan',
      icon: <LayoutDashboard size={24} />,
      href: '/admin/courts',
      color: 'bg-blue-500',
    },
    {
      title: 'Kelola Booking',
      icon: <Calendar size={24} />,
      href: '/admin/bookings',
      color: 'bg-green-500',
    },
    {
      title: 'Kelola User',
      icon: <Users size={24} />,
      href: '/admin/users',
      color: 'bg-purple-500',
    },
    {
      title: 'Pesan Masuk',
      icon: <MessageSquare size={24} />,
      href: '/admin/messages',
      color: 'bg-yellow-500',
    },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-light py-20 pt-20">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="flex justify-between items-center mb-12">
            <div>
              <h1 className="text-4xl font-bold text-dark mb-2">Dashboard Admin</h1>
              <p className="text-gray-600">Selamat datang, {user?.name}!</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-all"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>

          {/* Menu Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {menuItems.map((item, idx) => (
              <Link key={idx} href={item.href} legacyBehavior>
                <a className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-all transform hover:-translate-y-1 cursor-pointer">
                  <div className={`${item.color} text-white w-16 h-16 rounded-lg flex items-center justify-center mb-4`}>
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-dark">{item.title}</h3>
                  <p className="text-gray-600 text-sm mt-2">Kelola dan atur {item.title.toLowerCase()}</p>
                </a>
              </Link>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
            {[
              { label: 'Total Lapangan', value: '4', icon: '🏟️' },
              { label: 'Total Booking', value: '24', icon: '📅' },
              { label: 'Total User', value: '50', icon: '👥' },
              { label: 'Pesan Baru', value: '3', icon: '💬' },
            ].map((stat, idx) => (
              <div key={idx} className="bg-white rounded-lg p-6 shadow-md">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <p className="text-gray-600 text-sm">{stat.label}</p>
                <p className="text-3xl font-bold text-primary">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}