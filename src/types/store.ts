export type Brand = 'Nike' | 'Adidas' | 'Puma';

export type ShoeCategory =
  | 'Sneakers Klasik'
  | 'Streetwear'
  | 'Lari & Olahraga'
  | 'Retro Lifestyle'
  | 'Chunky Sneakers';

export type ShoeSize = 35 | 36 | 37 | 38 | 39 | 40 | 41 | 42 | 43;

export const ALL_SIZES: ShoeSize[] = [35, 36, 37, 38, 39, 40, 41, 42, 43];

export const SIZE_CM_GUIDE: Record<ShoeSize, string> = {
  35: '22.0 cm',
  36: '22.5 cm',
  37: '23.5 cm',
  38: '24.0 cm',
  39: '24.5 cm',
  40: '25.5 cm',
  41: '26.0 cm',
  42: '26.5 cm',
  43: '27.5 cm',
};

export interface ShoeProduct {
  id: string;
  name: string;
  brand: Brand;
  category: ShoeCategory;
  price: number;
  originalPrice?: number;
  image: string;
  description: string;
  material: string;
  colorway: string;
  sizes: ShoeSize[];
  stockBySize: Record<ShoeSize, number>;
  tag?: string;
  rating: number;
  soldCount: number;
}

export interface CartItem {
  key: string;
  productId: string;
  name: string;
  brand: Brand;
  image: string;
  price: number;
  size: ShoeSize;
  quantity: number;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  password?: string;
  createdAt: string;
}

export type PaymentMethod = 'QRIS' | 'TRANSFER' | 'COD';

export type ShippingStatus =
  | 'PAYMENT_CONFIRMED'
  | 'PACKING'
  | 'HANDED_TO_COURIER'
  | 'IN_TRANSIT'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED';

export interface ShippingEvent {
  status: ShippingStatus;
  label: string;
  description: string;
  location: string;
  timestamp: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  recipientName: string;
  phone: string;
  address: string;
  city: string;
  courier: string;
  trackingNumber: string;
  paymentMethod: PaymentMethod;
  qrisPayload?: string;
  status: ShippingStatus;
  timeline: ShippingEvent[];
  createdAt: string;
  autoProgress: boolean;
  receivedConfirmed?: boolean;
  customerRating?: number;
}

export interface AppNotification {
  id: string;
  orderId: string;
  status: ShippingStatus;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}
