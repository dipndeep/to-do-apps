import React, { useState } from 'react';
import { LogIn, UserPlus, ShieldAlert, Sparkles } from 'lucide-react';
import Button from '../components/Button';
import Card, { CardTitle, CardDescription } from '../components/Card';
import { mockDb } from '../utils/mockDb';

export default function AuthView({ onAuthSuccess, showToast }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      newErrors.email = 'Email wajib diisi.';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Format email tidak valid.';
    }

    if (!password) {
      newErrors.password = 'Password wajib diisi.';
    } else if (password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter.';
    }

    if (!isLogin) {
      if (!name.trim()) {
        newErrors.name = 'Nama lengkap wajib diisi.';
      }
      if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Konfirmasi password tidak cocok.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast('Mohon perbaiki kesalahan pada form.', 'error');
      return;
    }

    try {
      if (isLogin) {
        // Handle Login
        const user = mockDb.login(email, password);
        showToast(`Selamat datang kembali, ${user.name}!`, 'success');
        onAuthSuccess(user);
      } else {
        // Handle Register
        mockDb.register(email, name, password);
        showToast('Registrasi berhasil! Silakan login.', 'success');
        setIsLogin(true);
        // Clear registration sensitive fields
        setPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 select-none relative overflow-hidden">
      {/* Decorative floating shapes for Neobrutalism wow-factor */}
      <div className="absolute top-10 left-10 w-24 h-24 bg-porcelain-300 neobrutal-border -rotate-12 hidden md:block" />
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-amber-glow-300 neobrutal-border rounded-full rotate-45 hidden md:block" />

      {/* Main Title Badge */}
      <div className="mb-8 -rotate-2 hover:rotate-0 transition-transform duration-200">
        <div className="bg-ink-black-900 text-white px-6 py-3 border-[3px] border-ink-black-900 shadow-[6px_6px_0px_0px_#30cfbf] rounded-[4px] flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-amber-glow-400" />
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-wider m-0">
            Sistem Manajemen Tugas
          </h1>
        </div>
        <p className="text-center font-bold text-sm uppercase tracking-widest text-ink-black-900 mt-2 bg-amber-glow-100 border-2 border-ink-black-900 px-2 py-0.5 inline-block mx-auto rounded-xs">
          ⚡ Neobrutalist Edition ⚡
        </p>
      </div>

      {/* Authentication Card */}
      <Card
        className="w-full max-w-md border-[3px] border-ink-black-900 shadow-[8px_8px_0px_0px_#011c32]"
        bg={isLogin ? 'bg-white' : 'bg-ink-black-50'}
      >
        <div className="mb-6 text-center">
          <CardTitle className="text-3xl uppercase tracking-wider font-extrabold">
            {isLogin ? 'MASUK AKUN' : 'DAFTAR BARU'}
          </CardTitle>
          <CardDescription>
            {isLogin 
              ? 'Silakan masuk untuk mengelola tugas harian Anda' 
              : 'Daftar sekarang untuk mendapatkan dashboard produktivitas gratis'
            }
          </CardDescription>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field (Only for Register) */}
          {!isLogin && (
            <div>
              <label className="block text-xs font-black uppercase tracking-wider mb-1.5 text-ink-black-900">
                Nama Lengkap
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Masukkan nama lengkap Anda"
                className={`w-full px-3 py-2 border-[3px] rounded-[4px] border-ink-black-900 font-semibold bg-white focus:bg-light-sea-green-50 focus:outline-none transition-colors ${
                  errors.name ? 'border-punch-red-500 bg-punch-red-50' : 'border-ink-black-900'
                }`}
              />
              {errors.name && (
                <p className="text-punch-red-600 text-xs font-bold mt-1 uppercase tracking-wide">
                  ⚠️ {errors.name}
                </p>
              )}
            </div>
          )}

          {/* Email Field */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider mb-1.5 text-ink-black-900">
              Alamat Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              className={`w-full px-3 py-2 border-[3px] rounded-[4px] border-ink-black-900 font-semibold bg-white focus:bg-light-sea-green-50 focus:outline-none transition-colors ${
                errors.email ? 'border-punch-red-500 bg-punch-red-50' : 'border-ink-black-900'
              }`}
            />
            {errors.email && (
              <p className="text-punch-red-600 text-xs font-bold mt-1 uppercase tracking-wide">
                ⚠️ {errors.email}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider mb-1.5 text-ink-black-900">
              Kata Sandi
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={`w-full px-3 py-2 border-[3px] rounded-[4px] border-ink-black-900 font-semibold bg-white focus:bg-light-sea-green-50 focus:outline-none transition-colors ${
                errors.password ? 'border-punch-red-500 bg-punch-red-50' : 'border-ink-black-900'
              }`}
            />
            {errors.password && (
              <p className="text-punch-red-600 text-xs font-bold mt-1 uppercase tracking-wide">
                ⚠️ {errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password (Only for Register) */}
          {!isLogin && (
            <div>
              <label className="block text-xs font-black uppercase tracking-wider mb-1.5 text-ink-black-900">
                Konfirmasi Kata Sandi
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full px-3 py-2 border-[3px] rounded-[4px] border-ink-black-900 font-semibold bg-white focus:bg-light-sea-green-50 focus:outline-none transition-colors ${
                  errors.confirmPassword ? 'border-punch-red-500 bg-punch-red-50' : 'border-ink-black-900'
                }`}
              />
              {errors.confirmPassword && (
                <p className="text-punch-red-600 text-xs font-bold mt-1 uppercase tracking-wide">
                  ⚠️ {errors.confirmPassword}
                </p>
              )}
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            variant={isLogin ? 'primary' : 'success'}
            className="w-full mt-6 py-3 text-base flex justify-center items-center"
          >
            {isLogin ? (
              <>
                <LogIn className="w-5 h-5" /> MASUK KE DASHBOARD
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5" /> BUAT AKUN SEKARANG
              </>
            )}
          </Button>
        </form>

        {/* Auth Toggle Link */}
        <div className="mt-6 text-center border-t-2 border-ink-black-900 pt-4">
          <p className="text-sm font-semibold">
            {isLogin ? 'Belum punya akun?' : 'Sudah terdaftar?'}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setErrors({});
              }}
              className="ml-2 font-black text-ink-black-900 underline hover:text-light-sea-green-600 transition-colors uppercase cursor-pointer"
            >
              {isLogin ? 'Daftar Di Sini' : 'Masuk Di Sini'}
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
}
