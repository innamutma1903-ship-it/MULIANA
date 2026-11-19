import { useRef, useState } from 'react';
import { ArrowDownRight, MessageCircle, Pause, Play, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { buildWhatsAppUrl, PROMO_VIDEO_PATH, STORE_BRANCH } from '../data/shoes';

interface HeroSectionProps {
  onSelectBrand: (brand: 'Nike' | 'Adidas' | 'Puma') => void;
}

export function HeroSection({ onSelectBrand }: HeroSectionProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  const togglePlay = () => {
    const vid = videoRef.current;
    if (!vid) return;
    if (vid.paused) {
      vid.play().catch(() => {});
      setIsPlaying(true);
    } else {
      vid.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.muted = !vid.muted;
    setIsMuted(vid.muted);
  };

  const handleReplay = () => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.currentTime = 0;
    vid.play().catch(() => {});
    setIsPlaying(true);
  };

  const scrollToCatalog = (brand?: 'Nike' | 'Adidas' | 'Puma') => {
    if (brand) {
      onSelectBrand(brand);
    }
    const el = document.getElementById('katalog');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="beranda" className="border-b border-zinc-200/80 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Editorial Storefront Headline & Direct Value */}
          <div className="lg:col-span-7 space-y-7">
            <div className="space-y-4">
              <p className="text-xs sm:text-sm font-medium text-zinc-500 flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="text-[#C81D4E] font-semibold">Toko Muliana Shoes</span>
                <span aria-hidden="true">·</span>
                <span>{STORE_BRANCH}</span>
                <span aria-hidden="true">·</span>
                <span>Ukuran Lengkap 35–43</span>
              </p>

              <h1
                className="font-display font-extrabold tracking-tight text-zinc-950 leading-[1.1] max-w-2xl"
                style={{ fontSize: 'clamp(2.25rem, 4vw, 3.65rem)', textWrap: 'balance' }}
              >
                Sepatu keren, nyaman, dan harga bersahabat.
              </h1>

              <p className="text-base sm:text-lg text-zinc-600 leading-relaxed max-w-xl">
                Pilihan lengkap koleksi <strong className="font-semibold text-zinc-900">Nike</strong>,{' '}
                <strong className="font-semibold text-zinc-900">Adidas</strong>, dan{' '}
                <strong className="font-semibold text-zinc-900">Puma</strong> dengan kualitas
                terjamin, bahan nyaman, dan desain kekinian. Bayar praktis pakai QRIS instan dan
                pantau pengiriman otomatis hingga paket tiba di rumah.
              </p>
            </div>

            {/* Primary & Secondary CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <button
                type="button"
                onClick={() => scrollToCatalog()}
                className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl bg-[#C81D4E] text-white text-sm sm:text-base font-semibold hover:bg-[#A8163F] transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <span>Belanja Katalog</span>
                <ArrowDownRight className="w-4 h-4" />
              </button>

              <a
                href={buildWhatsAppUrl(
                  'Halo Admin Muliana Shoes Cabang Lampu Merah Sunu, saya mau tanya stok sepatu ukuran 35–43.'
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 h-12 px-5 rounded-xl border border-zinc-300 bg-white text-zinc-900 text-sm sm:text-base font-medium hover:bg-zinc-50 hover:border-zinc-400 transition-colors whitespace-nowrap shrink-0"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Chat WhatsApp</span>
              </a>
            </div>

            {/* Quick Brand Jump Row */}
            <div className="pt-4 border-t border-zinc-200/80 space-y-3">
              <p className="text-xs font-medium text-zinc-500">Pilih langsung berdasarkan merek</p>
              <div className="flex flex-wrap items-center gap-2.5">
                {(['Nike', 'Adidas', 'Puma'] as const).map((brand) => (
                  <button
                    key={brand}
                    type="button"
                    onClick={() => scrollToCatalog(brand)}
                    className="px-4 py-2 rounded-lg bg-zinc-100 hover:bg-zinc-950 hover:text-white text-zinc-900 text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    Koleksi {brand}
                  </button>
                ))}
              </div>
            </div>

            {/* Quiet Unboxed Value Pillars */}
            <div className="grid grid-cols-3 gap-6 pt-2 max-w-lg">
              <div>
                <p className="font-mono text-xl sm:text-2xl font-semibold text-zinc-950 tabular-nums">
                  12+
                </p>
                <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">Model Sepatu Pilihan</p>
              </div>
              <div>
                <p className="font-mono text-xl sm:text-2xl font-semibold text-zinc-950 tabular-nums">
                  35–43
                </p>
                <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">Rentang Ukuran Lengkap</p>
              </div>
              <div>
                <p className="font-mono text-xl sm:text-2xl font-semibold text-zinc-950 tabular-nums">
                  QRIS
                </p>
                <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">Bayar Scan Instan</p>
              </div>
            </div>
          </div>

          {/* Right Column: Official Promotional Video Showcase (9:16 Vertical Frame — No Storyboard) */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[330px] sm:max-w-[350px] aspect-[9/16] rounded-2xl overflow-hidden bg-zinc-950 shadow-xl border border-zinc-200">
              <video
                ref={videoRef}
                src={PROMO_VIDEO_PATH}
                autoPlay
                loop
                muted={isMuted}
                playsInline
                onClick={togglePlay}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                className="w-full h-full object-cover cursor-pointer"
                aria-label="Video promosi resmi Toko Muliana Shoes Cabang Lampu Merah Sunu"
              />

              {/* Subtle Bottom Scrim for Legible Controls */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black/80 via-black/35 to-transparent" />

              {/* Top-Right Compact Sound & Replay Controls */}
              <div className="absolute top-3.5 right-3.5 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleReplay}
                  aria-label="Putar ulang video promosi"
                  className="w-9 h-9 rounded-full bg-black/55 hover:bg-black/80 text-white backdrop-blur-sm flex items-center justify-center transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={toggleMute}
                  aria-label={isMuted ? 'Nyalakan suara video' : 'Bisukan suara video'}
                  className="h-9 px-3 rounded-full bg-black/55 hover:bg-black/80 text-white backdrop-blur-sm flex items-center gap-1.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  {isMuted ? (
                    <>
                      <VolumeX className="w-4 h-4" />
                      <span>Suara</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4" />
                      <span>Aktif</span>
                    </>
                  )}
                </button>
              </div>

              {/* Bottom Caption & Play/Pause Control */}
              <div className="absolute inset-x-0 bottom-0 p-4 flex items-end justify-between gap-3">
                <div className="text-white min-w-0">
                  <p className="text-xs text-white/80 font-medium">Video Promosi Resmi</p>
                  <p className="text-sm font-semibold truncate">
                    Muliana Shoes · Lampu Merah Sunu
                  </p>
                </div>

                <button
                  type="button"
                  onClick={togglePlay}
                  aria-label={isPlaying ? 'Jeda video promosi' : 'Putar video promosi'}
                  className="w-10 h-10 rounded-full bg-white text-zinc-950 hover:bg-zinc-100 flex items-center justify-center transition-transform active:scale-95 cursor-pointer shrink-0 shadow-sm"
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4 fill-current" />
                  ) : (
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
