import { useMemo } from 'react';
import { Search, SlidersHorizontal, Star, X } from 'lucide-react';
import { formatIDR } from '../data/shoes';
import { ALL_SIZES, Brand, ShoeCategory, ShoeProduct, ShoeSize } from '../types/store';
import { ProductImage } from './ProductImage';

interface ProductCatalogProps {
  products: ShoeProduct[];
  selectedBrand: Brand | 'ALL';
  onBrandChange: (brand: Brand | 'ALL') => void;
  selectedCategory: ShoeCategory | 'ALL';
  onCategoryChange: (cat: ShoeCategory | 'ALL') => void;
  selectedSize: ShoeSize | 'ALL';
  onSizeChange: (size: ShoeSize | 'ALL') => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  sortBy: 'popular' | 'price-asc' | 'price-desc';
  onSortChange: (sort: 'popular' | 'price-asc' | 'price-desc') => void;
  onSelectProduct: (product: ShoeProduct) => void;
}

const BRAND_TABS: { value: Brand | 'ALL'; label: string }[] = [
  { value: 'ALL', label: 'Semua Merek' },
  { value: 'Nike', label: 'Nike' },
  { value: 'Adidas', label: 'Adidas' },
  { value: 'Puma', label: 'Puma' },
];

const CATEGORIES: ShoeCategory[] = [
  'Sneakers Klasik',
  'Streetwear',
  'Lari & Olahraga',
  'Retro Lifestyle',
  'Chunky Sneakers',
];

export function ProductCatalog({
  products,
  selectedBrand,
  onBrandChange,
  selectedCategory,
  onCategoryChange,
  selectedSize,
  onSizeChange,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  onSelectProduct,
}: ProductCatalogProps) {
  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = products.filter((item) => {
      if (selectedBrand !== 'ALL' && item.brand !== selectedBrand) return false;
      if (selectedCategory !== 'ALL' && item.category !== selectedCategory) return false;
      if (selectedSize !== 'ALL' && !item.sizes.includes(selectedSize)) return false;
      if (
        q &&
        !item.name.toLowerCase().includes(q) &&
        !item.brand.toLowerCase().includes(q) &&
        !item.category.toLowerCase().includes(q) &&
        !item.colorway.toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });

    if (sortBy === 'price-asc') {
      return [...list].sort((a, b) => a.price - b.price);
    }
    if (sortBy === 'price-desc') {
      return [...list].sort((a, b) => b.price - a.price);
    }
    return [...list].sort((a, b) => b.soldCount - a.soldCount);
  }, [products, selectedBrand, selectedCategory, selectedSize, searchQuery, sortBy]);

  const hasActiveFilters =
    selectedBrand !== 'ALL' ||
    selectedCategory !== 'ALL' ||
    selectedSize !== 'ALL' ||
    searchQuery.trim() !== '';

  const resetFilters = () => {
    onBrandChange('ALL');
    onCategoryChange('ALL');
    onSizeChange('ALL');
    onSearchChange('');
  };

  return (
    <section id="katalog" className="py-14 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Heading & Brand Tabs */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2">
            <p className="text-xs font-medium text-zinc-500">
              Koleksi Pilihan · {products.length} Jenis Sepatu · Ukuran 35–43
            </p>
            <h2
              className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950"
              style={{ textWrap: 'balance' }}
            >
              Katalog Sepatu Muliana Shoes
            </h2>
          </div>

          {/* Interactive Brand Segmented Filter */}
          <div
            role="tablist"
            aria-label="Filter merek sepatu"
            className="inline-flex items-center p-1 bg-zinc-200/70 rounded-xl self-start lg:self-auto overflow-x-auto max-w-full"
          >
            {BRAND_TABS.map((tab) => {
              const active = selectedBrand === tab.value;
              return (
                <button
                  key={tab.value}
                  role="tab"
                  type="button"
                  aria-selected={active}
                  onClick={() => onBrandChange(tab.value)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    active
                      ? 'bg-white text-zinc-950 shadow-sm'
                      : 'text-zinc-600 hover:text-zinc-950'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Search, Category, Size 35–43, and Sort Controls */}
        <div className="bg-white border border-zinc-200/80 rounded-2xl p-4 sm:p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="md:col-span-5 relative">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Cari model, merek, atau warna sepatu..."
                aria-label="Cari sepatu"
                className="w-full h-11 pl-10 pr-9 rounded-xl border border-zinc-200 bg-zinc-50/70 text-sm text-zinc-950 placeholder:text-zinc-400 focus:bg-white focus:outline-none focus:border-zinc-900 transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  aria-label="Hapus pencarian"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category Select */}
            <div className="md:col-span-4">
              <select
                value={selectedCategory}
                onChange={(e) => onCategoryChange(e.target.value as ShoeCategory | 'ALL')}
                aria-label="Filter kategori sepatu"
                className="w-full h-11 px-3.5 rounded-xl border border-zinc-200 bg-zinc-50/70 text-sm text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-900 cursor-pointer"
              >
                <option value="ALL">Semua Kategori</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Select */}
            <div className="md:col-span-3">
              <select
                value={sortBy}
                onChange={(e) =>
                  onSortChange(e.target.value as 'popular' | 'price-asc' | 'price-desc')
                }
                aria-label="Urutkan produk"
                className="w-full h-11 px-3.5 rounded-xl border border-zinc-200 bg-zinc-50/70 text-sm text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-900 cursor-pointer"
              >
                <option value="popular">Urutkan: Terpopuler</option>
                <option value="price-asc">Harga: Terendah</option>
                <option value="price-desc">Harga: Tertinggi</option>
              </select>
            </div>
          </div>

          {/* Interactive Size Bar (35–43) */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-zinc-100">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 mr-2">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Ukuran:</span>
              </span>
              <button
                type="button"
                onClick={() => onSizeChange('ALL')}
                className={`h-8 px-3 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  selectedSize === 'ALL'
                    ? 'bg-zinc-950 text-white'
                    : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                }`}
              >
                Semua
              </button>
              {ALL_SIZES.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => onSizeChange(size)}
                  className={`h-8 w-9 rounded-lg text-xs font-mono font-medium tabular-nums transition-colors cursor-pointer ${
                    selectedSize === size
                      ? 'bg-[#C81D4E] text-white'
                      : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 text-xs text-zinc-500">
              <span className="tabular-nums">
                Menampilkan <strong className="text-zinc-900">{filteredProducts.length}</strong>{' '}
                sepatu
              </span>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-[#C81D4E] hover:underline font-medium cursor-pointer whitespace-nowrap shrink-0"
                >
                  Reset Filter
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Product Grid: 3 columns desktop, 2 tablet, 1 mobile */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white border border-zinc-200 rounded-2xl py-16 px-6 text-center space-y-3">
            <p className="font-display text-lg font-semibold text-zinc-900">
              Sepatu yang dicari belum ditemukan
            </p>
            <p className="text-sm text-zinc-500 max-w-md mx-auto">
              Coba ubah kata kunci pencarian atau pilih filter merek dan ukuran lainnya.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-2 inline-flex items-center justify-center h-10 px-5 rounded-lg bg-zinc-950 text-white text-sm font-medium hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              Tampilkan Semua Sepatu
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
            {filteredProducts.map((shoe) => (
              <article
                key={shoe.id}
                onClick={() => onSelectProduct(shoe)}
                className="group bg-white border border-zinc-200/80 rounded-2xl overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:border-zinc-300 cursor-pointer"
              >
                {/* 4:3 Uniform Studio Photography */}
                <div className="relative aspect-[4/3] bg-[#F1F2F4] overflow-hidden">
                  <ProductImage
                    src={shoe.image}
                    alt={shoe.name}
                    brand={shoe.brand}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                  {shoe.tag && (
                    <span className="absolute top-3.5 left-3.5 text-xs font-semibold text-zinc-900 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md">
                      {shoe.tag}
                    </span>
                  )}
                </div>

                {/* Uniform Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2 text-xs text-zinc-500">
                      <span className="font-semibold text-zinc-700">
                        {shoe.brand} · {shoe.category}
                      </span>
                      <span className="inline-flex items-center gap-1 tabular-nums text-zinc-600 shrink-0">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        {shoe.rating.toFixed(1)}
                      </span>
                    </div>

                    <h3 className="font-display text-base font-bold text-zinc-950 group-hover:text-[#C81D4E] transition-colors">
                      {shoe.name}
                    </h3>

                    <p className="text-xs text-zinc-500">
                      {shoe.colorway} · Ukuran 35–43
                    </p>
                  </div>

                  <div className="pt-3 border-t border-zinc-100 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-mono text-base font-semibold text-zinc-950 tabular-nums">
                        {formatIDR(shoe.price)}
                      </p>
                      {shoe.originalPrice && (
                        <p className="font-mono text-xs text-zinc-400 line-through tabular-nums">
                          {formatIDR(shoe.originalPrice)}
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectProduct(shoe);
                      }}
                      className="h-9 px-4 rounded-lg bg-zinc-950 text-white text-xs font-semibold group-hover:bg-[#C81D4E] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                    >
                      Pilih Ukuran
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
