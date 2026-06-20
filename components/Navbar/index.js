import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuthStore } from '@/store';
import { Menu, X, LogOut, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();

  const isHomePage = router.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const isSolid = !isHomePage || isScrolled;

  const navBg = isSolid ? 'bg-white shadow-[0_10px_30px_rgba(0,0,0,0.1)] translate-y-0' : 'bg-transparent py-2';
  const textMenu = isSolid ? 'text-slate-700 hover:text-emerald-600' : 'text-slate-100 hover:text-yellow-400';
  const textBrandCahaya = isSolid ? 'text-emerald-800' : 'text-white';
  const textBrandFutsal = isSolid ? 'text-amber-500' : 'text-yellow-400';
  const btnDashboardBg = isSolid ? 'bg-emerald-600 text-white shadow-emerald-200' : 'bg-white/10 text-white backdrop-blur-md border border-white/20 hover:bg-white/20';

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ease-in-out top-0 ${navBg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* BRAND LOGO */}
          <Link href="/" className="flex items-center space-x-3 group cursor-pointer">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 transform group-hover:rotate-12 ${isSolid ? 'bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-lg' : 'bg-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.5)]'}`}>
              <span className={`font-black text-2xl ${isSolid ? 'text-white' : 'text-emerald-950'}`}>C</span>
            </div>
            <div className="flex flex-col">
              <span className={`font-extrabold text-2xl tracking-tight leading-none transition-colors duration-300 ${textBrandCahaya}`}>
                Cahaya<span className={textBrandFutsal}>Futsal</span>
              </span>
              <span className={`text-[10px] font-bold tracking-widest uppercase transition-colors duration-300 ${isSolid ? 'text-slate-400' : 'text-white/60'}`}>Premium Arena</span>
            </div>
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center space-x-1">
            <Link href="/" className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${textMenu}`}>Beranda</Link>
            <Link href="/#courts" className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${textMenu}`}>Lapangan</Link>
            <Link href="/#how-it-works" className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${textMenu}`}>Cara Booking</Link>
            <Link href="/contact" className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${textMenu}`}>Kontak</Link>

            <div className="w-px h-8 bg-gray-300/30 mx-4"></div>

            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className="flex flex-col items-end mr-2">
                  <span className={`text-xs font-bold ${isSolid ? 'text-slate-400' : 'text-white/60'}`}>Selamat datang,</span>
                  <span className={`text-sm font-extrabold truncate max-w-[120px] ${isSolid ? 'text-emerald-800' : 'text-white'}`}>{user?.name}</span>
                </div>
                
                {/* Dropdown Menu */}
                <div className="relative group">
                  <button className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl transition-all duration-300 shadow-lg ${btnDashboardBg}`}>
                    <LayoutDashboard size={18} />
                    <span className="font-bold">Menu Akun</span>
                  </button>
                  
                  {/* Hover Bridge */}
                  <div className="absolute right-0 top-full w-64 pt-4 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto z-50 transform translate-y-2 group-hover:translate-y-0">
                    <div className="bg-white rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden">
                      <div className="p-4 bg-slate-50 border-b border-slate-100">
                        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Akses Cepat</p>
                      </div>
                      <div className="py-2">
                        {user?.role === 'admin' ? (
                          <>
                            <Link href="/admin/dashboard" className="block px-6 py-2.5 text-sm font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors">📊 Dashboard Admin</Link>
                            <Link href="/admin/courts" className="block px-6 py-2.5 text-sm font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors">🏟️ Kelola Lapangan</Link>
                            <Link href="/admin/bookings" className="block px-6 py-2.5 text-sm font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors">📅 Kelola Booking</Link>
                            <Link href="/admin/users" className="block px-6 py-2.5 text-sm font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors">👥 Kelola User</Link>
                          </>
                        ) : (
                          <>
                            <Link href="/user/dashboard" className="block px-6 py-2.5 text-sm font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors">🏠 Dashboard Saya</Link>
                            <Link href="/user/bookings" className="block px-6 py-2.5 text-sm font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors">🎫 Pesanan Saya</Link>
                            <Link href="/user/profile" className="block px-6 py-2.5 text-sm font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors">⚙️ Pengaturan Profil</Link>
                            <Link href="/user/messages" className="block px-6 py-2.5 text-sm font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors">💬 Pusat Bantuan</Link>
                          </>
                        )}
                      </div>
                      <div className="p-2 bg-slate-50 border-t border-slate-100">
                        <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors flex items-center space-x-2">
                          <LogOut size={16} /> <span>Keluar Aplikasi</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/auth/login" className={`font-bold px-4 py-2 rounded-lg transition-colors ${textMenu}`}>
                  Masuk
                </Link>
                <Link href="/auth/register" className="bg-yellow-400 text-emerald-950 px-6 py-2.5 rounded-xl font-extrabold hover:bg-yellow-300 transition-all transform hover:scale-105 shadow-[0_5px_15px_rgba(250,204,21,0.4)]">
                  Daftar Member
                </Link>
              </div>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <button onClick={() => setIsOpen(!isOpen)} className={`md:hidden p-2 rounded-lg backdrop-blur-sm ${isSolid ? 'text-slate-800 bg-slate-100' : 'text-white bg-white/10'}`}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-2xl border-t border-slate-100 animate-slideIn">
          <div className="p-4 space-y-2">
            <Link href="/" className="block px-4 py-3 text-slate-700 font-bold bg-slate-50 rounded-xl">Beranda</Link>
            <Link href="/#courts" className="block px-4 py-3 text-slate-700 font-bold hover:bg-slate-50 rounded-xl">Lihat Lapangan</Link>
            <Link href="/contact" className="block px-4 py-3 text-slate-700 font-bold hover:bg-slate-50 rounded-xl">Pusat Bantuan</Link>
            
            <div className="h-px bg-slate-200 my-4"></div>
            
            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="px-4 py-2 mb-2">
                  <p className="text-xs text-slate-500 uppercase font-bold">Login sebagai:</p>
                  <p className="text-emerald-700 font-extrabold text-lg">{user?.name}</p>
                </div>
                {user?.role === 'admin' ? (
                  <Link href="/admin/dashboard" className="block px-4 py-3 bg-emerald-50 text-emerald-700 font-bold rounded-xl text-center">Masuk Dashboard Admin</Link>
                ) : (
                  <Link href="/user/dashboard" className="block px-4 py-3 bg-emerald-50 text-emerald-700 font-bold rounded-xl text-center">Masuk Dashboard User</Link>
                )}
                <button onClick={handleLogout} className="w-full mt-2 bg-red-50 text-red-600 py-3 rounded-xl font-bold flex items-center justify-center">
                  <LogOut size={18} className="mr-2"/> Logout Keluar
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-3 pt-2">
                <Link href="/auth/login" className="w-full text-center py-3 font-bold text-slate-700 border border-slate-200 rounded-xl">Login Akun</Link>
                <Link href="/auth/register" className="w-full text-center py-3 font-bold text-emerald-950 bg-yellow-400 rounded-xl shadow-lg">Daftar Member Baru</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}