import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import Link from 'next/link';
import apiClient from '@/lib/api';
import { ShieldCheck, Trophy, Zap, MapPin, Users, ChevronRight, Activity, Clock, CheckCircle2, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store';

export default function HomePage() {
  const { isAuthenticated } = useAuthStore();
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🛠️ FIX: Memanggil foto dari folder frontend/public/images/
  // URL menggunakan "/" di depan otomatis akan mengarah ke folder public/
  const heroBg = "/images/background_website.jpg";
  const fieldPhotos = [
    "/images/futsal1.jpg", // Foto Lapangan A
    "/images/futsal2.jpg", // Foto Lapangan B
    "/images/futsal3.jpg"  // Foto Lapangan C
  ];

  useEffect(() => {
    fetchCourts();
  }, []);

  const fetchCourts = async () => {
    try {
      const response = await apiClient.get('/courts');
      // 🛠️ FIX: Memastikan hanya 3 lapangan yang muncul (A, B, C)
      setCourts(response.data.data.slice(0, 3));
    } catch (error) {
      toast.error('Gagal memuat data lapangan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      {/* ================= HERO SECTION ================= */}
      <section className="relative w-full min-h-[100vh] flex flex-col overflow-visible bg-slate-950 -mt-20 pt-40 pb-32">
        
        {/* Layer Backgrounds */}
        <div className="absolute inset-0 overflow-hidden z-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-900 via-slate-900 to-black z-0"></div>
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] z-0"></div>

          {/* 🛠️ FIX: Pemanggilan style URL yang benar */}
          <div 
            className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-overlay transition-transform duration-[30s] ease-out transform scale-125 hover:scale-100"
            style={{ backgroundImage: `url('${heroBg}')` }}
          />
          
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/80" />
          <div className="absolute inset-0 z-10 bg-gradient-to-r from-slate-950/50 via-transparent to-slate-950/50" />

          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-600/20 rounded-full blur-[100px] z-10 animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-[100px] z-10 animate-pulse delay-1000"></div>
        </div>

        {/* Konten Utama Hero */}
        <div className="relative z-20 text-center px-4 w-full max-w-6xl mx-auto flex-1 flex flex-col justify-center items-center">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-md text-emerald-300 font-bold text-xs uppercase tracking-widest mb-6 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            Sistem Booking Aktif 24/7
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-black text-white mb-6 leading-tight tracking-tighter drop-shadow-2xl">
            ARENA SANG <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-600 filter drop-shadow-[0_0_20px_rgba(250,204,21,0.4)]">
              JUARA SEJATI
            </span>
          </h1>
          
          <p className="text-lg md:text-2xl text-slate-300 mb-10 max-w-3xl mx-auto font-medium drop-shadow-lg leading-relaxed">
            Rasakan atmosfer stadion profesional. Rumput sintetis grade-A, pencahayaan LED standar kompetisi, dan fasilitas VIP untuk tim Anda.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center w-full">
            <a href="#courts" className="group relative w-full sm:w-auto flex justify-center items-center gap-3 bg-yellow-400 text-emerald-950 px-10 py-5 rounded-2xl font-black text-lg hover:bg-yellow-300 transition-all duration-300 transform hover:-translate-y-1 shadow-[0_15px_30px_-5px_rgba(250,204,21,0.4)] overflow-hidden">
              <div className="absolute inset-0 w-full h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
              <Zap size={24} className="animate-pulse"/>
              BOOKING SEKARANG
            </a>
            
            {!isAuthenticated && (
              <Link href="/auth/register" className="w-full sm:w-auto flex justify-center items-center gap-2 bg-white/5 border border-white/20 backdrop-blur-md text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-1">
                Daftar Member <ChevronRight size={20} />
              </Link>
            )}
          </div>
        </div>

        {/* Floating Stats Bar */}
        <div className="absolute bottom-0 translate-y-1/2 left-0 right-0 z-30 w-full max-w-5xl mx-auto px-4 hidden lg:block">
          <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex justify-around divide-x divide-slate-700/50">
            <div className="px-8 text-center">
              <div className="text-4xl font-black text-white mb-1">3</div>
              <div className="text-emerald-400 font-semibold text-sm uppercase tracking-wider">Lapangan VIP</div>
            </div>
            <div className="px-8 text-center">
              <div className="text-4xl font-black text-white mb-1">5K+</div>
              <div className="text-emerald-400 font-semibold text-sm uppercase tracking-wider">Member Aktif</div>
            </div>
            <div className="px-8 text-center">
              <div className="text-4xl font-black text-white mb-1">24/7</div>
              <div className="text-emerald-400 font-semibold text-sm uppercase tracking-wider">Sistem Online</div>
            </div>
            <div className="px-8 text-center">
              <div className="text-4xl font-black text-white mb-1">100%</div>
              <div className="text-emerald-400 font-semibold text-sm uppercase tracking-wider">Kepuasan</div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= BENTO-GRID FEATURES SECTION ================= */}
      <section className="pt-40 pb-24 bg-slate-50 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-1 bg-emerald-500 rounded-full"></div>
              <h2 className="text-sm font-bold tracking-widest text-emerald-600 uppercase">Mengapa Cahaya Futsal?</h2>
            </div>
            <h3 className="text-4xl md:text-5xl font-black text-slate-900">Standar Baru <br/>Bermain Futsal.</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
            <div className="md:col-span-2 bg-gradient-to-br from-emerald-600 to-emerald-900 rounded-3xl p-10 text-white relative overflow-hidden shadow-xl group">
              <div className="absolute -right-10 -bottom-10 opacity-20 transform group-hover:scale-110 transition-transform duration-500"><Trophy size={200} /></div>
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6"><ShieldCheck size={28} className="text-yellow-300"/></div>
                <div>
                  <h3 className="text-3xl font-black mb-3">Kualitas Rumput FIFA</h3>
                  <p className="text-emerald-100 text-lg max-w-md">Menggunakan rumput sintetis monofilament generasi terbaru. Mencegah cedera dan pantulan bola lebih akurat.</p>
                </div>
              </div>
            </div>
            <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-shadow group flex flex-col justify-between">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 transform group-hover:-translate-y-1 transition-transform"><Zap size={28}/></div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Booking Instan</h3>
                <p className="text-slate-600">Cek jadwal kosong secara realtime. Booking dan bayar dalam hitungan detik tanpa antre.</p>
              </div>
            </div>
            <div className="bg-slate-900 rounded-3xl p-8 shadow-xl text-white group flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/10 rounded-bl-full"></div>
              <div className="w-14 h-14 bg-white/10 backdrop-blur-md text-yellow-400 rounded-2xl flex items-center justify-center mb-6 relative z-10"><Activity size={28}/></div>
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-2">Pencahayaan LED</h3>
                <p className="text-slate-400">Main malam hari serasa siang dengan lampu tembak LED 1000 Watt bebas bayangan.</p>
              </div>
            </div>
            <div className="md:col-span-2 bg-white border border-slate-100 rounded-3xl p-8 shadow-xl flex items-center gap-8 group">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 text-red-600 rounded-lg text-sm font-bold mb-4"><Star size={14} className="fill-current"/> Extra Fasilitas</div>
                <h3 className="text-2xl font-black text-slate-900 mb-3">Fasilitas Penunjang Lengkap</h3>
                <p className="text-slate-600 mb-6">Mulai dari ruang ganti ber-AC, kamar mandi air panas, tribun penonton, hingga mini cafe untuk nobar tersedia untuk Anda.</p>
                <div className="flex gap-4">
                  <span className="flex items-center text-sm font-bold text-slate-700"><CheckCircle2 size={16} className="text-emerald-500 mr-1"/> Free Wi-Fi</span>
                  <span className="flex items-center text-sm font-bold text-slate-700"><CheckCircle2 size={16} className="text-emerald-500 mr-1"/> Loker Aman</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS SECTION ================= */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-16">Cara Mudah Mulai Bermain</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-1 bg-slate-100 -z-10 transform -translate-y-1/2"></div>
            {[
              { step: '1', title: 'Pilih Lapangan', desc: 'Cari tipe lapangan yang sesuai dengan kebutuhan tim Anda.' },
              { step: '2', title: 'Tentukan Waktu', desc: 'Lihat kalender realtime dan pilih jam kosong.' },
              { step: '3', title: 'Upload Bukti Bayar', desc: 'Lakukan pembayaran dan unggah struk di dashboard.' },
              { step: '4', title: 'Main Futsal!', desc: 'Datang ke lokasi, tunjukkan invoice, dan cetak gol!' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center bg-white">
                <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center text-2xl font-black mb-6 shadow-xl shadow-emerald-600/30 ring-8 ring-white">{item.step}</div>
                <h4 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed max-w-[200px]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= COURTS SECTION (HANYA 3 LAPANGAN) ================= */}
      <section id="courts" className="py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-1 bg-yellow-400 rounded-full"></div>
                <h2 className="text-sm font-bold tracking-widest text-yellow-400 uppercase">Arena Utama</h2>
              </div>
              <h3 className="text-4xl md:text-5xl font-black">Pilih Lapangan Anda.</h3>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-700 border-t-yellow-400 mb-4" />
              <p className="text-slate-400 font-medium animate-pulse">Menyiapkan data lapangan...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {courts.map((court, idx) => (
                <div key={court.id} className="bg-slate-800 rounded-[32px] overflow-hidden shadow-2xl flex flex-col group border border-slate-700 hover:border-emerald-500/50 transition-all duration-300 transform hover:-translate-y-2">
                  <div className="h-64 relative overflow-hidden bg-slate-900">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-emerald-800/40 to-transparent z-0"></div>
                    
                    {/* 🛠️ FIX: Pemanggilan gambar dinamis */}
                    <div 
                      className="absolute inset-0 bg-cover bg-center opacity-70 mix-blend-overlay transition-transform duration-700 group-hover:scale-110"
                      style={{ backgroundImage: `url('${fieldPhotos[idx] || fieldPhotos[0]}')` }}
                    ></div>
                    
                    {idx === 0 && (
                      <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-amber-600 text-slate-950 text-xs font-black px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-1 z-10">
                        <Star size={12} className="fill-current"/> TERFAVORIT
                      </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent z-10"></div>
                    <h3 className="absolute bottom-6 left-6 text-3xl font-black text-white z-20 drop-shadow-lg">{court.name}</h3>
                  </div>
                  
                  <div className="p-8 flex-1 flex flex-col relative z-20">
                    <p className="text-slate-400 mb-8 text-sm leading-relaxed flex-1 min-h-[60px]">{court.description}</p>
                    <div className="relative bg-slate-950 rounded-2xl p-6 mb-8 border border-slate-700">
                      <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-slate-800 rounded-full border-r border-slate-700"></div>
                      <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-slate-800 rounded-full border-l border-slate-700"></div>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Tarif Sewa</span>
                        <div className="flex items-center text-xs text-slate-400 bg-slate-800 px-3 py-1.5 rounded-md"><Clock size={12} className="mr-1.5"/> Per Jam</div>
                      </div>
                      <div className="flex items-baseline">
                        <span className="text-yellow-400 font-bold text-xl mr-2">Rp</span>
                        <span className="font-black text-white text-4xl tracking-tight">{parseInt(court.price_per_hour).toLocaleString('id-ID')}</span>
                      </div>
                      <div className="mt-5 pt-5 border-t border-slate-800 flex justify-between items-center text-sm">
                        <span className="flex items-center text-slate-400"><Users size={16} className="mr-2 text-emerald-500" /> Kapasitas Maks.</span>
                        <span className="font-bold text-white bg-slate-700 px-2.5 py-1 rounded-md">{court.capacity} Org</span>
                      </div>
                    </div>
                    <Link href={`/booking/${court.id}`} className="block w-full bg-emerald-600 text-white text-center py-4 rounded-xl font-bold text-lg hover:bg-emerald-500 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all duration-300">
                      Booking Jadwal Sekarang
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ================= PRE-FOOTER CTA ================= */}
      <section className="py-20 bg-gradient-to-br from-emerald-600 to-emerald-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-black/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6 drop-shadow-md">Saatnya Buktikan Skill Tim Anda!</h2>
          <p className="text-lg md:text-xl text-emerald-100 mb-10 max-w-2xl mx-auto font-medium">
            Jangan biarkan tim lawan mengambil jadwal favorit Anda. Gabung bersama ribuan member Cahaya Futsal lainnya.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {isAuthenticated ? (
              <Link href="/#courts" className="w-full sm:w-auto bg-yellow-400 text-emerald-950 px-10 py-4 rounded-xl font-black text-lg hover:bg-yellow-300 hover:-translate-y-1 transition-all shadow-xl">
                BOOKING JADWAL SEKARANG
              </Link>
            ) : (
              <Link href="/auth/register" className="w-full sm:w-auto bg-yellow-400 text-emerald-950 px-10 py-4 rounded-xl font-black text-lg hover:bg-yellow-300 hover:-translate-y-1 transition-all shadow-xl">
                DAFTAR MEMBER GRATIS
              </Link>
            )}
            <Link href="/contact" className="w-full sm:w-auto border-2 border-emerald-400 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-emerald-800 transition-all">
              Hubungi CS Kami
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}