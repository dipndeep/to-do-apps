import { useState } from 'react';
import { LogIn, UserPlus, Sparkles } from 'lucide-react';
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
    <div className="h-screen max-h-screen flex flex-col items-center justify-center p-4 select-none relative overflow-hidden bg-body-bg">
      {/* Abstract Background Grid/Pattern for Blueprint look (rotated and scaled for sketch look) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(1,28,50,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(1,28,50,0.06)_1px,transparent_1px)] bg-size-[30px_30px] pointer-events-none z-0 rotate-[4deg] scale-[1.3]" />

      {/* Decorative floating shapes for Neobrutalism wow-factor */}
      {/* Top Left Shape */}
      <div className="absolute top-12 left-12 w-28 h-28 bg-porcelain-300 border-[3px] border-ink-black-900 shadow-[6px_6px_0px_0px_var(--color-ink-black-900)] -rotate-12 hidden lg:block z-0" />
      {/* Bottom Right Shape */}
      <div className="absolute bottom-12 right-12 w-36 h-36 bg-amber-glow-300 border-[3px] border-ink-black-900 shadow-[8px_8px_0px_0px_var(--color-ink-black-900)] rounded-full rotate-45 hidden lg:block z-0" />
      {/* Top Right Shape */}
      <div className="absolute top-24 right-16 w-24 h-12 bg-light-sea-green-300 border-[3px] border-ink-black-900 shadow-[6px_6px_0px_0px_var(--color-ink-black-900)] rounded-full rotate-12 hidden lg:block z-0" />
      {/* Bottom Left Shape */}
      <div className="absolute bottom-20 left-16 w-20 h-20 bg-punch-red-300 border-[3px] border-ink-black-900 shadow-[6px_6px_0px_0px_var(--color-ink-black-900)] rotate-45 hidden lg:block z-0" />

      {/* Retro Crosses / Doodles */}
      <div className="absolute top-1/4 left-1/4 text-ink-black-900 opacity-20 font-mono text-xl select-none hidden md:block z-0">＋</div>
      <div className="absolute top-2/3 right-1/4 text-ink-black-900 opacity-20 font-mono text-xl select-none hidden md:block z-0">＋</div>
      <div className="absolute bottom-1/4 left-1/3 text-ink-black-900 opacity-20 font-mono text-xl select-none hidden md:block z-0">＋</div>
      <div className="absolute top-10 right-1/3 text-ink-black-900 opacity-20 font-mono text-xl select-none hidden md:block z-0">＋</div>

      {/* Main Title Badge */}
      <div className={`${isLogin ? 'mb-8' : 'mb-4'} -rotate-2 hover:rotate-0 transition-transform duration-200 relative z-10`}>
        <div className="bg-ink-black-900 text-white px-5 py-2.5 border-[3px] border-ink-black-900 shadow-[6px_6px_0px_0px_#30cfbf] rounded-[4px] flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-amber-glow-400 animate-pulse" />
          <h1 className="text-xl md:text-2xl font-black uppercase tracking-wider m-0">
            Dive Into Productivity
          </h1>
          <Sparkles className="w-5 h-5 text-amber-glow-400 animate-pulse" />
        </div>
        {isLogin && (
          <p className="text-center font-bold text-sm uppercase tracking-widest text-ink-black-900 mt-2 bg-amber-glow-100 border-2 border-ink-black-900 px-2 py-0.5 inline-block mx-auto rounded-xs">
            ⚡ Created By DipNDeep ⚡
          </p>
        )}
      </div>

      {/* Authentication Card */}
      <Card
<<<<<<< HEAD
        className={`w-full max-w-md border-[3px] border-ink-black-900 shadow-[8px_8px_0px_0px_var(--color-ink-black-900)] relative z-10 transition-all ${
=======
        className={`w-full max-w-md border-[3px] border-ink-black-900 shadow-[8px_8px_0px_0px_#011c32] relative z-10 transition-all ${
>>>>>>> b8e7fe69582c19b0b12bb69e49f06af54eb10f7f
          isLogin ? 'p-6' : 'p-4 sm:p-5'
        }`}
        bg={isLogin ? 'bg-white' : 'bg-ink-black-50'}
      >
        <div className={`${isLogin ? 'mb-6' : 'mb-4'} text-center`}>
          <CardTitle className={`${isLogin ? 'text-3xl' : 'text-xl sm:text-2xl'} uppercase tracking-wider font-extrabold`}>
            {isLogin ? 'MASUK AKUN' : 'DAFTAR BARU'}
          </CardTitle>
          <CardDescription className="text-xs">
            {isLogin 
              ? 'Silakan masuk untuk mengelola tugas harian Anda' 
              : 'Daftar sekarang untuk mendapatkan dashboard produktivitas gratis'
            }
          </CardDescription>
        </div>

        <form onSubmit={handleSubmit} className={isLogin ? 'space-y-4' : 'space-y-2.5'}>
          {/* Name Field (Only for Register) */}
          {!isLogin && (
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider mb-1 text-ink-black-900">
                Nama Lengkap
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Masukkan nama lengkap Anda"
                className={`w-full px-3 py-1.5 border-[3px] rounded-[4px] border-ink-black-900 font-semibold bg-white focus:bg-light-sea-green-50 focus:outline-none transition-colors text-sm ${
                  errors.name ? 'border-punch-red-500 bg-punch-red-50' : 'border-ink-black-900'
                }`}
              />
              {errors.name && (
                <p className="text-punch-red-600 text-[10px] font-bold mt-0.5 uppercase tracking-wide">
                  ⚠️ {errors.name}
                </p>
              )}
            </div>
          )}

          {/* Email Field */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider mb-1 text-ink-black-900">
              Alamat Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              className={`w-full px-3 py-1.5 border-[3px] rounded-[4px] border-ink-black-900 font-semibold bg-white focus:bg-light-sea-green-50 focus:outline-none transition-colors text-sm ${
                errors.email ? 'border-punch-red-500 bg-punch-red-50' : 'border-ink-black-900'
              }`}
            />
            {errors.email && (
              <p className="text-punch-red-600 text-[10px] font-bold mt-0.5 uppercase tracking-wide">
                ⚠️ {errors.email}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider mb-1 text-ink-black-900">
              Kata Sandi
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={`w-full px-3 py-1.5 border-[3px] rounded-[4px] border-ink-black-900 font-semibold bg-white focus:bg-light-sea-green-50 focus:outline-none transition-colors text-sm ${
                errors.password ? 'border-punch-red-500 bg-punch-red-50' : 'border-ink-black-900'
              }`}
            />
            {errors.password && (
              <p className="text-punch-red-600 text-[10px] font-bold mt-0.5 uppercase tracking-wide">
                ⚠️ {errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password (Only for Register) */}
          {!isLogin && (
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider mb-1 text-ink-black-900">
                Konfirmasi Kata Sandi
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full px-3 py-1.5 border-[3px] rounded-[4px] border-ink-black-900 font-semibold bg-white focus:bg-light-sea-green-50 focus:outline-none transition-colors text-sm ${
                  errors.confirmPassword ? 'border-punch-red-500 bg-punch-red-50' : 'border-ink-black-900'
                }`}
              />
              {errors.confirmPassword && (
                <p className="text-punch-red-600 text-[10px] font-bold mt-0.5 uppercase tracking-wide">
                  ⚠️ {errors.confirmPassword}
                </p>
              )}
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            variant={isLogin ? 'primary' : 'success'}
            className={`w-full py-2.5 text-base flex justify-center items-center ${isLogin ? 'mt-6' : 'mt-4'}`}
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
        <div className={`text-center border-t-2 border-ink-black-900 ${isLogin ? 'mt-6 pt-4' : 'mt-4 pt-3'}`}>
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
