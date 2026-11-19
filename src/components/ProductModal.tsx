import { useEffect, useState } from 'react';
import { Check, MessageCircle, Minus, Plus, ShieldCheck, ShoppingBag, Star, X } from 'lucide-react';
import { buildWhatsAppUrl, formatIDR } from '../data/shoes';
import { ALL_SIZES, ShoeProduct, ShoeSize, SIZE_CM_GUIDE } from '../types/store';
import { ProductImage } from './ProductImage';

interface ProductModalProps {
  product: ShoeProduct | null;
  onClose: () => void;
  onAddToCart: (product: ShoeProduct, size: ShoeSize, quantity: number) => void;
  onBuyNow: (product: ShoeProduct, size: ShoeSize, quantity: number) => void;
}

export function ProductModal({ product, onClose, onAddToCart, onBuyNow }: ProductModalProps) {
  const [selectedSize, setSelectedSize] = useState<ShoeSize>(40);
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    if (product) {
      setSelectedSize(40);
      setQuantity(1);
      setJustAdded(false);
    }
  }, [product]);

  if (!product) return null;

  const availableStock = product.stockBySize[selectedSize] ?? 5;

  const handleAdd = () => {
    onAddToCart(product, selectedSize, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
  };

  const whatsappInquiry = buildWhatsAppUrl(
    `Halo Muliana Shoes Cabang Lampu Merah Sunu, saya tertarik dengan ${product.name} (${product.brand}) ukuran ${selectedSize} harga ${formatIDR(product.price)}. Apakah masih tersedia?`
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-zinc-950/60 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-modal-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-zinc-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup detail produk"
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/90 hover:bg-zinc-100 border border-zinc-200 text-zinc-700 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12">
          {/* Left: Product Studio Image & Specs */}
          <div className="md:col-span-6 bg-[#F4F5F7] p-6 sm:p-8 flex flex-col justify-between gap-6">
            <div className="aspect-[4/3] rounded-xl overflow-hidden bg-white border border-zinc-200/70">
              <ProductImage
                src={product.image}
                alt={product.name}
                brand={product.brand}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-2.5 text-xs text-zinc-600 border-t border-zinc-200 pt-4">
              <div className="flex justify-between gap-4">
                <span className="text-zinc-500">Material</span>
                <span className="font-medium text-zinc-900 text-right">{product.material}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-zinc-500">Warna</span>
                <span className="font-medium text-zinc-900 text-right">{product.colorway}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-zinc-500">Ketersediaan</span>
                <span className="font-medium text-emerald-700 text-right">
                  Stok Ukuran {selectedSize}: {availableStock} pasang
                </span>
              </div>
            </div>
          </div>

          {/* Right: Contiguous Purchase Module */}
          <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <span className="font-semibold text-zinc-800">{product.brand}</span>
                <span aria-hidden="true">·</span>
                <span>{product.category}</span>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1 tabular-nums text-zinc-700">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {product.rating.toFixed(1)} ({product.soldCount} terjual)
                </span>
              </div>

              <div>
                <h2
                  id="product-modal-title"
                  className="font-display text-2xl font-bold text-zinc-950 leading-tight"
                >
                  {product.name}
                </h2>
                <div className="mt-2.5 flex items-baseline gap-3">
                  <span className="font-mono text-2xl font-bold text-zinc-950 tabular-nums">
                    {formatIDR(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="font-mono text-sm text-zinc-400 line-through tabular-nums">
                      {formatIDR(product.originalPrice)}
                    </span>
                  )}
                </div>
              </div>

              <p className="text-sm text-zinc-600 leading-relaxed">{product.description}</p>

              {/* Size Selector 35–43 */}
              <div className="space-y-2.5 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-zinc-900">Pilih Ukuran (EU 35–43)</span>
                  <span className="text-zinc-500 font-mono tabular-nums">
                    Panjang kaki: {SIZE_CM_GUIDE[selectedSize]}
                  </span>
                </div>

                <div className="grid grid-cols-5 sm:grid-cols-9 md:grid-cols-5 gap-2">
                  {ALL_SIZES.map((size) => {
                    const active = selectedSize === size;
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => {
                          setSelectedSize(size);
                          setQuantity(1);
                        }}
                        className={`h-10 rounded-lg font-mono text-sm font-medium tabular-nums border transition-colors cursor-pointer ${
                          active
                            ? 'bg-zinc-950 text-white border-zinc-950'
                            : 'bg-white text-zinc-800 border-zinc-200 hover:border-zinc-900'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity Stepper */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-semibold text-zinc-900">Jumlah</span>
                <div className="inline-flex items-center border border-zinc-200 rounded-lg bg-zinc-50">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Kurangi jumlah"
                    className="w-9 h-9 flex items-center justify-center text-zinc-700 hover:text-zinc-950 cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center font-mono text-sm font-semibold tabular-nums">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(availableStock, q + 1))}
                    aria-label="Tambah jumlah"
                    className="w-9 h-9 flex items-center justify-center text-zinc-700 hover:text-zinc-950 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4 border-t border-zinc-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={handleAdd}
                  className="h-11 px-4 rounded-xl border border-zinc-950 text-zinc-950 text-sm font-semibold hover:bg-zinc-50 transition-colors flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                >
                  {justAdded ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Ditambahkan</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Tambah Keranjang</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => onBuyNow(product, selectedSize, quantity)}
                  className="h-11 px-4 rounded-xl bg-[#C81D4E] text-white text-sm font-semibold hover:bg-[#A8163F] transition-colors flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                >
                  <span>Beli Sekarang</span>
                </button>
              </div>

              <a
                href={whatsappInquiry}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-10 px-4 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 text-xs font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Tanya Ukuran {selectedSize} via WhatsApp</span>
              </a>

              <p className="text-[11px] text-zinc-500 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
                <span>Garansi tukar ukuran 3 hari di Cabang Lampu Merah Sunu</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
