import { useEffect, useMemo, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  Banknote,
  Building2,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Loader2,
  QrCode,
  ShieldCheck,
  Truck,
  X,
} from 'lucide-react';
import { COURIER_OPTIONS, formatIDR, generateQrisPayload, STORE_BRANCH } from '../data/shoes';
import { CartItem, PaymentMethod, UserAccount } from '../types/store';

interface CheckoutModalProps {
  open: boolean;
  user: UserAccount | null;
  items: CartItem[];
  onClose: () => void;
  onConfirmOrder: (payload: {
    recipientName: string;
    phone: string;
    address: string;
    city: string;
    courier: string;
    shippingFee: number;
    paymentMethod: PaymentMethod;
    qrisPayload?: string;
    referenceId: string;
  }) => void;
}

export function CheckoutModal({
  open,
  user,
  items,
  onClose,
  onConfirmOrder,
}: CheckoutModalProps) {
  const [step, setStep] = useState<'shipping' | 'payment'>('shipping');
  const [recipientName, setRecipientName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [courierId, setCourierId] = useState(COURIER_OPTIONS[0].id);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('QRIS');
  const [formError, setFormError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [qrisSecondsLeft, setQrisSecondsLeft] = useState(900);

  const referenceId = useMemo(
    () => `MS-${Date.now().toString().slice(-6)}`,
    // regenerate only when modal opens
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [open]
  );

  useEffect(() => {
    if (open && user) {
      setRecipientName(user.name);
      setPhone(user.phone);
      setAddress(user.address);
      setCity(user.city || 'Makassar');
      setStep('shipping');
      setPaymentMethod('QRIS');
      setFormError(null);
      setVerifying(false);
      setQrisSecondsLeft(900);
    }
  }, [open, user]);

  useEffect(() => {
    if (!open || step !== 'payment' || paymentMethod !== 'QRIS') return;
    const timer = setInterval(() => {
      setQrisSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [open, step, paymentMethod]);

  if (!open || !user) return null;

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const selectedCourier = COURIER_OPTIONS.find((c) => c.id === courierId) ?? COURIER_OPTIONS[0];
  const shippingFee = subtotal >= 750000 ? 0 : selectedCourier.fee;
  const total = subtotal + shippingFee;
  const qrisPayload = generateQrisPayload(referenceId, total);

  const minutes = String(Math.floor(qrisSecondsLeft / 60)).padStart(2, '0');
  const seconds = String(qrisSecondsLeft % 60).padStart(2, '0');

  const handleProceedToPayment = () => {
    if (!recipientName.trim() || !phone.trim() || !address.trim() || !city.trim()) {
      setFormError('Mohon lengkapi nama penerima, nomor WhatsApp, kota, dan alamat pengiriman.');
      return;
    }
    setFormError(null);
    setStep('payment');
  };

  const handleCopy = (text: string) => {
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 1800);
  };

  const handleCompletePayment = () => {
    setVerifying(true);
    setTimeout(() => {
      onConfirmOrder({
        recipientName: recipientName.trim(),
        phone: phone.trim(),
        address: address.trim(),
        city: city.trim(),
        courier: selectedCourier.name,
        shippingFee,
        paymentMethod,
        qrisPayload: paymentMethod === 'QRIS' ? qrisPayload : undefined,
        referenceId,
      });
      setVerifying(false);
    }, 900);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-zinc-950/65 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-modal-title"
    >
      <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-white rounded-2xl border border-zinc-200 shadow-2xl">
        {/* Top Bar */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm px-6 py-4 border-b border-zinc-200 flex items-center justify-between">
          <div>
            <h2 id="checkout-modal-title" className="font-display text-lg font-bold text-zinc-950">
              Checkout Pesanan
            </h2>
            <p className="text-xs text-zinc-500">
              Langkah {step === 'shipping' ? '1 dari 2 · Data Pengiriman' : '2 dari 2 · Pembayaran'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup checkout"
            className="w-9 h-9 rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950 flex items-center justify-center cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Step Progress Bar */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => !verifying && setStep('shipping')}
              className={`p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                step === 'shipping'
                  ? 'border-zinc-950 bg-zinc-950 text-white'
                  : 'border-zinc-200 bg-zinc-50 text-zinc-700'
              }`}
            >
              <p className="text-xs font-mono opacity-75">01</p>
              <p className="text-sm font-semibold">Alamat & Kurir</p>
            </button>
            <button
              type="button"
              onClick={() => !verifying && handleProceedToPayment()}
              className={`p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                step === 'payment'
                  ? 'border-[#C81D4E] bg-[#C81D4E] text-white'
                  : 'border-zinc-200 bg-zinc-50 text-zinc-700'
              }`}
            >
              <p className="text-xs font-mono opacity-75">02</p>
              <p className="text-sm font-semibold">Pembayaran (QRIS / Bank / COD)</p>
            </button>
          </div>

          {step === 'shipping' ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 space-y-4">
                {formError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
                    {formError}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-zinc-700">Nama Penerima</label>
                    <input
                      type="text"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:border-zinc-950"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-zinc-700">
                      No. WhatsApp Aktif
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:border-zinc-950"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-medium text-zinc-700">Kota / Kecamatan</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Contoh: Makassar — Tallo"
                    className="w-full h-11 px-3.5 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:border-zinc-950"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-medium text-zinc-700">Alamat Lengkap</label>
                  <textarea
                    rows={3}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Nama jalan, nomor rumah, RT/RW, dan patokan terdekat"
                    className="w-full p-3.5 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:border-zinc-950 resize-none"
                  />
                </div>

                <div className="space-y-2 pt-1">
                  <p className="text-xs font-semibold text-zinc-900 flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-zinc-500" />
                    <span>Pilih Layanan Pengiriman</span>
                  </p>
                  <div className="space-y-2">
                    {COURIER_OPTIONS.map((courier) => {
                      const active = courierId === courier.id;
                      return (
                        <button
                          key={courier.id}
                          type="button"
                          onClick={() => setCourierId(courier.id)}
                          className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between gap-3 transition-colors cursor-pointer ${
                            active
                              ? 'border-zinc-950 bg-zinc-50'
                              : 'border-zinc-200 hover:border-zinc-300'
                          }`}
                        >
                          <div>
                            <p className="text-sm font-semibold text-zinc-950">{courier.name}</p>
                            <p className="text-xs text-zinc-500">{courier.eta}</p>
                          </div>
                          <span className="font-mono text-sm font-semibold text-zinc-900 tabular-nums shrink-0">
                            {subtotal >= 750000 ? 'Gratis' : formatIDR(courier.fee)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-5 bg-zinc-50 border border-zinc-200/80 rounded-2xl p-5 flex flex-col justify-between gap-5">
                <div className="space-y-3">
                  <h3 className="font-display text-sm font-bold text-zinc-950">
                    Ringkasan Belanja ({items.reduce((s, i) => s + i.quantity, 0)} pasang)
                  </h3>
                  <ul className="divide-y divide-zinc-200/70 max-h-56 overflow-y-auto pr-1">
                    {items.map((item) => (
                      <li key={item.key} className="py-2.5 flex justify-between gap-3 text-xs">
                        <div className="min-w-0">
                          <p className="font-semibold text-zinc-900 truncate">{item.name}</p>
                          <p className="text-zinc-500">
                            Uk. {item.size} × {item.quantity}
                          </p>
                        </div>
                        <span className="font-mono font-medium text-zinc-900 tabular-nums shrink-0">
                          {formatIDR(item.price * item.quantity)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2.5 pt-3 border-t border-zinc-200 text-sm">
                  <div className="flex justify-between text-zinc-600">
                    <span>Subtotal</span>
                    <span className="font-mono tabular-nums">{formatIDR(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-600">
                    <span>Ongkos Kirim</span>
                    <span className="font-mono tabular-nums">
                      {shippingFee === 0 ? 'Gratis' : formatIDR(shippingFee)}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-zinc-950 pt-2 border-t border-zinc-200">
                    <span>Total Bayar</span>
                    <span className="font-mono text-base tabular-nums">{formatIDR(total)}</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleProceedToPayment}
                    className="w-full h-11 mt-3 rounded-xl bg-[#C81D4E] text-white text-sm font-semibold hover:bg-[#A8163F] transition-colors cursor-pointer"
                  >
                    Pilih Metode Pembayaran
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Step 2: Payment Method & Live QRIS Code */
            <div className="space-y-6">
              {/* Payment Method Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('QRIS')}
                  className={`p-4 rounded-xl border text-left transition-colors cursor-pointer ${
                    paymentMethod === 'QRIS'
                      ? 'border-[#C81D4E] bg-rose-50/40'
                      : 'border-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  <QrCode className="w-5 h-5 text-[#C81D4E] mb-2" />
                  <p className="text-sm font-bold text-zinc-950">QRIS Instan</p>
                  <p className="text-xs text-zinc-500 mt-0.5">Scan QR semua e-wallet & bank</p>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('TRANSFER')}
                  className={`p-4 rounded-xl border text-left transition-colors cursor-pointer ${
                    paymentMethod === 'TRANSFER'
                      ? 'border-zinc-950 bg-zinc-50'
                      : 'border-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  <Building2 className="w-5 h-5 text-zinc-800 mb-2" />
                  <p className="text-sm font-bold text-zinc-950">Transfer Bank</p>
                  <p className="text-xs text-zinc-500 mt-0.5">Virtual Account BCA / BRI</p>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('COD')}
                  className={`p-4 rounded-xl border text-left transition-colors cursor-pointer ${
                    paymentMethod === 'COD'
                      ? 'border-zinc-950 bg-zinc-50'
                      : 'border-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  <Banknote className="w-5 h-5 text-zinc-800 mb-2" />
                  <p className="text-sm font-bold text-zinc-950">COD (Bayar di Tempat)</p>
                  <p className="text-xs text-zinc-500 mt-0.5">Bayar tunai saat paket tiba</p>
                </button>
              </div>

              {/* Payment Panel Detail */}
              {paymentMethod === 'QRIS' && (
                <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-5 sm:p-6">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    {/* Authentic Scannable QRIS Code Card */}
                    <div className="md:col-span-5 flex flex-col items-center">
                      <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-xs w-full max-w-[260px] flex flex-col items-center text-center">
                        <div className="w-full flex items-center justify-between pb-3 mb-3 border-b border-zinc-100">
                          <span className="font-display font-extrabold text-sm tracking-tight text-[#C81D4E]">
                            QRIS
                          </span>
                          <span className="font-mono text-[10px] text-zinc-500">
                            GPN · BI Standard
                          </span>
                        </div>

                        <p className="text-xs font-bold text-zinc-950">MULIANA SHOES SUNU</p>
                        <p className="font-mono text-[10px] text-zinc-500 mb-3">
                          NMID: ID1026074892154
                        </p>

                        <div className="p-2.5 bg-white border border-zinc-200 rounded-xl">
                          <QRCodeSVG
                            value={qrisPayload}
                            size={180}
                            level="M"
                            bgColor="#FFFFFF"
                            fgColor="#111318"
                          />
                        </div>

                        <p className="font-mono text-sm font-bold text-zinc-950 tabular-nums mt-3">
                          {formatIDR(total)}
                        </p>
                        <p className="font-mono text-[10px] text-zinc-500 mt-0.5">
                          Ref: {referenceId}
                        </p>
                      </div>
                    </div>

                    {/* QRIS Payment Instructions */}
                    <div className="md:col-span-7 space-y-4">
                      <div className="flex items-center justify-between gap-3 pb-3 border-b border-zinc-200">
                        <div>
                          <p className="text-xs text-zinc-500">Total Pembayaran QRIS</p>
                          <p className="font-mono text-2xl font-bold text-zinc-950 tabular-nums">
                            {formatIDR(total)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-zinc-500 flex items-center justify-end gap-1">
                            <Clock className="w-3.5 h-3.5 text-[#C81D4E]" />
                            <span>Batas waktu</span>
                          </p>
                          <p className="font-mono text-base font-bold text-[#C81D4E] tabular-nums">
                            {minutes}:{seconds}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2 text-xs text-zinc-600 leading-relaxed">
                        <p className="font-semibold text-zinc-900">Cara bayar dengan QRIS:</p>
                        <ol className="list-decimal pl-4 space-y-1">
                          <li>
                            Buka aplikasi GoPay, OVO, DANA, ShopeePay, LinkAja, atau Mobile Banking
                            Anda.
                          </li>
                          <li>
                            Pilih menu <strong>Scan QR / QRIS</strong> lalu arahkan kamera ke kode
                            QR di samping.
                          </li>
                          <li>
                            Pastikan nama merchant <strong>MULIANA SHOES SUNU</strong> ({STORE_BRANCH}
                            ) dan nominal sudah sesuai, lalu selesaikan pembayaran.
                          </li>
                        </ol>
                      </div>

                      <div className="flex flex-wrap items-center gap-2.5 pt-1">
                        <button
                          type="button"
                          onClick={() => handleCopy(qrisPayload)}
                          className="h-9 px-3.5 rounded-lg border border-zinc-300 bg-white hover:bg-zinc-100 text-xs font-medium text-zinc-800 inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          {copiedCode ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Kode QRIS Disalin</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Salin Kode QRIS</span>
                            </>
                          )}
                        </button>
                        <span className="text-[11px] text-zinc-500">
                          GoPay · OVO · DANA · ShopeePay · BCA · BRI · Mandiri
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'TRANSFER' && (
                <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-5 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs text-zinc-500">Virtual Account Bank BRI / BCA</p>
                      <p className="font-mono text-xl font-bold text-zinc-950 tabular-nums mt-0.5">
                        8807 0857 5685 0861
                      </p>
                      <p className="text-xs text-zinc-600 mt-1">
                        a.n. Toko Muliana Shoes ({STORE_BRANCH})
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy('8807085756850861')}
                      className="h-9 px-3.5 rounded-lg border border-zinc-300 bg-white hover:bg-zinc-100 text-xs font-medium text-zinc-800 inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCode ? 'Tersalin' : 'Salin Nomor VA'}</span>
                    </button>
                  </div>
                  <p className="text-xs text-zinc-600 pt-2 border-t border-zinc-200">
                    Total transfer tepat:{' '}
                    <strong className="font-mono text-zinc-950 tabular-nums">{formatIDR(total)}</strong>
                  </p>
                </div>
              )}

              {paymentMethod === 'COD' && (
                <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-5 space-y-2">
                  <p className="text-sm font-semibold text-zinc-950">
                    Bayar Tunai di Tempat (Cash on Delivery)
                  </p>
                  <p className="text-xs text-zinc-600 leading-relaxed">
                    Siapkan uang pas sebesar{' '}
                    <strong className="font-mono text-zinc-950 tabular-nums">{formatIDR(total)}</strong>{' '}
                    untuk diserahkan langsung kepada kurir {selectedCourier.name} saat paket sepatu
                    tiba di <strong>{address}, {city}</strong>.
                  </p>
                </div>
              )}

              {/* Confirm CTA Row */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-zinc-200">
                <button
                  type="button"
                  disabled={verifying}
                  onClick={() => setStep('shipping')}
                  className="w-full sm:w-auto h-11 px-5 rounded-xl border border-zinc-300 text-sm font-medium text-zinc-700 hover:bg-zinc-50 cursor-pointer disabled:opacity-50"
                >
                  Kembali
                </button>

                <button
                  type="button"
                  disabled={verifying}
                  onClick={handleCompletePayment}
                  className="w-full sm:w-auto h-12 px-7 rounded-xl bg-[#C81D4E] text-white text-sm font-semibold hover:bg-[#A8163F] transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  {verifying ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Memverifikasi Pembayaran...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>
                        {paymentMethod === 'QRIS'
                          ? 'Saya Sudah Scan & Bayar QRIS'
                          : paymentMethod === 'TRANSFER'
                            ? 'Konfirmasi Transfer & Buat Pesanan'
                            : 'Buat Pesanan COD Sekarang'}
                      </span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-[11px] text-zinc-500 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
                <span>
                  Setelah pesanan dibuat, notifikasi pembaruan pengiriman berjalan otomatis hingga
                  paket tiba.
                </span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
