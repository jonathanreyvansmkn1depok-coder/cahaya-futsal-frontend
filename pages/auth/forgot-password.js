import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import apiClient from '@/lib/api';
import toast from 'react-hot-toast';
import { Eye, EyeOff, AlertCircle, CheckCircle2, Mail, KeyRound } from 'lucide-react';

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

export default function ForgotPassword() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: input email, 2: reset password
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [resetToken, setResetToken] = useState('');
  const [formData, setFormData] = useState({
    password: '',
    password_confirmation: '',
  });

  const passwordStrength = getPasswordStrength(formData.password);

  const handleEmailSubmit = async (e) => {
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
      const response = await apiClient.post('/auth/forgot-password', { email });
      // Simpan token dari response untuk dipakai di step 2
      setResetToken(response.data.reset_token || '');
      toast.success('Verifikasi berhasil! Silakan buat password baru.');
      setStep(2);
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

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrors({});

    const newErrors = {};
    if (!formData.password) {
      newErrors.password = 'Password baru wajib diisi';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password minimal 8 karakter';
    }
    if (!formData.password_confirmation) {
      newErrors.password_confirmation = 'Konfirmasi password wajib diisi';
    } else if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = 'Password tidak cocok';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await apiClient.post('/auth/reset-password', {
        email,
        token: resetToken,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
      });
      toast.success('Password berhasil direset! Silakan login dengan password baru.');
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
        setErrors({ general: error.response?.data?.message || 'Reset password gagal. Silakan coba lagi.' });
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
          <p className="text-center text-gray-600 mb-6">Reset Password</p>

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className={`flex items-center gap-2 text-sm font-semibold ${step >= 1 ? 'text-primary' : 'text-gray-400'}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step >= 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
                {step > 1 ? <CheckCircle2 size={14} /> : '1'}
              </div>
              Verifikasi Email
            </div>
            <div className={`w-8 h-0.5 ${step >= 2 ? 'bg-primary' : 'bg-gray-200'}`} />
            <div className={`flex items-center gap-2 text-sm font-semibold ${step >= 2 ? 'text-primary' : 'text-gray-400'}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step >= 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
                2
              </div>
              Password Baru
            </div>
          </div>

          {step === 1 ? (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div className="flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 mb-4">
                <Mail size={18} className="text-blue-500 flex-shrink-0" />
                <p className="text-sm text-blue-700">
                  Masukkan email yang terdaftar. Jika ditemukan, Anda bisa langsung membuat password baru.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError('');
                  }}
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
                {loading ? 'Memverifikasi...' : 'Verifikasi Email'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="flex items-center gap-3 bg-green-50 border border-green-100 rounded-lg px-4 py-3 mb-4">
                <KeyRound size={18} className="text-green-500 flex-shrink-0" />
                <p className="text-sm text-green-700">
                  Email <strong>{email}</strong> terverifikasi. Buat password baru Anda.
                </p>
              </div>

              {errors.general && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3">
                  <AlertCircle size={18} className="flex-shrink-0" />
                  <span className="text-sm">{errors.general}</span>
                </div>
              )}

              {/* Password Baru */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password Baru</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => {
                      setFormData({ ...formData, password: e.target.value });
                      if (errors.password) setErrors({ ...errors, password: '' });
                    }}
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
                  </div>
                )}

                {errors.password && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.password}
                  </p>
                )}
              </div>

              {/* Konfirmasi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Konfirmasi Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.password_confirmation}
                    onChange={(e) => {
                      setFormData({ ...formData, password_confirmation: e.target.value });
                      if (errors.password_confirmation) setErrors({ ...errors, password_confirmation: '' });
                    }}
                    placeholder="Ulangi password baru"
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
                {loading ? 'Memproses...' : 'Simpan Password Baru'}
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
