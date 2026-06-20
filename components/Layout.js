import React from 'react';
import Navbar from '@/components/Navbar';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-light">
      <Navbar />
      <main className="pt-16">
        {children}
      </main>
      <footer className="bg-dark text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold mb-4">Cahaya Futsal</h3>
              <p className="text-gray-400 text-sm">
                Tempat booking futsal terbaik dengan fasilitas lengkap dan harga terjangkau.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Menu</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/" className="hover:text-white">Beranda</a></li>
                <li><a href="/#courts" className="hover:text-white">Lapangan</a></li>
                <li><a href="/contact" className="hover:text-white">Kontak</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Layanan</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Booking Online</a></li>
                <li><a href="#" className="hover:text-white">Pembayaran</a></li>
                <li><a href="#" className="hover:text-white">Review</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Hubungi Kami</h4>
              <p className="text-gray-400 text-sm mb-2">📍 Depok, Jawa Barat</p>
              <p className="text-gray-400 text-sm mb-2">📞 089526067381</p>
              <p className="text-gray-400 text-sm">📧 info@cahayafutsal.com</p>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2026 Cahaya Futsal. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
