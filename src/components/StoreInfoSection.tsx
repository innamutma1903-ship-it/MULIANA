import { BellRing, Clock, MapPin, MessageCircle, QrCode, ShieldCheck } from 'lucide-react';
import { buildWhatsAppUrl, STORE_BRANCH, WHATSAPP_DISPLAY } from '../data/shoes';

export function StoreInfoSection() {
  return (
    <>
      <section id="lokasi" className="border-t border-zinc-200/80 bg-white py-14 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* 4 Storefront Trust Advantages */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-2.5">
              <QrCode className="w-5 h-5 text-[#C81D4E]" strokeWidth={1.8} />
              <h3 className="font-display text-base font-bold text-zinc-950">
                Pembayaran QRIS Instan
              </h3>
              <p className="text-sm text-zinc-600 leading-relaxed">
                Kode QRIS muncul otomatis sesuai total pesanan. Mendukung semua aplikasi e-wallet
                dan mobile banking Indonesia.
              </p>
            </div>

            <div className="space-y-2.5">
              <BellRing className="w-5 h-5 text-[#C81D4E]" strokeWidth={1.8} />
              <h3 className="font-display text-base font-bold text-zinc-950">
                Notifikasi Kirim Otomatis
              </h3>
              <p className="text-sm text-zinc-600 leading-relaxed">
                Setiap perubahan tahap pengiriman mulai dikemas hingga paket tiba langsung mengirim
                notifikasi otomatis ke layar Anda.
              </p>
            </div>

            <div className="space-y-2.5">
              <ShieldCheck className="w-5 h-5 text-[#C81D4E]" strokeWidth={1.8} />
              <h3 className="font-display text-base font-bold text-zinc-950">
                Kualitas Bagus & Nyaman
              </h3>
              <p className="text-sm text-zinc-600 leading-relaxed">
                Pilihan ukuran lengkap 35–43 untuk koleksi Nike, Adidas, dan Puma dengan kualitas
                bahan nyaman dan garansi tukar ukuran 3 hari.
              </p>
            </div>

            <div className="space-y-2.5">
              <MessageCircle className="w-5 h-5 text-[#C81D4E]" strokeWidth={1.8} />
              <h3 className="font-display text-base font-bold text-zinc-950">
                Respon Cepat WhatsApp
              </h3>
              <p className="text-sm text-zinc-600 leading-relaxed">
                Bingung memilih ukuran kaki? Hubungi tim toko langsung di{' '}
                <span className="font-mono text-zinc-900">{WHATSAPP_DISPLAY}</span> setiap hari.
              </p>
            </div>
          </div>

          {/* Physical Branch Banner */}
          <div className="bg-[#FAFAFA] border border-zinc-200/80 rounded-2xl p-6 sm:p-8 lg:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2.5 max-w-2xl">
              <p className="text-xs font-semibold text-[#C81D4E]">
                Kunjungi Toko Fisik Kami · {STORE_BRANCH}
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-zinc-950 tracking-tight">
                Mampir langsung ke Toko Muliana Shoes sekarang juga.
              </h2>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-1 text-sm text-zinc-600">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-zinc-400 shrink-0" />
                  <span>Jl. Sunu — {STORE_BRANCH}, Makassar</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-zinc-400 shrink-0" />
                  <span>Buka Setiap Hari · 09.00 – 21.30 WITA</span>
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <a
                href={buildWhatsAppUrl(
                  'Halo Muliana Shoes, saya mau tanya alamat lengkap Cabang Lampu Merah Sunu dan jam buka hari ini.'
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="h-11 px-5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white text-sm font-semibold transition-colors inline-flex items-center gap-2 whitespace-nowrap"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Hubungi {WHATSAPP_DISPLAY}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-zinc-200/80 bg-[#FAFAFA] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>
            © {new Date().getFullYear()} <strong className="text-zinc-900">Muliana Shoes</strong> ·{' '}
            {STORE_BRANCH}. Semua hak dilindungi.
          </p>
          <div className="flex items-center gap-5">
            <a href="#beranda" className="hover:text-zinc-900 transition-colors">
              Beranda
            </a>
            <a href="#katalog" className="hover:text-zinc-900 transition-colors">
              Katalog
            </a>
            <a
              href={buildWhatsAppUrl('Halo Admin Muliana Shoes, saya ingin bertanya tentang sepatu.')}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-900 transition-colors"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
