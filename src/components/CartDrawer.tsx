import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { formatIDR } from '../data/shoes';
import { CartItem } from '../types/store';
import { ProductImage } from './ProductImage';

interface CartDrawerProps {
  open: boolean;
  items: CartItem[];
  onClose: () => void;
  onUpdateQty: (key: string, delta: number) => void;
  onRemoveItem: (key: string) => void;
  onCheckout: () => void;
}

export function CartDrawer({
  open,
  items,
  onClose,
  onUpdateQty,
  onRemoveItem,
  onCheckout,
}: CartDrawerProps) {
  if (!open) return null;

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const freeShippingThreshold = 750000;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-zinc-950/55 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-label="Keranjang belanja"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl border-l border-zinc-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="px-6 py-4 border-b border-zinc-200 flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-bold text-zinc-950">Keranjang Belanja</h2>
            <p className="text-xs text-zinc-500 tabular-nums">
              {items.reduce((sum, i) => sum + i.quantity, 0)} pasang sepatu dipilih
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup keranjang"
            className="w-9 h-9 rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950 flex items-center justify-center cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-400">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <p className="font-display text-base font-semibold text-zinc-900">
                Keranjang Anda masih kosong
              </p>
              <p className="text-sm text-zinc-500 max-w-xs">
                Pilih sepatu favorit dari merek Nike, Adidas, atau Puma dengan ukuran 35–43.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-2 h-10 px-5 rounded-lg bg-zinc-950 text-white text-sm font-medium hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                Jelajahi Katalog
              </button>
            </div>
          ) : (
            <>
              {/* Subtle Free Shipping Progress */}
              <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80 text-xs text-zinc-700">
                {remainingForFreeShipping === 0 ? (
                  <p className="font-medium text-emerald-700">
                    Gratis ongkos kirim aktif untuk pesanan ini.
                  </p>
                ) : (
                  <p>
                    Tambah belanja{' '}
                    <span className="font-mono font-semibold text-zinc-950 tabular-nums">
                      {formatIDR(remainingForFreeShipping)}
                    </span>{' '}
                    lagi untuk gratis ongkir.
                  </p>
                )}
              </div>

              <ul className="divide-y divide-zinc-100">
                {items.map((item) => (
                  <li key={item.key} className="py-4 flex gap-4">
                    <div className="w-20 h-20 rounded-xl bg-zinc-100 overflow-hidden shrink-0 border border-zinc-200/70">
                      <ProductImage
                        src={item.image}
                        alt={item.name}
                        brand={item.brand}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-display text-sm font-semibold text-zinc-950 truncate">
                            {item.name}
                          </p>
                          <button
                            type="button"
                            onClick={() => onRemoveItem(item.key)}
                            aria-label={`Hapus ${item.name}`}
                            className="text-zinc-400 hover:text-[#C81D4E] p-1 -mr-1 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-xs text-zinc-500 mt-0.5">
                          {item.brand} · Ukuran <span className="font-mono">{item.size}</span>
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="inline-flex items-center border border-zinc-200 rounded-lg">
                          <button
                            type="button"
                            onClick={() => onUpdateQty(item.key, -1)}
                            aria-label="Kurangi jumlah"
                            className="w-7 h-7 flex items-center justify-center text-zinc-600 hover:text-zinc-950 cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center font-mono text-xs font-semibold tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQty(item.key, 1)}
                            aria-label="Tambah jumlah"
                            className="w-7 h-7 flex items-center justify-center text-zinc-600 hover:text-zinc-950 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <p className="font-mono text-sm font-semibold text-zinc-950 tabular-nums">
                          {formatIDR(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        {/* Drawer Footer */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-zinc-200 bg-zinc-50/70 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-600">Subtotal Produk</span>
              <span className="font-mono text-lg font-bold text-zinc-950 tabular-nums">
                {formatIDR(subtotal)}
              </span>
            </div>
            <button
              type="button"
              onClick={onCheckout}
              className="w-full h-12 rounded-xl bg-[#C81D4E] text-white text-sm font-semibold hover:bg-[#A8163F] transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Lanjut ke Pembayaran</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
