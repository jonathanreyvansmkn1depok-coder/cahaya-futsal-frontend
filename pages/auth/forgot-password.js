import React, { useState } from 'react';
import Link from 'next/link';
import apiClient from '@/lib/api';
import toast from 'react-hot-toast';
import { AlertCircle, Mail, CheckCircle2 } from 'lucide-react';

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError('');

    if (!email) {
      setEmailError('Email wajib diisi');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Format email tidak valid');
      return;
    }

    setLoading(true);
    try {
      await apiClient.post('/auth/forgot-password', { email });
      setSent(true);
      toast.success('Link reset password telah dikirim!');
    } catch (error) {
      const serverErrors = error.response?.data?.errors;
      if (serverErrors?.email) {
        setEmailError(Array.isArray(serverErrors.email) ? serverErrors.email[0] : serverErrors.email);
      } else {
        setEmailError(error.response?.data?.message || 'Email tidak terdaftar di sistem.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-green-50 to-accent flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fadeIn">
        <div className="bg-white rounded-lg shadow-2xl p-8">
          <h1 className="text-3xl font-bold text-center text-primary mb-2">Cahaya Futsal</h1>
          <p className="text-center text-gray-600 mb-6">Lupa Password?</p>

          {sent ? (
            // State setelah email terkirim
            <div className="text-center">
              <CheckCircle2 size={56} className="mx-auto text-green-500 mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Email Terkirim!</h3>
              <p className="text-gray-600 mb-2">
                Link reset password telah dikirim ke:
              </p>
              <p className="font-semibold text-primary mb-4">{email}</p>
              <p className="text-sm text-gray-500 mb-6">
                Silakan cek inbox atau folder <strong>Spam</strong> Anda. Link akan kadaluarsa dalam <strong>60 menit</strong>.
              </p>
              <button
                onClick={() => { setSent(false); setEmail(''); }}
                className="text-sm text-primary hover:underline"
              >
                Kirim ulang ke email lain
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 mb-4">
                <Mail size={18} className="text-blue-500 flex-shrink-0" />
                <p className="text-sm text-blue-700">
                  Masukkan email terdaftar Anda. Kami akan kirimkan link untuk membuat password baru.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setEmailError(''); }}
                  placeholder="Masukkan email terdaftar"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition ${
                    emailError ? 'border-red-400 bg-red-50' : 'border-gray-300'
                  }`}
                />
                {emailError && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle size={12} /> {emailError}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Mengirim...' : 'Kirim Link Reset Password'}
              </button>
            </form>
          )}

          <p className="text-center text-gray-600 mt-6">
            <Link href="/auth/login" className="text-primary font-semibold hover:underline">
              ← Kembali ke login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
