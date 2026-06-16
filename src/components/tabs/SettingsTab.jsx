import { useState } from 'react';
import { User, ShieldCheck, Palette, Check } from 'lucide-react';
import Card, { CardTitle, CardDescription } from '../Card';
import Button from '../Button';
import { mockDb } from '../../utils/mockDb';

export default function SettingsTab({ 
  user, 
  currentTheme, 
  onChangeTheme, 
  onUpdateUserSession, 
  showToast 
}) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Define details of the selectable themes for preview rendering
  const themes = [
    {
      id: 'default',
      name: 'Original Ink',
      bg: '#f7f9fa',
      border: '#011c32',
      primary: '#30cfbf',
      success: '#55ff00',
    },
    {
      id: 'solarized',
      name: 'Solarized Retro',
      bg: '#fdf6e3',
      border: '#073642',
      primary: '#268bd2',
      success: '#859900',
    },
    {
      id: 'cyber',
      name: 'Neon Cyberpunk',
      bg: '#09080f',
      border: '#ff007f',
      primary: '#00f0ff',
      success: '#39ff14',
    },
    {
      id: 'grape',
      name: 'Grape Soda',
      bg: '#f5efff',
      border: '#2b1055',
      primary: '#9b51e0',
      success: '#7fff00',
    },
  ];

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      showToast('Nama dan Email tidak boleh kosong.', 'error');
      return;
    }

    if (password && password.length < 6) {
      showToast('Kata sandi baru minimal 6 karakter.', 'error');
      return;
    }

    if (password && password !== confirmPassword) {
      showToast('Konfirmasi kata sandi tidak cocok.', 'error');
      return;
    }

    try {
      const updatedUser = mockDb.updateProfile(user.id, {
        name: name.trim(),
        email: email.trim(),
        password: password || undefined,
      });
      showToast('Profil Anda berhasil diperbarui!', 'success');
      onUpdateUserSession(updatedUser);
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-[fadeIn_0.2s_ease-out] select-none">
      
      {/* Profile Form Card */}
      <Card bg="bg-white" className="border-3 border-ink-black-900 shadow-[4px_4px_0px_0px_var(--color-ink-black-900)]">
        <div className="flex items-center gap-2 mb-4">
          <User className="w-5 h-5 text-ink-black-900 stroke-[2.5]" />
          <CardTitle className="text-xl uppercase tracking-wide">Detail Profil Akun</CardTitle>
        </div>
        <CardDescription className="mb-6">Perbarui nama pengguna, alamat email, atau kata sandi akun Anda.</CardDescription>

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div>
            <label className="block text-xs font-black uppercase tracking-wider mb-1.5 text-ink-black-900">Nama Lengkap</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border-[3px] rounded-[4px] border-ink-black-900 bg-white font-semibold focus:outline-none transition-colors text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider mb-1.5 text-ink-black-900">Alamat Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border-[3px] rounded-[4px] border-ink-black-900 bg-white font-semibold focus:outline-none transition-colors text-sm"
            />
          </div>

          <div className="pt-2 border-t border-ink-black-100 mt-4 space-y-4">
            <p className="text-[10px] uppercase font-bold text-ink-black-500 tracking-wider">Ganti Kata Sandi (Kosongkan jika tidak diganti)</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider mb-1.5 text-ink-black-900">Kata Sandi Baru</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 border-[3px] rounded-[4px] border-ink-black-900 bg-white font-semibold focus:outline-none transition-colors text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-wider mb-1.5 text-ink-black-900">Konfirmasi Sandi</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 border-[3px] rounded-[4px] border-ink-black-900 bg-white font-semibold focus:outline-none transition-colors text-sm"
                />
              </div>
            </div>
          </div>

          <Button type="submit" variant="success" className="w-full mt-6 py-2.5">
            <ShieldCheck className="w-5 h-5 stroke-[2.5]" /> SIMPAN PERUBAHAN
          </Button>
        </form>
      </Card>

      {/* Theme Settings Card */}
      <Card bg="bg-white" className="border-3 border-ink-black-900 shadow-[4px_4px_0px_0px_var(--color-ink-black-900)]">
        <div className="flex items-center gap-2 mb-4">
          <Palette className="w-5 h-5 text-ink-black-900 stroke-[2.5]" />
          <CardTitle className="text-xl uppercase tracking-wide">Kustomisasi Tema Visual</CardTitle>
        </div>
        <CardDescription className="mb-6">Ubah estetika warna antarmuka aplikasi secara instan.</CardDescription>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {themes.map((theme) => {
            const isSelected = currentTheme === theme.id;
            return (
              <div
                key={theme.id}
                onClick={() => {
                  onChangeTheme(theme.id);
                  showToast(`Tema warna diubah ke: ${theme.name}`, 'info');
                }}
                className={`neobrutal-border p-4 rounded-[4px] bg-white shadow-[3px_3px_0px_0px_var(--color-ink-black-900)] hover:shadow-[4px_4px_0px_0px_var(--color-ink-black-900)] hover:-translate-x-px hover:-translate-y-px cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected ? 'ring-3 ring-ink-black-900 bg-ink-black-50' : 'opacity-85 hover:opacity-100'
                }`}
              >
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-extrabold text-xs uppercase tracking-wide text-ink-black-900">
                      {theme.name}
                    </span>
                    {isSelected && (
                      <span className="p-0.5 bg-porcelain-400 border border-ink-black-900 rounded-[4px]">
                        <Check className="w-3.5 h-3.5 text-ink-black-900 stroke-3" />
                      </span>
                    )}
                  </div>
                  
                  {/* Theme color circles preview layout */}
                  <div className="flex items-center gap-2 border-t-2 border-ink-black-100 pt-3">
                    <span className="w-5 h-5 rounded-full border border-ink-black-900" style={{ backgroundColor: theme.bg }} title="Background" />
                    <span className="w-5 h-5 rounded-full border border-ink-black-900" style={{ backgroundColor: theme.border }} title="Borders" />
                    <span className="w-5 h-5 rounded-full border border-ink-black-900" style={{ backgroundColor: theme.primary }} title="Primary Color" />
                    <span className="w-5 h-5 rounded-full border border-ink-black-900" style={{ backgroundColor: theme.success }} title="Success Color" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

    </div>
  );
}
