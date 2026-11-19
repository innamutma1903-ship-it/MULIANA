import { useState } from 'react';
import {
  CheckCircle2,
  FastForward,
  MapPin,
  MessageCircle,
  Package,
  Pause,
  Play,
  QrCode,
  Star,
  Truck,
  X,
} from 'lucide-react';
import { buildWhatsAppUrl, formatIDR, SHIPPING_STAGES } from '../data/shoes';
import { Order } from '../types/store';
import { ProductImage } from './ProductImage';

interface OrdersPanelProps {
  open: boolean;
  orders: Order[];
  highlightedOrderId: string | null;
  onClose: () => void;
  onAdvanceOrderStatus: (orderId: string) => void;
  onToggleAutoProgress: (orderId: string) => void;
  onConfirmReceived: (orderId: string, rating: number) => void;
}

function formatTime(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

function formatDate(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function OrdersPanel({
  open,
  orders,
  highlightedOrderId,
  onClose,
  onAdvanceOrderStatus,
  onToggleAutoProgress,
  onConfirmReceived,
}: OrdersPanelProps) {
  const [selectedRatings, setSelectedRatings] = useState<Record<string, number>>({});

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-zinc-950/60 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-label="Pesanan saya dan pelacakan pengiriman"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-[#FAFAFA] h-full flex flex-col shadow-2xl border-l border-zinc-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-white border-b border-zinc-200 flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-bold text-zinc-950">
              Pesanan Saya & Pelacakan Pengiriman
            </h2>
            <p className="text-xs text-zinc-500">
              Notifikasi terkirim otomatis setiap kali status pengiriman diperbarui hingga paket
              tiba.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup daftar pesanan"
            className="w-9 h-9 rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950 flex items-center justify-center cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Orders List */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {orders.length === 0 ? (
            <div className="bg-white border border-zinc-200 rounded-2xl py-16 px-6 text-center space-y-3">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-400">
                <Package className="w-6 h-6" />
              </div>
              <p className="font-display text-base font-semibold text-zinc-900">
                Belum ada pesanan aktif
              </p>
              <p className="text-sm text-zinc-500 max-w-sm mx-auto">
                Buat pesanan sepatu Nike, Adidas, atau Puma Anda untuk melihat pelacakan paket dan
                notifikasi pengiriman otomatis.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-2 h-10 px-5 rounded-lg bg-[#C81D4E] text-white text-sm font-semibold hover:bg-[#A8163F] transition-colors cursor-pointer"
              >
                Mulai Belanja
              </button>
            </div>
          ) : (
            orders.map((order) => {
              const currentStageIndex = SHIPPING_STAGES.findIndex((s) => s.status === order.status);
              const isDelivered = order.status === 'DELIVERED';
              const isHighlighted = highlightedOrderId === order.id;
              const currentRating = selectedRatings[order.id] ?? 5;

              const waTrackUrl = buildWhatsAppUrl(
                `Halo Admin Muliana Shoes Cabang Lampu Merah Sunu, saya ingin menanyakan pesanan ${order.id} (Resi: ${order.trackingNumber}) atas nama ${order.recipientName}.`
              );

              return (
                <article
                  key={order.id}
                  className={`bg-white rounded-2xl border overflow-hidden transition-shadow ${
                    isHighlighted
                      ? 'border-[#C81D4E] ring-2 ring-[#C81D4E]/15 shadow-md'
                      : 'border-zinc-200'
                  }`}
                >
                  {/* Order Top Summary */}
                  <div className="px-5 py-4 border-b border-zinc-100 flex flex-wrap items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                        <span className="font-mono font-bold text-zinc-950">{order.id}</span>
                        <span aria-hidden="true">·</span>
                        <span>{formatDate(order.createdAt)}</span>
                        <span aria-hidden="true">·</span>
                        <span className="inline-flex items-center gap-1 font-medium text-zinc-700">
                          {order.paymentMethod === 'QRIS' && <QrCode className="w-3.5 h-3.5 text-[#C81D4E]" />}
                          {order.paymentMethod}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500">
                        {order.courier} · Resi{' '}
                        <span className="font-mono font-medium text-zinc-800">
                          {order.trackingNumber}
                        </span>
                      </p>
                    </div>

                    <div className="text-right">
                      <p
                        className={`text-xs font-semibold ${
                          isDelivered ? 'text-emerald-700' : 'text-[#C81D4E]'
                        }`}
                      >
                        {SHIPPING_STAGES[currentStageIndex]?.label}
                      </p>
                      <p className="font-mono text-sm font-bold text-zinc-950 tabular-nums">
                        {formatIDR(order.total)}
                      </p>
                    </div>
                  </div>

                  {/* Ordered Shoes */}
                  <div className="px-5 py-3.5 bg-zinc-50/70 border-b border-zinc-100 space-y-2.5">
                    {order.items.map((item) => (
                      <div key={item.key} className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-white border border-zinc-200 overflow-hidden shrink-0">
                          <ProductImage
                            src={item.image}
                            alt={item.name}
                            brand={item.brand}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-zinc-900 truncate">{item.name}</p>
                          <p className="text-xs text-zinc-500">
                            {item.brand} · Ukuran <span className="font-mono">{item.size}</span> ×{' '}
                            {item.quantity}
                          </p>
                        </div>
                        <span className="font-mono text-xs font-semibold text-zinc-800 tabular-nums">
                          {formatIDR(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Step Progress Bar (6 Stages) */}
                  <div className="p-5 space-y-5">
                    {/* Auto Update Bar & Manual Step Control */}
                    {!isDelivered && (
                      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80">
                        <div className="text-xs text-zinc-700">
                          <p className="font-semibold text-zinc-900 flex items-center gap-1.5">
                            <Truck className="w-4 h-4 text-[#C81D4E]" />
                            <span>
                              {order.autoProgress
                                ? 'Pembaruan Status Otomatis Aktif (tiap 7 detik)'
                                : 'Pembaruan Otomatis Dijeda'}
                            </span>
                          </p>
                          <p className="text-zinc-500 mt-0.5">
                            Tahap {currentStageIndex + 1} dari {SHIPPING_STAGES.length} menuju paket
                            tiba
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onToggleAutoProgress(order.id)}
                            className="h-8 px-3 rounded-lg border border-zinc-300 bg-white hover:bg-zinc-100 text-xs font-medium text-zinc-800 inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                          >
                            {order.autoProgress ? (
                              <>
                                <Pause className="w-3.5 h-3.5" />
                                <span>Jeda</span>
                              </>
                            ) : (
                              <>
                                <Play className="w-3.5 h-3.5" />
                                <span>Lanjutkan</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => onAdvanceOrderStatus(order.id)}
                            className="h-8 px-3 rounded-lg bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-medium inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                          >
                            <FastForward className="w-3.5 h-3.5" />
                            <span>Status Berikutnya</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Horizontal Stage Indicator */}
                    <div className="grid grid-cols-6 gap-1.5">
                      {SHIPPING_STAGES.map((stage, idx) => {
                        const completed = idx <= currentStageIndex;
                        return (
                          <div key={stage.status} className="space-y-1.5">
                            <div
                              className={`h-1.5 rounded-full transition-colors ${
                                completed
                                  ? isDelivered
                                    ? 'bg-emerald-600'
                                    : 'bg-[#C81D4E]'
                                  : 'bg-zinc-200'
                              }`}
                            />
                            <p
                              className={`text-[10px] leading-tight truncate ${
                                completed ? 'font-semibold text-zinc-900' : 'text-zinc-400'
                              }`}
                              title={stage.label}
                            >
                              {stage.shortLabel}
                            </p>
                          </div>
                        );
                      })}
                    </div>

                    {/* Detailed Vertical Timeline */}
                    <div className="space-y-3 pt-1">
                      {[...order.timeline].reverse().map((event, idx) => {
                        const isLatest = idx === 0;
                        return (
                          <div key={`${event.status}-${event.timestamp}`} className="flex gap-3">
                            <div className="flex flex-col items-center pt-1">
                              <div
                                className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                                  isLatest
                                    ? isDelivered
                                      ? 'bg-emerald-600'
                                      : 'bg-[#C81D4E]'
                                    : 'bg-zinc-300'
                                }`}
                              />
                              {idx < order.timeline.length - 1 && (
                                <div className="w-px flex-1 bg-zinc-200 my-1" />
                              )}
                            </div>
                            <div className="pb-2 min-w-0 flex-1">
                              <div className="flex flex-wrap items-baseline justify-between gap-2">
                                <p
                                  className={`text-xs font-semibold ${
                                    isLatest ? 'text-zinc-950' : 'text-zinc-600'
                                  }`}
                                >
                                  {event.label}
                                </p>
                                <span className="font-mono text-[11px] text-zinc-400 tabular-nums">
                                  {formatTime(event.timestamp)}
                                </span>
                              </div>
                              <p className="text-xs text-zinc-600 mt-0.5 leading-relaxed">
                                {event.description}
                              </p>
                              <p className="text-[11px] text-zinc-400 mt-0.5 flex items-center gap-1">
                                <MapPin className="w-3 h-3 shrink-0" />
                                <span className="truncate">{event.location}</span>
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Delivered Confirmation & Rating Box */}
                    {isDelivered && (
                      <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-3">
                        <div className="flex items-start gap-2.5">
                          <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-bold text-emerald-950">
                              Paket Telah Tiba di Alamat Tujuan
                            </p>
                            <p className="text-xs text-emerald-800 mt-0.5">
                              Diterima di {order.address}, {order.city} atas nama{' '}
                              {order.recipientName}.
                            </p>
                          </div>
                        </div>

                        {order.receivedConfirmed ? (
                          <div className="pt-2 border-t border-emerald-200/80 flex items-center justify-between text-xs text-emerald-900">
                            <span className="font-medium">Pesanan selesai & dikonfirmasi</span>
                            <span className="inline-flex items-center gap-1 font-mono font-semibold">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              {order.customerRating}/5
                            </span>
                          </div>
                        ) : (
                          <div className="pt-2 border-t border-emerald-200/80 flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() =>
                                    setSelectedRatings((prev) => ({ ...prev, [order.id]: star }))
                                  }
                                  aria-label={`Beri ${star} bintang`}
                                  className="p-0.5 cursor-pointer"
                                >
                                  <Star
                                    className={`w-5 h-5 ${
                                      star <= currentRating
                                        ? 'fill-amber-400 text-amber-400'
                                        : 'text-emerald-300'
                                    }`}
                                  />
                                </button>
                              ))}
                            </div>
                            <button
                              type="button"
                              onClick={() => onConfirmReceived(order.id, currentRating)}
                              className="h-9 px-4 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold transition-colors cursor-pointer"
                            >
                              Konfirmasi Paket Diterima
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Recipient & WhatsApp Help Footer */}
                    <div className="pt-3 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-500">
                      <span className="truncate max-w-xs">
                        Tujuan: <strong className="text-zinc-800">{order.recipientName}</strong> (
                        {order.city})
                      </span>
                      <a
                        href={waTrackUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-emerald-700 hover:text-emerald-800 font-semibold whitespace-nowrap shrink-0"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Hubungi Admin WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
