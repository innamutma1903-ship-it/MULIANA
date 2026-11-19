import { ALL_SIZES, ShippingStatus, ShoeProduct, ShoeSize } from '../types/store';

export const WHATSAPP_NUMBER = '6285756850861';
export const WHATSAPP_DISPLAY = '+62 857-5685-0861';
export const STORE_BRANCH = 'Cabang Lampu Merah Sunu';
export const PROMO_VIDEO_PATH = '/assets/aistudio/video_promosi_gemini_8c51f87b.mp4';

export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function formatIDR(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function makeStock(base: number): Record<ShoeSize, number> {
  const stock = {} as Record<ShoeSize, number>;
  ALL_SIZES.forEach((size, idx) => {
    stock[size] = Math.max(2, base + ((idx * 3) % 7) - 1);
  });
  return stock;
}

export const SHOE_CATALOG: ShoeProduct[] = [
  {
    id: 'nike-af1-07-white',
    name: "Nike Air Force 1 '07 Low",
    brand: 'Nike',
    category: 'Sneakers Klasik',
    price: 485000,
    originalPrice: 560000,
    image: '/src/assets/images/nike_air_force_white_1795075302149.jpg',
    description:
      'Siluet legendaris serba putih dengan bantalan empuk dan kulit sintetis premium yang mudah dibersihkan. Cocok dipakai kuliah, kerja, hingga hangout santai.',
    material: 'Kulit Sintetis Premium · Outsole Karet Cupsole',
    colorway: 'Triple White',
    sizes: ALL_SIZES,
    stockBySize: makeStock(6),
    tag: 'Terlaris',
    rating: 4.9,
    soldCount: 342,
  },
  {
    id: 'adidas-samba-og',
    name: 'Adidas Samba OG Classic',
    brand: 'Adidas',
    category: 'Retro Lifestyle',
    price: 495000,
    originalPrice: 575000,
    image: '/src/assets/images/adidas_samba_og_1795075299525.jpg',
    description:
      'Desain terrace klasik dengan kombinasi kulit putih bersih, panel suede abu-abu di ujung kaki, tiga garis hitam ikonik, serta sol karet gum yang fleksibel.',
    material: 'Kulit Halus & Suede Toe · Sol Gum Rubber',
    colorway: 'Cloud White / Core Black',
    sizes: ALL_SIZES,
    stockBySize: makeStock(5),
    tag: 'Terlaris',
    rating: 4.9,
    soldCount: 418,
  },
  {
    id: 'puma-suede-xxi',
    name: 'Puma Suede Classic XXI',
    brand: 'Puma',
    category: 'Sneakers Klasik',
    price: 425000,
    originalPrice: 490000,
    image: '/src/assets/images/puma_suede_classic_1795075300426.jpg',
    description:
      'Ikon jalanan yang tak lekang waktu dengan upper suede hitam pekat bertekstur lembut, formstrip putih kontras, dan insole empuk untuk kenyamanan seharian.',
    material: 'Full Suede Lembut · Lining Tekstil Breathable',
    colorway: 'Puma Black / White',
    sizes: ALL_SIZES,
    stockBySize: makeStock(7),
    rating: 4.8,
    soldCount: 215,
  },
  {
    id: 'nike-dunk-panda',
    name: 'Nike Dunk Low Retro Panda',
    brand: 'Nike',
    category: 'Streetwear',
    price: 520000,
    originalPrice: 595000,
    image: '/src/assets/images/nike_dunk_panda_1795075299267.jpg',
    description:
      'Perpaduan kontras hitam-putih yang sangat mudah dipadukan dengan outfit kasual maupun streetwear. Kerah rendah berbusa menjaga pergelangan kaki tetap nyaman.',
    material: 'Kulit Bertekstur · Midsole Busa Ringan',
    colorway: 'White / Black Panda',
    sizes: ALL_SIZES,
    stockBySize: makeStock(4),
    tag: 'Favorit Anak Muda',
    rating: 4.9,
    soldCount: 389,
  },
  {
    id: 'adidas-gazelle-indoor',
    name: 'Adidas Gazelle Indoor Berry',
    brand: 'Adidas',
    category: 'Retro Lifestyle',
    price: 475000,
    image: '/src/assets/images/adidas_gazelle_indoor_1795075299485.jpg',
    description:
      'Tampil beda dengan sentuhan suede merah berry yang elegan, garis krem klasik, dan sol gum transparan. Ringan, modis, dan pas untuk gaya harian kekinian.',
    material: 'Suede Lembut · Sol Gum Transparan',
    colorway: 'Berry Crimson / Cream',
    sizes: ALL_SIZES,
    stockBySize: makeStock(5),
    tag: 'Model Baru',
    rating: 4.8,
    soldCount: 164,
  },
  {
    id: 'puma-rsx-turbo',
    name: 'Puma RS-X Efekt Turbo',
    brand: 'Puma',
    category: 'Chunky Sneakers',
    price: 510000,
    originalPrice: 580000,
    image: '/src/assets/images/puma_rsx_turbo_1795075303533.jpg',
    description:
      'Sneakers chunky modern dengan lapisan mesh sirkulasi udara tinggi, aksen suede abu-abu dan merah marun, serta bantalan tebal yang stabil untuk jalan jauh.',
    material: 'Mesh Breathable & Suede Overlay · Midsole PU',
    colorway: 'Warm Cream / Slate Red',
    sizes: ALL_SIZES,
    stockBySize: makeStock(5),
    rating: 4.8,
    soldCount: 142,
  },
  {
    id: 'nike-pegasus-41',
    name: 'Nike Air Zoom Pegasus 41',
    brand: 'Nike',
    category: 'Lari & Olahraga',
    price: 565000,
    originalPrice: 640000,
    image: '/src/assets/images/nike_pegasus_running_1795075300180.jpg',
    description:
      'Sepatu lari harian dengan mesh rekayasa yang sejuk dan respons pantulan tinggi. Mengurangi beban hentakan saat jogging pagi maupun latihan rutin.',
    material: 'Engineered Mesh · Responsive Foam Cushion',
    colorway: 'Cobalt Blue / Pure White',
    sizes: ALL_SIZES,
    stockBySize: makeStock(6),
    rating: 4.9,
    soldCount: 204,
  },
  {
    id: 'adidas-ultraboost-light',
    name: 'Adidas Ultraboost Light',
    brand: 'Adidas',
    category: 'Lari & Olahraga',
    price: 590000,
    originalPrice: 675000,
    image: '/src/assets/images/adidas_ultraboost_light_1795075306951.jpg',
    description:
      'Upper rajut elastis yang mengikuti kontur kaki dipadukan dengan midsole bantalan ultra-ringan. Memberikan kenyamanan maksimal untuk olahraga maupun aktivitas padat.',
    material: 'Primeknit Breathable · Energy-Return Midsole',
    colorway: 'Charcoal Core / White',
    sizes: ALL_SIZES,
    stockBySize: makeStock(4),
    tag: 'Bantalan Super Empuk',
    rating: 4.9,
    soldCount: 276,
  },
  {
    id: 'puma-palermo-vintage',
    name: 'Puma Palermo Vintage',
    brand: 'Puma',
    category: 'Retro Lifestyle',
    price: 440000,
    image: '/src/assets/images/puma_palermo_vintage_1795075301317.jpg',
    description:
      'Nuansa kasual Eropa era 80-an dalam balutan suede krem lembut dengan aksen biru navy dan sol karet gum klasik. Ringan dipakai seharian tanpa bikin pegal.',
    material: 'Suede Lembut · Sol Gum Klasik',
    colorway: 'Sand Cream / Deep Navy',
    sizes: ALL_SIZES,
    stockBySize: makeStock(6),
    tag: 'Model Baru',
    rating: 4.8,
    soldCount: 158,
  },
  {
    id: 'nike-court-vision-mid',
    name: 'Nike Court Vision Mid',
    brand: 'Nike',
    category: 'Streetwear',
    price: 449000,
    originalPrice: 515000,
    image: '/src/assets/images/nike_court_vision_1795075304315.jpg',
    description:
      'Terinspirasi gaya basket retro dengan potongan mid-top yang menopang pergelangan kaki. Kombinasi warna off-white dan sage abu memberi tampilan rapi dan modern.',
    material: 'Kulit Sintetis & Panel Sage · Outsole Karet Anti-Slip',
    colorway: 'Off-White / Sage Charcoal',
    sizes: ALL_SIZES,
    stockBySize: makeStock(5),
    rating: 4.7,
    soldCount: 129,
  },
  {
    id: 'adidas-superstar-classic',
    name: 'Adidas Superstar Foundation',
    brand: 'Adidas',
    category: 'Streetwear',
    price: 460000,
    image: '/src/assets/images/adidas_superstar_classic_1795075300493.jpg',
    description:
      'Pelindung ujung kaki berbentuk kerang khas yang tangguh, berpadu dengan upper kulit putih dan tiga garis hitam tegas. Awet, stylish, dan cocok di segala suasana.',
    material: 'Kulit Sintetis · Rubber Shell Toe',
    colorway: 'White / Black Classic',
    sizes: ALL_SIZES,
    stockBySize: makeStock(7),
    rating: 4.8,
    soldCount: 251,
  },
  {
    id: 'puma-velocity-nitro-3',
    name: 'Puma Velocity Nitro 3',
    brand: 'Puma',
    category: 'Lari & Olahraga',
    price: 535000,
    originalPrice: 610000,
    image: '/src/assets/images/puma_velocity_nitro_1795075299838.jpg',
    description:
      'Dirancang untuk stabilitas dan kecepatan dengan bantalan busa nitrogen responsif, tumit beraksen coral sporty, dan grip karet mantap di jalan basah maupun kering.',
    material: 'Athletic Mesh · Nitro Cushioned Midsole',
    colorway: 'Graphite Grey / Coral',
    sizes: ALL_SIZES,
    stockBySize: makeStock(5),
    rating: 4.8,
    soldCount: 137,
  },
];

export const COURIER_OPTIONS = [
  { id: 'instan-sunu', name: 'Kurir Instan Muliana (Area Sunu)', eta: 'Estimasi 2–4 jam', fee: 12000 },
  { id: 'jne-reg', name: 'JNE Reguler', eta: 'Estimasi 2–3 hari', fee: 18000 },
  { id: 'jnt-exp', name: 'J&T Express', eta: 'Estimasi 1–3 hari', fee: 20000 },
];

export const SHIPPING_STAGES: {
  status: ShippingStatus;
  label: string;
  shortLabel: string;
  description: (courier: string, city: string) => string;
  location: (city: string) => string;
}[] = [
  {
    status: 'PAYMENT_CONFIRMED',
    label: 'Pesanan Dibuat & Terkonfirmasi',
    shortLabel: 'Terkonfirmasi',
    description: () => 'Pembayaran diterima. Pesanan telah masuk ke antrean Toko Muliana Shoes Cabang Lampu Merah Sunu.',
    location: () => 'Toko Muliana Shoes — Cabang Lampu Merah Sunu',
  },
  {
    status: 'PACKING',
    label: 'Sedang Dikemas & Quality Check',
    shortLabel: 'Dikemas',
    description: () => 'Tim toko sedang mengecek kondisi sepatu, memastikan ukuran sesuai pesanan, dan membungkus paket dengan rapi.',
    location: () => 'Gudang Muliana Shoes — Lampu Merah Sunu',
  },
  {
    status: 'HANDED_TO_COURIER',
    label: 'Diserahkan ke Kurir',
    shortLabel: 'Diserahkan',
    description: (courier) => `Paket telah diserahkan dan di-scan oleh pihak ${courier} untuk proses pengiriman.`,
    location: () => 'Gerai Drop-off Sunu',
  },
  {
    status: 'IN_TRANSIT',
    label: 'Dalam Perjalanan ke Kota Tujuan',
    shortLabel: 'Dikirim',
    description: (courier, city) => `Paket sedang dalam perjalanan bersama armada ${courier} menuju hub distribusi ${city}.`,
    location: (city) => `Hub Sortir ${city}`,
  },
  {
    status: 'OUT_FOR_DELIVERY',
    label: 'Kurir Menuju Alamat Penerima',
    shortLabel: 'Menuju Lokasi',
    description: (courier) => `Kurir ${courier} sedang membawa paket menuju alamat Anda. Mohon pastikan nomor WhatsApp aktif.`,
    location: (city) => `Area Pengantaran ${city}`,
  },
  {
    status: 'DELIVERED',
    label: 'Paket Telah Tiba',
    shortLabel: 'Telah Tiba',
    description: () => 'Paket sepatu Anda telah tiba di alamat tujuan! Terima kasih telah berbelanja di Muliana Shoes.',
    location: (city) => `Alamat Penerima — ${city}`,
  },
];

// Generate authentic EMVCo-formatted QRIS payload string with CRC16-CCITT
function crc16Ccitt(str: string): string {
  let crc = 0xffff;
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ 0x1021) & 0xffff;
      } else {
        crc = (crc << 1) & 0xffff;
      }
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

function tlv(tag: string, value: string): string {
  return `${tag}${value.length.toString().padStart(2, '0')}${value}`;
}

export function generateQrisPayload(referenceId: string, amount: number): string {
  const merchantAccount =
    tlv('00', 'ID.CO.QRIS.WWW') +
    tlv('01', '9360091431026074892') +
    tlv('02', 'ID1026074892154') +
    tlv('03', 'UMI');

  const additionalData = tlv('01', referenceId.slice(0, 20));
  const payloadWithoutCrc =
    tlv('00', '01') +
    tlv('01', '12') +
    tlv('26', merchantAccount) +
    tlv('52', '5661') +
    tlv('53', '360') +
    tlv('54', String(Math.round(amount))) +
    tlv('58', 'ID') +
    tlv('59', 'MULIANA SHOES SUNU') +
    tlv('60', 'MAKASSAR') +
    tlv('61', '90211') +
    tlv('62', additionalData) +
    '6304';

  return payloadWithoutCrc + crc16Ccitt(payloadWithoutCrc);
}
