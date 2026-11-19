import { Bell, BellRing, CheckCheck, CheckCircle2, PackageCheck, Truck, X } from 'lucide-react';
import { AppNotification } from '../types/store';

interface NotificationCenterProps {
  panelOpen: boolean;
  notifications: AppNotification[];
  toasts: AppNotification[];
  browserNotifEnabled: boolean;
  onClosePanel: () => void;
  onDismissToast: (id: string) => void;
  onMarkAllRead: () => void;
  onSelectNotification: (notification: AppNotification) => void;
  onRequestBrowserNotif: () => void;
}

function formatNotifTime(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export function NotificationCenter({
  panelOpen,
  notifications,
  toasts,
  browserNotifEnabled,
  onClosePanel,
  onDismissToast,
  onMarkAllRead,
  onSelectNotification,
  onRequestBrowserNotif,
}: NotificationCenterProps) {
  return (
    <>
      {/* Automatic Live Toast Stack (Top Right) */}
      {toasts.length > 0 && (
        <div
          aria-live="polite"
          className="fixed top-20 right-4 z-50 w-[calc(100vw-2rem)] max-w-sm space-y-2.5 pointer-events-none"
        >
          {toasts.map((toast) => {
            const isDelivered = toast.status === 'DELIVERED';
            return (
              <div
                key={toast.id}
                className="pointer-events-auto bg-white border border-zinc-200 rounded-2xl shadow-xl p-4 flex items-start gap-3 transition-all"
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    isDelivered
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-rose-50 text-[#C81D4E]'
                  }`}
                >
                  {isDelivered ? (
                    <PackageCheck className="w-5 h-5" />
                  ) : (
                    <Truck className="w-5 h-5" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-bold text-zinc-950 leading-snug">{toast.title}</p>
                    <button
                      type="button"
                      onClick={() => onDismissToast(toast.id)}
                      aria-label="Tutup notifikasi"
                      className="text-zinc-400 hover:text-zinc-700 cursor-pointer shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-zinc-600 mt-1 leading-relaxed">{toast.message}</p>
                  <div className="mt-2.5 flex items-center justify-between gap-2">
                    <span className="font-mono text-[11px] text-zinc-400 tabular-nums">
                      {toast.orderId} · {formatNotifTime(toast.timestamp)}
                    </span>
                    <button
                      type="button"
                      onClick={() => onSelectNotification(toast)}
                      className="text-xs font-semibold text-[#C81D4E] hover:underline cursor-pointer"
                    >
                      Lacak Pesanan
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Notification Inbox Drawer */}
      {panelOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-zinc-950/50 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-label="Pusat notifikasi pengiriman"
          onClick={onClosePanel}
        >
          <div
            className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl border-l border-zinc-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-zinc-200 flex items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-lg font-bold text-zinc-950">
                  Notifikasi Pengiriman
                </h2>
                <p className="text-xs text-zinc-500">
                  Pembaruan status otomatis dari setiap pesanan Anda.
                </p>
              </div>
              <button
                type="button"
                onClick={onClosePanel}
                aria-label="Tutup panel notifikasi"
                className="w-9 h-9 rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950 flex items-center justify-center cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Browser Notification Toggle Bar */}
            <div className="px-6 py-3 bg-zinc-50 border-b border-zinc-200 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-zinc-700">
                <BellRing className="w-4 h-4 text-[#C81D4E] shrink-0" />
                <span>
                  {browserNotifEnabled
                    ? 'Notifikasi browser aktif'
                    : 'Aktifkan notifikasi otomatis browser'}
                </span>
              </div>
              {!browserNotifEnabled && (
                <button
                  type="button"
                  onClick={onRequestBrowserNotif}
                  className="text-xs font-semibold text-[#C81D4E] hover:underline cursor-pointer whitespace-nowrap"
                >
                  Aktifkan
                </button>
              )}
            </div>

            {notifications.length > 0 && (
              <div className="px-6 py-2.5 border-b border-zinc-100 flex justify-end">
                <button
                  type="button"
                  onClick={onMarkAllRead}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-950 cursor-pointer"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Tandai semua dibaca</span>
                </button>
              </div>
            )}

            <div className="flex-1 overflow-y-auto divide-y divide-zinc-100">
              {notifications.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center px-6 py-12 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-400">
                    <Bell className="w-5 h-5" />
                  </div>
                  <p className="font-display text-sm font-semibold text-zinc-900">
                    Belum ada notifikasi pengiriman
                  </p>
                  <p className="text-xs text-zinc-500 max-w-xs">
                    Saat Anda membuat pesanan, setiap perubahan status pengiriman akan muncul
                    otomatis di sini.
                  </p>
                </div>
              ) : (
                notifications.map((item) => {
                  const isDelivered = item.status === 'DELIVERED';
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onSelectNotification(item)}
                      className={`w-full text-left px-6 py-4 hover:bg-zinc-50 transition-colors flex items-start gap-3 cursor-pointer ${
                        !item.read ? 'bg-rose-50/35' : 'bg-white'
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                          isDelivered
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-zinc-100 text-zinc-800'
                        }`}
                      >
                        {isDelivered ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <Truck className="w-4 h-4" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs font-bold text-zinc-950 truncate">{item.title}</p>
                          <span className="font-mono text-[11px] text-zinc-400 tabular-nums shrink-0">
                            {formatNotifTime(item.timestamp)}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-600 mt-1 leading-relaxed">{item.message}</p>
                        <p className="font-mono text-[11px] text-[#C81D4E] font-medium mt-1.5">
                          Pesanan {item.orderId} →
                        </p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
