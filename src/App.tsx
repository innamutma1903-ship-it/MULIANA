import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AuthModal } from './components/AuthModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { NotificationCenter } from './components/NotificationCenter';
import { OrdersPanel } from './components/OrdersPanel';
import { ProductCatalog } from './components/ProductCatalog';
import { ProductModal } from './components/ProductModal';
import { StoreInfoSection } from './components/StoreInfoSection';
import { WhatsAppWidget } from './components/WhatsAppWidget';
import { SHIPPING_STAGES, SHOE_CATALOG } from './data/shoes';
import {
  AppNotification,
  Brand,
  CartItem,
  Order,
  PaymentMethod,
  ShoeCategory,
  ShoeProduct,
  ShoeSize,
  UserAccount,
} from './types/store';

const STORAGE_KEYS = {
  accounts: 'muliana_accounts_v1',
  session: 'muliana_session_v1',
  cart: 'muliana_cart_v1',
  orders: 'muliana_orders_v1',
  notifications: 'muliana_notifications_v1',
};

const DEFAULT_DEMO_ACCOUNT: UserAccount = {
  id: 'usr-demo-muliana',
  name: 'Rina Rahmawati',
  email: 'pembeli@mulianashoes.id',
  phone: '085756850861',
  address: 'Jl. Sunu Raya No. 18, Dekat Lampu Merah Sunu',
  city: 'Makassar',
  password: 'demo',
  createdAt: '2026-01-10T08:00:00.000Z',
};

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export default function App() {
  // Persistent User & Store State
  const [accounts, setAccounts] = useState<UserAccount[]>(() => {
    const stored = readStorage<UserAccount[]>(STORAGE_KEYS.accounts, []);
    return stored.length > 0 ? stored : [DEFAULT_DEMO_ACCOUNT];
  });
  const [user, setUser] = useState<UserAccount | null>(() =>
    readStorage<UserAccount | null>(STORAGE_KEYS.session, null)
  );
  const [cart, setCart] = useState<CartItem[]>(() => readStorage<CartItem[]>(STORAGE_KEYS.cart, []));
  const [orders, setOrders] = useState<Order[]>(() => readStorage<Order[]>(STORAGE_KEYS.orders, []));
  const [notifications, setNotifications] = useState<AppNotification[]>(() =>
    readStorage<AppNotification[]>(STORAGE_KEYS.notifications, [])
  );

  // Live Toasts & Browser Notifications
  const [toasts, setToasts] = useState<AppNotification[]>([]);
  const [browserNotifEnabled, setBrowserNotifEnabled] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return window.Notification.permission === 'granted';
    }
    return false;
  });

  // Catalog Filters
  const [selectedBrand, setSelectedBrand] = useState<Brand | 'ALL'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<ShoeCategory | 'ALL'>('ALL');
  const [selectedSize, setSelectedSize] = useState<ShoeSize | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc'>('popular');

  // Modals & Drawers
  const [activeProduct, setActiveProduct] = useState<ShoeProduct | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authNotice, setAuthNotice] = useState<string | null>(null);
  const [pendingCheckoutAfterAuth, setPendingCheckoutAfterAuth] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [ordersOpen, setOrdersOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [highlightedOrderId, setHighlightedOrderId] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.accounts, JSON.stringify(accounts));
    } catch {
      // ignore storage quota issues
    }
  }, [accounts]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(user));
    } catch {
      // ignore
    }
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.orders, JSON.stringify(orders));
    } catch {
      // ignore
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.notifications, JSON.stringify(notifications));
    } catch {
      // ignore
    }
  }, [notifications]);

  // Push automatic notification (inbox + live toast + optional browser desktop alert)
  const pushNotification = useCallback(
    (notif: AppNotification) => {
      setNotifications((prev) => [notif, ...prev].slice(0, 40));
      setToasts((prev) => [notif, ...prev].slice(0, 3));

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== notif.id));
      }, 6500);

      if (
        typeof window !== 'undefined' &&
        'Notification' in window &&
        window.Notification.permission === 'granted'
      ) {
        try {
          new window.Notification(notif.title, {
            body: `${notif.orderId}: ${notif.message}`,
          });
        } catch {
          // graceful fallback inside sandboxed iframes
        }
      }
    },
    []
  );

  // Advance a single order to the next shipping stage and fire automatic notification
  const advanceOrderById = useCallback(
    (orderId: string) => {
      let generatedNotif: AppNotification | null = null;

      setOrders((prev) =>
        prev.map((order) => {
          if (order.id !== orderId) return order;
          const idx = SHIPPING_STAGES.findIndex((s) => s.status === order.status);
          if (idx < 0 || idx >= SHIPPING_STAGES.length - 1) return order;

          const nextStage = SHIPPING_STAGES[idx + 1];
          const now = new Date().toISOString();
          const description = nextStage.description(order.courier, order.city);
          const location = nextStage.location(order.city);

          generatedNotif = {
            id: `ntf-${order.id}-${nextStage.status}-${Date.now()}`,
            orderId: order.id,
            status: nextStage.status,
            title:
              nextStage.status === 'DELIVERED'
                ? 'Paket Telah Tiba!'
                : `Update Pengiriman: ${nextStage.shortLabel}`,
            message: description,
            timestamp: now,
            read: false,
          };

          return {
            ...order,
            status: nextStage.status,
            autoProgress: nextStage.status === 'DELIVERED' ? false : order.autoProgress,
            timeline: [
              ...order.timeline,
              {
                status: nextStage.status,
                label: nextStage.label,
                description,
                location,
                timestamp: now,
              },
            ],
          };
        })
      );

      if (generatedNotif) {
        pushNotification(generatedNotif);
      }
    },
    [pushNotification]
  );

  // Automatic Real-Time Shipping Progression Engine (ticks every 7 seconds for active orders)
  const ordersRef = useRef(orders);
  ordersRef.current = orders;

  useEffect(() => {
    const interval = setInterval(() => {
      const current = ordersRef.current;
      const eligible = current.filter(
        (o) => o.autoProgress && o.status !== 'DELIVERED'
      );
      if (eligible.length === 0) return;

      eligible.forEach((order) => {
        advanceOrderById(order.id);
      });
    }, 7000);

    return () => clearInterval(interval);
  }, [advanceOrderById]);

  // Derived user-scoped data
  const userOrders = useMemo(() => {
    if (!user) return [];
    return orders.filter((o) => o.userId === user.id);
  }, [orders, user]);

  const userOrderIds = useMemo(() => new Set(userOrders.map((o) => o.id)), [userOrders]);

  const userNotifications = useMemo(() => {
    if (!user) return [];
    return notifications.filter((n) => userOrderIds.has(n.orderId));
  }, [notifications, user, userOrderIds]);

  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);
  const unreadNotifications = useMemo(
    () => userNotifications.filter((n) => !n.read).length,
    [userNotifications]
  );
  const activeOrdersCount = useMemo(
    () => userOrders.filter((o) => o.status !== 'DELIVERED').length,
    [userOrders]
  );

  // Handlers
  const handleAddToCart = (product: ShoeProduct, size: ShoeSize, quantity: number) => {
    const key = `${product.id}-${size}`;
    setCart((prev) => {
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        return prev.map((i) => (i.key === key ? { ...i, quantity: i.quantity + quantity } : i));
      }
      return [
        ...prev,
        {
          key,
          productId: product.id,
          name: product.name,
          brand: product.brand,
          image: product.image,
          price: product.price,
          size,
          quantity,
        },
      ];
    });
  };

  const handleBuyNow = (product: ShoeProduct, size: ShoeSize, quantity: number) => {
    handleAddToCart(product, size, quantity);
    setActiveProduct(null);
    if (!user) {
      setAuthNotice('Silakan masuk atau daftar akun terlebih dahulu untuk melanjutkan pembayaran.');
      setPendingCheckoutAfterAuth(true);
      setAuthOpen(true);
    } else {
      setCheckoutOpen(true);
    }
  };

  const handleUpdateQty = (key: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => (item.key === key ? { ...item, quantity: item.quantity + delta } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveCartItem = (key: string) => {
    setCart((prev) => prev.filter((item) => item.key !== key));
  };

  const handleProceedCheckout = () => {
    setCartOpen(false);
    if (!user) {
      setAuthNotice('Masuk ke akun Anda untuk membuat pesanan dan melacak pengiriman otomatis.');
      setPendingCheckoutAfterAuth(true);
      setAuthOpen(true);
      return;
    }
    setCheckoutOpen(true);
  };

  const handleLoginSuccess = (loggedInUser: UserAccount) => {
    setUser(loggedInUser);
    setAuthNotice(null);
    if (pendingCheckoutAfterAuth && cart.length > 0) {
      setPendingCheckoutAfterAuth(false);
      setCheckoutOpen(true);
    }
  };

  const handleRegisterAccount = (newAccount: UserAccount) => {
    setAccounts((prev) => [...prev, newAccount]);
  };

  const handleLogout = () => {
    setUser(null);
    setOrdersOpen(false);
    setNotifOpen(false);
    setCheckoutOpen(false);
  };

  const handleConfirmOrder = (payload: {
    recipientName: string;
    phone: string;
    address: string;
    city: string;
    courier: string;
    shippingFee: number;
    paymentMethod: PaymentMethod;
    qrisPayload?: string;
    referenceId: string;
  }) => {
    if (!user || cart.length === 0) return;

    const now = new Date().toISOString();
    const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const total = subtotal + payload.shippingFee;
    const firstStage = SHIPPING_STAGES[0];
    const trackingNumber = `MSN${Math.floor(100000000 + Math.random() * 899999999)}`;

    const newOrder: Order = {
      id: payload.referenceId,
      userId: user.id,
      items: [...cart],
      subtotal,
      shippingFee: payload.shippingFee,
      total,
      recipientName: payload.recipientName,
      phone: payload.phone,
      address: payload.address,
      city: payload.city,
      courier: payload.courier,
      trackingNumber,
      paymentMethod: payload.paymentMethod,
      qrisPayload: payload.qrisPayload,
      status: firstStage.status,
      timeline: [
        {
          status: firstStage.status,
          label: firstStage.label,
          description:
            payload.paymentMethod === 'QRIS'
              ? 'Pembayaran QRIS terverifikasi otomatis. Pesanan diteruskan ke Toko Muliana Shoes Cabang Lampu Merah Sunu.'
              : firstStage.description(payload.courier, payload.city),
          location: firstStage.location(payload.city),
          timestamp: now,
        },
      ],
      createdAt: now,
      autoProgress: true,
    };

    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
    setCheckoutOpen(false);
    setHighlightedOrderId(newOrder.id);
    setOrdersOpen(true);

    pushNotification({
      id: `ntf-${newOrder.id}-CREATED-${Date.now()}`,
      orderId: newOrder.id,
      status: firstStage.status,
      title:
        payload.paymentMethod === 'QRIS'
          ? 'Pembayaran QRIS Berhasil!'
          : 'Pesanan Berhasil Dibuat!',
      message: `Pesanan ${newOrder.id} sedang diproses oleh Muliana Shoes Cabang Lampu Merah Sunu. Status pengiriman akan diperbarui otomatis.`,
      timestamp: now,
      read: false,
    });
  };

  const handleToggleAutoProgress = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, autoProgress: !o.autoProgress } : o))
    );
  };

  const handleConfirmReceived = (orderId: string, rating: number) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, receivedConfirmed: true, customerRating: rating } : o
      )
    );
  };

  const handleOpenOrders = () => {
    if (!user) {
      setAuthNotice('Silakan masuk terlebih dahulu untuk melihat dan melacak pesanan Anda.');
      setPendingCheckoutAfterAuth(false);
      setAuthOpen(true);
      return;
    }
    setOrdersOpen(true);
  };

  const handleRequestBrowserNotif = () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      window.Notification.requestPermission()
        .then((perm) => setBrowserNotifEnabled(perm === 'granted'))
        .catch(() => {});
    }
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleSelectNotification = (notif: AppNotification) => {
    setNotifications((prev) => prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n)));
    setToasts((prev) => prev.filter((t) => t.id !== notif.id));
    setNotifOpen(false);
    setHighlightedOrderId(notif.orderId);
    setOrdersOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] text-[#111318]">
      <Header
        user={user}
        cartCount={cartCount}
        unreadNotifications={unreadNotifications}
        activeOrdersCount={activeOrdersCount}
        onOpenAuth={() => {
          setAuthNotice(null);
          setPendingCheckoutAfterAuth(false);
          setAuthOpen(true);
        }}
        onLogout={handleLogout}
        onOpenCart={() => setCartOpen(true)}
        onOpenOrders={handleOpenOrders}
        onOpenNotifications={() => {
          if (!user) {
            setAuthNotice('Masuk ke akun Anda untuk melihat riwayat notifikasi pengiriman.');
            setAuthOpen(true);
          } else {
            setNotifOpen(true);
          }
        }}
      />

      <main className="flex-1">
        <HeroSection onSelectBrand={(brand) => setSelectedBrand(brand)} />

        <ProductCatalog
          products={SHOE_CATALOG}
          selectedBrand={selectedBrand}
          onBrandChange={setSelectedBrand}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedSize={selectedSize}
          onSizeChange={setSelectedSize}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
          onSelectProduct={(shoe) => setActiveProduct(shoe)}
        />

        <StoreInfoSection />
      </main>

      {/* Modals, Drawers & Live Notifications */}
      <ProductModal
        product={activeProduct}
        onClose={() => setActiveProduct(null)}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
      />

      <CartDrawer
        open={cartOpen}
        items={cart}
        onClose={() => setCartOpen(false)}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveCartItem}
        onCheckout={handleProceedCheckout}
      />

      <AuthModal
        open={authOpen}
        notice={authNotice}
        onClose={() => {
          setAuthOpen(false);
          setPendingCheckoutAfterAuth(false);
        }}
        onLoginSuccess={handleLoginSuccess}
        accounts={accounts}
        onRegisterAccount={handleRegisterAccount}
      />

      <CheckoutModal
        open={checkoutOpen}
        user={user}
        items={cart}
        onClose={() => setCheckoutOpen(false)}
        onConfirmOrder={handleConfirmOrder}
      />

      <OrdersPanel
        open={ordersOpen}
        orders={userOrders}
        highlightedOrderId={highlightedOrderId}
        onClose={() => setOrdersOpen(false)}
        onAdvanceOrderStatus={advanceOrderById}
        onToggleAutoProgress={handleToggleAutoProgress}
        onConfirmReceived={handleConfirmReceived}
      />

      <NotificationCenter
        panelOpen={notifOpen}
        notifications={userNotifications}
        toasts={toasts}
        browserNotifEnabled={browserNotifEnabled}
        onClosePanel={() => setNotifOpen(false)}
        onDismissToast={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))}
        onMarkAllRead={handleMarkAllRead}
        onSelectNotification={handleSelectNotification}
        onRequestBrowserNotif={handleRequestBrowserNotif}
      />

      <WhatsAppWidget />
    </div>
  );
}
