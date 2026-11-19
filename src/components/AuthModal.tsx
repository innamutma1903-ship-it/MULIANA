import { FormEvent, useState } from 'react';
import { LogIn, UserPlus, X } from 'lucide-react';
import { UserAccount } from '../types/store';

interface AuthModalProps {
  open: boolean;
  notice?: string | null;
  onClose: () => void;
  onLoginSuccess: (user: UserAccount) => void;
  accounts: UserAccount[];
  onRegisterAccount: (account: UserAccount) => void;
}

export function AuthModal({
  open,
  notice,
  onClose,
  onLoginSuccess,
  accounts,
  onRegisterAccount,
}: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Makassar');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleLoginSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const normalizedEmail = email.trim().toLowerCase();
    const matched = accounts.find((acc) => acc.email.toLowerCase() === normalizedEmail);

    if (!matched) {
      setError('Email belum terdaftar. Silakan pilih tab Daftar Akun atau gunakan Akun Demo.');
      return;
    }

    if (matched.password && matched.password !== password) {
      setError('Kata sandi tidak sesuai. Silakan periksa kembali.');
      return;
    }

    onLoginSuccess(matched);
    onClose();
  };

  const handleRegisterSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !email.trim() || !phone.trim() || password.length < 4) {
      setError('Mohon lengkapi nama, email, nomor WhatsApp, dan kata sandi (minimal 4 karakter).');
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (accounts.some((acc) => acc.email.toLowerCase() === normalizedEmail)) {
      setError('Email sudah terdaftar. Silakan masuk melalui tab Masuk.');
      return;
    }

    const newUser: UserAccount = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: normalizedEmail,
      phone: phone.trim(),
      address: address.trim() || 'Jl. Sunu No. 24, Dekat Lampu Merah Sunu',
      city: city.trim() || 'Makassar',
      password,
      createdAt: new Date().toISOString(),
    };

    onRegisterAccount(newUser);
    onLoginSuccess(newUser);
    onClose();
  };

  const handleDemoLogin = () => {
    const demoUser = accounts[0] ?? {
      id: 'usr-demo-muliana',
      name: 'Rina Rahmawati',
      email: 'pembeli@mulianashoes.id',
      phone: '085756850861',
      address: 'Jl. Sunu Raya No. 18, Dekat Lampu Merah Sunu',
      city: 'Makassar',
      password: 'demo',
      createdAt: new Date().toISOString(),
    };
    onLoginSuccess(demoUser);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-white rounded-2xl border border-zinc-200 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 pt-6 pb-4 border-b border-zinc-100 flex items-start justify-between gap-4">
          <div>
            <h2 id="auth-modal-title" className="font-display text-xl font-bold text-zinc-950">
              {mode === 'login' ? 'Masuk ke Muliana Shoes' : 'Buat Akun Pembeli'}
            </h2>
            <p className="text-xs text-zinc-500 mt-1">
              Simpan riwayat pesanan dan terima notifikasi pengiriman otomatis.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup jendela akun"
            className="w-9 h-9 rounded-lg text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 flex items-center justify-center cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {notice && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
              {notice}
            </div>
          )}

          {/* Mode Switcher */}
          <div className="grid grid-cols-2 p-1 bg-zinc-100 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError(null);
              }}
              className={`h-9 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                mode === 'login' ? 'bg-white text-zinc-950 shadow-xs' : 'text-zinc-600'
              }`}
            >
              Masuk
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setError(null);
              }}
              className={`h-9 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                mode === 'register' ? 'bg-white text-zinc-950 shadow-xs' : 'text-zinc-600'
              }`}
            >
              Daftar Akun
            </button>
          </div>

          {error && (
            <div
              role="alert"
              className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800"
            >
              {error}
            </div>
          )}

          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="login-email" className="block text-xs font-medium text-zinc-700">
                  Email
                </label>
                <input
                  id="login-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full h-11 px-3.5 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:border-zinc-900"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="login-pass" className="block text-xs font-medium text-zinc-700">
                  Kata Sandi
                </label>
                <input
                  id="login-pass"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi"
                  className="w-full h-11 px-3.5 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:border-zinc-900"
                />
              </div>

              <button
                type="submit"
                className="w-full h-11 rounded-xl bg-[#C81D4E] text-white text-sm font-semibold hover:bg-[#A8163F] transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Masuk Sekarang</span>
              </button>

              <div className="relative py-1">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-200" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-2 text-zinc-400">atau coba cepat</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleDemoLogin}
                className="w-full h-11 rounded-xl border border-zinc-300 bg-zinc-50 hover:bg-zinc-100 text-zinc-900 text-sm font-medium transition-colors cursor-pointer"
              >
                Masuk Cepat (Akun Pembeli Demo)
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label htmlFor="reg-name" className="block text-xs font-medium text-zinc-700">
                  Nama Lengkap
                </label>
                <input
                  id="reg-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Andi Pratama"
                  className="w-full h-10 px-3.5 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:border-zinc-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label htmlFor="reg-email" className="block text-xs font-medium text-zinc-700">
                    Email
                  </label>
                  <input
                    id="reg-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="andi@email.com"
                    className="w-full h-10 px-3.5 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:border-zinc-900"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="reg-phone" className="block text-xs font-medium text-zinc-700">
                    No. WhatsApp
                  </label>
                  <input
                    id="reg-phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="08xxxxxxxxxx"
                    className="w-full h-10 px-3.5 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:border-zinc-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label htmlFor="reg-city" className="block text-xs font-medium text-zinc-700">
                    Kota / Kabupaten
                  </label>
                  <input
                    id="reg-city"
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Makassar"
                    className="w-full h-10 px-3.5 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:border-zinc-900"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="reg-pass" className="block text-xs font-medium text-zinc-700">
                    Kata Sandi
                  </label>
                  <input
                    id="reg-pass"
                    type="password"
                    required
                    minLength={4}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 4 karakter"
                    className="w-full h-10 px-3.5 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:border-zinc-900"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="reg-address" className="block text-xs font-medium text-zinc-700">
                  Alamat Pengiriman
                </label>
                <input
                  id="reg-address"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Nama jalan, nomor rumah, patokan"
                  className="w-full h-10 px-3.5 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:border-zinc-900"
                />
              </div>

              <button
                type="submit"
                className="w-full h-11 rounded-xl bg-[#C81D4E] text-white text-sm font-semibold hover:bg-[#A8163F] transition-colors flex items-center justify-center gap-2 cursor-pointer mt-1"
              >
                <UserPlus className="w-4 h-4" />
                <span>Daftar & Masuk</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
