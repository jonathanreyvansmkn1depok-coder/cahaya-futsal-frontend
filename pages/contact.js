import React, { useState } from 'react';
import Layout from '@/components/Layout';
import apiClient from '@/lib/api';
import toast from 'react-hot-toast';
import { MapPin, Phone, Mail, Send, LogIn, MessageCircle } from 'lucide-react';
import { useAuthStore } from '@/store';
import Link from 'next/link';

export default function ContactPage() {
  const { isAuthenticated, user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    subject: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error('Anda harus login terlebih dahulu untuk mengirim pesan.');
      return;
    }

    setLoading(true);
    try {
      await apiClient.post('/contact', formData);
      toast.success('Pesan Anda telah terkirim! Kami akan segera meresponnya.');
      setFormData({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        subject: '',
        message: '',
      });
    } catch (error) {
      const errors = error.response?.data?.errors;
      if (errors) {
        Object.values(errors).flat().forEach((msg) => toast.error(msg));
      } else {
        toast.error(error.response?.data?.message || 'Gagal mengirim pesan. Silakan coba lagi.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-green-600 text-white py-20 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Hubungi Kami</h1>
          <p className="text-lg text-green-100">Punya pertanyaan? Kami siap membantu Anda</p>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="py-16 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-lg p-8 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center mb-4">
                <MapPin className="text-primary" size={32} />
              </div>
              <h3 className="text-xl font-bold text-center mb-2">Alamat</h3>
              <p className="text-center text-gray-600">
                JR5C+M3R Gedung Parkir Cahaya Bersaudara, Jl. Baru Plenongan, Depok, Kec. Pancoran Mas, Kota Depok, Jawa Barat 16431
              </p>
              <div className="mt-4 text-center">
                <a
                  href="https://maps.app.goo.gl/hAxzrcv7vadA3Boy9?g_st=ac"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-opacity-90 transition-all"
                >
                  Lihat di Maps
                </a>
              </div>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center mb-4">
                <Phone className="text-primary" size={32} />
              </div>
              <h3 className="text-xl font-bold text-center mb-2">Telepon</h3>
              <p className="text-center text-gray-600 text-lg font-semibold">089526067381</p>
              <p className="text-center text-gray-500 text-sm mt-4">
                Tersedia Senin - Minggu<br />08:00 - 22:00
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center mb-4">
                <Mail className="text-primary" size={32} />
              </div>
              <h3 className="text-xl font-bold text-center mb-2">Email</h3>
              <p className="text-center text-gray-600 text-lg font-semibold break-all">
                info@cahayafutsal.com
              </p>
              <p className="text-center text-gray-500 text-sm mt-4">
                Respons dalam<br />24 jam kerja
              </p>
            </div>
          </div>

          {/* Map */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">Lokasi Kami</h2>
            <div className="w-full h-96 rounded-lg overflow-hidden shadow-lg">
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0 }}
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.2428769146023!2d106.78957!3d-6.378289!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69ebd0e0e0e0e1%3A0x12345678901234!2sJl.%20Baru%20Plenongan%2C%20Depok!5e0!3m2!1sid!2sid!4v1234567890"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8 text-center">Kirim Pesan Kepada Kami</h2>

          {/* Gate: tampilkan form + tombol live chat jika sudah login, atau prompt login jika belum */}
          {!isAuthenticated ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-10 text-center shadow-md">
              <LogIn size={48} className="mx-auto text-yellow-500 mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Login Diperlukan</h3>
              <p className="text-gray-600 mb-6">
                Anda harus login terlebih dahulu agar pesan Anda bisa kami balas dan terhubung ke akun Anda.
              </p>
              <div className="flex gap-4 justify-center">
                <Link href="/auth/login" className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-opacity-90 transition-all">
                  Masuk
                </Link>
                <Link href="/auth/register" className="border border-primary text-primary px-6 py-2 rounded-lg font-semibold hover:bg-primary hover:text-white transition-all">
                  Daftar
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Tombol Live Chat */}
              <div className="mb-6 p-5 bg-primary/5 border border-primary/20 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-gray-800">Ingin chat langsung dengan Admin?</h3>
                  <p className="text-sm text-gray-500">Gunakan fitur Live Support untuk obrolan real-time dengan tim kami.</p>
                </div>
                <Link
                  href="/user/messages"
                  className="flex-shrink-0 flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-opacity-90 transition-all"
                >
                  <MessageCircle size={18} />
                  Buka Live Chat
                </Link>
              </div>
            <form onSubmit={handleSubmit} className="bg-light rounded-lg p-8 shadow-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Nama Anda"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email Anda"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition bg-gray-50"
                    required
                    readOnly
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Nomor Telepon</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Nomor telepon Anda"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Subjek</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Subjek pesan Anda"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Pesan</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tulis pesan Anda di sini"
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <Send size={20} className="mr-2" />
                {loading ? 'Mengirim...' : 'Kirim Pesan'}
              </button>
            </form>
            </>
          )}
        </div>
      </section>

      {/* Operating Hours */}
      <section className="py-16 bg-light">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8 text-center">Jam Operasional</h2>
          <div className="bg-white rounded-lg p-8 shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-bold text-primary mb-4">Hari Kerja</h3>
                <ul className="space-y-3">
                  <li className="flex justify-between">
                    <span>Senin - Kamis</span>
                    <span className="font-semibold">08:00 - 22:00</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Jumat</span>
                    <span className="font-semibold">08:00 - 22:00</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-bold text-primary mb-4">Akhir Pekan</h3>
                <ul className="space-y-3">
                  <li className="flex justify-between">
                    <span>Sabtu</span>
                    <span className="font-semibold">08:00 - 22:00</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Minggu</span>
                    <span className="font-semibold">08:00 - 22:00</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-secondary rounded">
              <p className="text-sm text-gray-700">
                <strong>Catatan:</strong> Untuk informasi terbaru jam operasional, silakan hubungi kami langsung.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
