import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import apiClient from '@/lib/api';
import toast from 'react-hot-toast';
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';

// Fungsi hitung kekuatan password
function getPasswordStrength(password) {
  if (!password) return { score: 0, label: '', color: '' };
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score, label: 'Sangat Lemah', color: 'bg-red-500' };
  if (score === 2) return { score, label: 'Lemah', color: 'bg-orange-400' };
  if (score === 3) return { score, label: 'Cukup', color: 'bg-yellow-400' };
  if (score === 4) return { score, label: 'Kuat', color: 'bg-blue-500' };
  return { score, label: 'Sangat Kuat', color: 'bg-green-500' };
}

export default function Register() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
  });

  const passwordStrength = getPasswordStrength(formData.password);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Nama wajib diisi';
    if (!formData.email) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }
    if (!formData.password) {
      newErrors.password = 'Password wajib diisi';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password minimal 8 karakter';
    }
    if (!formData.password_confirmation) {
      newErrors.password_confirmation = 'Konfirmasi password wajib diisi';
    } else if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = 'Password tidak cocok';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      await apiClient.post('/auth/register', formData);
      toast.success('Registrasi berhasil! Silakan login');
      router.push('/auth/login');
    } catch (error) {
      const serverErrors = error.response?.data?.errors;
      if (serverErrors) {
        const mapped = {};
        Object.entries(serverErrors).forEach(([key, val]) => {
          mapped[key] = Array.isArray(val) ? val[0] : val;
        });
        setErrors(mapped);
      } else {
        setErrors({ general: error.response?.data?.message || 'Registrasi gagal. Silakan coba lagi.' });
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
          <p className="text-center text-gray-600 mb-6">Buat akun baru</p>

          {errors.general && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-4">
              <AlertCircle size={18} className="flex-shrink-0" />
              <span className="text-sm">{errors.general}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nama */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Masukkan nama Anda"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition ${
                  errors.name ? 'border-red-400 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Masukkan email Anda"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition ${
                  errors.email ? 'border-red-400 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.email}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nomor Telepon <span className="text-gray-400">(opsional)</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Masukkan nomor telepon"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min. 8 karakter"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition pr-10 ${
                    errors.password ? 'border-red-400 bg-red-50' : 'border-gray-300'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Password Strength Bar */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                          i <= passwordStrength.score ? passwordStrength.color : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs font-medium ${
                    passwordStrength.score <= 1 ? 'text-red-500' :
                    passwordStrength.score === 2 ? 'text-orange-500' :
                    passwordStrength.score === 3 ? 'text-yellow-600' :
                    passwordStrength.score === 4 ? 'text-blue-600' : 'text-green-600'
                  }`}>
                    Kekuatan: {passwordStrength.label}
                  </p>
                  <ul className="mt-1 space-y-0.5">
                    {[
                      { ok: formData.password.length >= 8, text: 'Minimal 8 karakter' },
                      { ok: /[A-Z]/.test(formData.password), text: 'Mengandung huruf kapital' },
                      { ok: /[0-9]/.test(formData.password), text: 'Mengandung angka' },
                      { ok: /[^A-Za-z0-9]/.test(formData.password), text: 'Mengandung karakter khusus (!@#$...)' },
                    ].map((rule, i) => (
                      <li key={i} className={`text-xs flex items-center gap-1 ${rule.ok ? 'text-green-600' : 'text-gray-400'}`}>
                        <CheckCircle2 size={11} className={rule.ok ? 'text-green-500' : 'text-gray-300'} />
                        {rule.text}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {errors.password && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.password}
                </p>
              )}
            </div>

            {/* Konfirmasi Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Konfirmasi Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="password_confirmation"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  placeholder="Ulangi password Anda"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition pr-10 ${
                    errors.password_confirmation ? 'border-red-400 bg-red-50' :
                    formData.password_confirmation && formData.password === formData.password_confirmation
                      ? 'border-green-400' : 'border-gray-300'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {formData.password_confirmation && formData.password === formData.password_confirmation && (
                <p className="mt-1 text-xs text-green-600 flex items-center gap-1">
                  <CheckCircle2 size={12} /> Password cocok
                </p>
              )}
              {errors.password_confirmation && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.password_confirmation}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || formData.password.length < 8}
              className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Memproses...' : 'Daftar'}
            </button>
          </form>

          <p className="text-center text-gray-600 mt-6">
            Sudah punya akun?{' '}
            <Link href="/auth/login" className="text-primary font-semibold hover:underline">
              Login di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
