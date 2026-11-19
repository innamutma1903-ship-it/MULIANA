import { useState } from 'react';
import { Bell, LogOut, Menu, Package, ShoppingBag, User, X } from 'lucide-react';
import { UserAccount } from '../types/store';

interface HeaderProps {
  user: UserAccount | null;
  cartCount: number;
  unreadNotifications: number;
  activeOrdersCount: number;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenCart: () => void;
  onOpenOrders: () => void;
  onOpenNotifications: () => void;
}

export function Header({
  user,
  cartCount,
  unreadNotifications,
  activeOrdersCount,
  onOpenAuth,
  onLogout,
  onOpenCart,
  onOpenOrders,
  onOpenNotifications,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <a
          href="#beranda"
          className="font-display text-lg sm:text-xl font-extrabold tracking-tight text-zinc-950 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C81D4E]"
        >
          Muliana Shoes
        </a>

        {/* Zone 2: Concise single-line navigation links */}
        <nav
          aria-label="Navigasi utama"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-zinc-600"
        >
          <a
            href="#katalog"
            className="hover:text-zinc-950 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 border-transparent hover:border-zinc-950"
          >
            Katalog
          </a>
          <a
            href="#beranda"
            className="hover:text-zinc-950 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 border-transparent hover:border-zinc-950"
          >
            Video Promo
          </a>
          <button
            type="button"
            onClick={onOpenOrders}
            className="hover:text-zinc-950 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 border-transparent hover:border-zinc-950 cursor-pointer flex items-center gap-1.5"
          >
            <span>Pesanan</span>
            {activeOrdersCount > 0 && (
              <span className="font-mono text-xs text-[#C81D4E] tabular-nums">
                ({activeOrdersCount})
              </span>
            )}
          </button>
          <a
            href="#lokasi"
            className="hover:text-zinc-950 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 border-transparent hover:border-zinc-950"
          >
            Lokasi Toko
          </a>
        </nav>

        {/* Zone 3: Primary User Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenNotifications}
            aria-label={`Notifikasi pengiriman (${unreadNotifications} belum dibaca)`}
            className="relative inline-flex items-center justify-center w-10 h-10 rounded-lg text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950 transition-colors cursor-pointer"
          >
            <Bell className="w-5 h-5" strokeWidth={1.8} />
            {unreadNotifications > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#C81D4E] text-white text-[11px] font-semibold font-mono tabular-nums flex items-center justify-center">
                {unreadNotifications > 9 ? '9+' : unreadNotifications}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={onOpenCart}
            aria-label={`Keranjang belanja (${cartCount} item)`}
            className="relative inline-flex items-center justify-center gap-2 h-10 px-3 rounded-lg text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <ShoppingBag className="w-5 h-5" strokeWidth={1.8} />
            <span className="hidden sm:inline text-sm font-medium">Keranjang</span>
            {cartCount > 0 && (
              <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-zinc-950 text-white text-xs font-semibold font-mono tabular-nums flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setAccountMenuOpen((v) => !v)}
                className="inline-flex items-center gap-2 h-10 px-3.5 rounded-lg bg-zinc-950 text-white text-sm font-medium hover:bg-zinc-800 transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <User className="w-4 h-4" strokeWidth={2} />
                <span className="max-w-[110px] truncate">{user.name.split(' ')[0]}</span>
              </button>

              {accountMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setAccountMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl border border-zinc-200 shadow-lg py-2 z-50">
                    <div className="px-4 py-2.5 border-b border-zinc-100">
                      <p className="text-sm font-semibold text-zinc-950 truncate">{user.name}</p>
                      <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setAccountMenuOpen(false);
                        onOpenOrders();
                      }}
                      className="w-full px-4 py-2.5 text-left text-sm text-zinc-700 hover:bg-zinc-50 flex items-center gap-2.5 cursor-pointer"
                    >
                      <Package className="w-4 h-4 text-zinc-500" />
                      <span>Pesanan Saya</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAccountMenuOpen(false);
                        onLogout();
                      }}
                      className="w-full px-4 py-2.5 text-left text-sm text-[#C81D4E] hover:bg-rose-50/70 flex items-center gap-2.5 cursor-pointer font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Keluar (Logout)</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenAuth}
              className="inline-flex items-center justify-center h-10 px-4 rounded-lg bg-[#C81D4E] text-white text-sm font-semibold hover:bg-[#A8163F] transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              Masuk
            </button>
          )}

          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label="Menu navigasi"
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg text-zinc-700 hover:bg-zinc-100 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-200 bg-white px-4 py-3 space-y-1">
          <a
            href="#katalog"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2.5 text-sm font-medium text-zinc-800 hover:text-[#C81D4E]"
          >
            Katalog Sepatu
          </a>
          <a
            href="#beranda"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2.5 text-sm font-medium text-zinc-800 hover:text-[#C81D4E]"
          >
            Video Promosi
          </a>
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenOrders();
            }}
            className="block w-full text-left py-2.5 text-sm font-medium text-zinc-800 hover:text-[#C81D4E]"
          >
            Pesanan Saya {activeOrdersCount > 0 ? `(${activeOrdersCount})` : ''}
          </button>
          <a
            href="#lokasi"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2.5 text-sm font-medium text-zinc-800 hover:text-[#C81D4E]"
          >
            Lokasi Toko
          </a>
        </div>
      )}
    </header>
  );
}
