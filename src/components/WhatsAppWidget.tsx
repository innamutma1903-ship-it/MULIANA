import { useState } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';
import { buildWhatsAppUrl, STORE_BRANCH, WHATSAPP_DISPLAY } from '../data/shoes';

const QUICK_TOPICS = [
  'Halo Admin, apakah stok ukuran 35–43 tersedia untuk Nike, Adidas, atau Puma?',
  'Halo Muliana Shoes, promo sepatu apa yang sedang berlaku hari ini?',
  'Halo Admin, boleh kirim petunjuk arah ke Cabang Lampu Merah Sunu?',
  'Halo Admin, saya ingin menanyakan status pengiriman pesanan saya.',
];

export function WhatsAppWidget() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState(
    'Halo Admin Muliana Shoes Cabang Lampu Merah Sunu, saya ingin tanya mengenai koleksi sepatu.'
  );

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
      {open && (
        <div
          role="dialog"
          aria-label="Chat WhatsApp Muliana Shoes"
          className="w-[calc(100vw-2.5rem)] max-w-sm bg-white rounded-2xl border border-zinc-200 shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="px-5 py-4 bg-emerald-700 text-white flex items-center justify-between gap-3">
            <div>
              <p className="font-display text-sm font-bold">Chat WhatsApp Muliana Shoes</p>
              <p className="text-xs text-emerald-100 mt-0.5">
                {STORE_BRANCH} · {WHATSAPP_DISPLAY}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Tutup jendela chat WhatsApp"
              className="w-8 h-8 rounded-lg hover:bg-emerald-600 flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 space-y-4">
            <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/80 text-xs text-zinc-700 leading-relaxed">
              Halo! Butuh rekomendasi ukuran (35–43), cek stok merek Nike, Adidas, Puma, atau bantu
              lacak pesanan? Pilih topik cepat atau tulis pesan Anda di bawah.
            </div>

            <div className="space-y-1.5">
              <p className="text-[11px] font-semibold text-zinc-500">Topik Cepat</p>
              <div className="space-y-1.5">
                {QUICK_TOPICS.map((topic) => (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => setMessage(topic)}
                    className="w-full text-left px-3 py-2 rounded-lg border border-zinc-200 hover:border-emerald-600 hover:bg-emerald-50/50 text-xs text-zinc-700 transition-colors cursor-pointer line-clamp-2"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="wa-message" className="block text-[11px] font-semibold text-zinc-500">
                Pesan Anda
              </label>
              <textarea
                id="wa-message"
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-3 rounded-xl border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:border-emerald-700 resize-none"
              />
              <a
                href={buildWhatsAppUrl(message.trim() || QUICK_TOPICS[0])}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Kirim ke WhatsApp ({WHATSAPP_DISPLAY})</span>
              </a>
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Buka chat WhatsApp Muliana Shoes"
        className="h-12 px-4 sm:px-5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg flex items-center gap-2.5 text-sm font-semibold transition-transform active:scale-95 cursor-pointer whitespace-nowrap"
      >
        <MessageCircle className="w-5 h-5" />
        <span>WhatsApp Kami</span>
      </button>
    </div>
  );
}
