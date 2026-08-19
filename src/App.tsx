import React, { useState, useEffect } from 'react';
import { 
  UserRole, 
  CategoryId, 
  StoreListing, 
  ProductItem, 
  CartItem, 
  CustomErrandRequest, 
  Order, 
  OrderStatus 
} from './types';
import { INITIAL_STORES, INITIAL_PRODUCTS, SAQR_CONTACT } from './data/taizData';
import { supabase } from './supabaseClient';
import {
  fetchStoresFromSupabase,
  fetchProductsFromSupabase,
  fetchOrdersFromSupabase,
  updateOrderStatusInSupabase,
  subscribeToOrdersInSupabase,
  addProviderListingToSupabase,
} from './supabaseService';

// Component Imports
import { Header } from './components/Header';
import { BannerSlider } from './components/BannerSlider';
import { DirectorySection } from './components/DirectorySection';
import { StoreDetailModal } from './components/StoreDetailModal';
import { CustomErrandModal } from './components/CustomErrandModal';
import { CartDrawer } from './components/CartDrawer';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { CaptainDashboard } from './components/CaptainDashboard';
import { ProviderDashboard } from './components/ProviderDashboard';
import { ServiceProviderFormModal } from './components/ServiceProviderFormModal';
import { AiAssistantDrawer } from './components/AiAssistantDrawer';
import { AuthModal } from './components/AuthModal';
import { SupportSection } from './components/SupportSection';
import { FavoritesModal } from './components/FavoritesModal';
import { AppDownloadModal } from './components/AppDownloadModal';
import { ThemeToggleButton } from './components/ThemeToggleButton';

export default function App() {
  // Application Roles & Persistence
  const [currentRole, setCurrentRole] = useState<UserRole>('customer');
  const [userProfile, setUserProfile] = useState<{ name: string; phone: string; role: UserRole } | null>(null);

  // Filters & State
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');

  // Directory Data
  const [stores, setStores] = useState<StoreListing[]>(INITIAL_STORES);
  const [products, setProducts] = useState<ProductItem[]>(INITIAL_PRODUCTS);

  // Favorites Store Persistence
  const [favoriteStoreIds, setFavoriteStoreIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('saqr_favorite_stores');
      return saved ? JSON.parse(saved) : ['store-1', 'store-3'];
    } catch {
      return ['store-1', 'store-3'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('saqr_favorite_stores', JSON.stringify(favoriteStoreIds));
    } catch (e) {
      console.error(e);
    }
  }, [favoriteStoreIds]);

  const toggleFavoriteStore = (storeId: string) => {
    setFavoriteStoreIds((prev) => {
      const exists = prev.includes(storeId);
      const targetStore = stores.find((s) => s.id === storeId);
      const storeName = targetStore?.title || 'المتجر';

      if (exists) {
        showToast(`تمت إزالة "${storeName}" من قائمة المفضلة`);
        return prev.filter((id) => id !== storeId);
      } else {
        showToast(`تمت إضافة "${storeName}" إلى المفضلة ❤️`);
        return [...prev, storeId];
      }
    });
  };

  const handleClearAllFavorites = () => {
    setFavoriteStoreIds([]);
    showToast('تم إفراغ قائمة المتاجر المفضلة بالكامل');
  };

  // Cart & Orders
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [customErrand, setCustomErrand] = useState<CustomErrandRequest | undefined>(undefined);
  const [orders, setOrders] = useState<Order[]>([]);

  // Selected Store Modal
  const [activeStoreModal, setActiveStoreModal] = useState<StoreListing | null>(null);

  // Modals Visibility
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCustomErrandOpen, setIsCustomErrandOpen] = useState(false);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
  const [isOrdersTrackingOpen, setIsOrdersTrackingOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isAppDownloadOpen, setIsAppDownloadOpen] = useState(false);

  // Bottom Navigation Active Tab
  const [activeBottomTab, setActiveBottomTab] = useState<'home' | 'categories' | 'favorites' | 'cart' | 'account'>('home');

  const handleSelectBottomTab = (tab: 'home' | 'categories' | 'favorites' | 'cart' | 'account') => {
    setActiveBottomTab(tab);
    if (tab === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (tab === 'categories') {
      const el = document.getElementById('directory-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (tab === 'favorites') {
      setIsFavoritesOpen(true);
    } else if (tab === 'cart') {
      setIsCartOpen(true);
    } else if (tab === 'account') {
      setIsAuthOpen(true);
    }
  };

  // Toast Alerts
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Protect Private Pages & Check Session via supabase.auth.getSession()
  useEffect(() => {
    const checkAuthSession = async () => {
      const isLoginPath = window.location.pathname === '/login';

      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const meta = session.user.user_metadata || {};
        const userRole = (meta.role as UserRole) || 'customer';
        setUserProfile({
          name: meta.full_name || session.user.email || 'مستخدم منصة صقر',
          phone: meta.phone || '',
          role: userRole,
        });
        if (isLoginPath) {
          window.history.pushState({}, '', '/');
          setIsAuthOpen(false);
        }
      } else {
        setUserProfile(null);
        // Protect private pages / roles (captain or provider) or /login route
        if (currentRole === 'captain' || currentRole === 'provider' || isLoginPath) {
          setCurrentRole('customer');
          setIsAuthOpen(true);
          if (!isLoginPath) {
            window.history.pushState({}, '', '/login');
          }
        }
      }
    };

    checkAuthSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const meta = session.user.user_metadata || {};
        const userRole = (meta.role as UserRole) || 'customer';
        setUserProfile({
          name: meta.full_name || session.user.email || 'مستخدم منصة صقر',
          phone: meta.phone || '',
          role: userRole,
        });
        if (window.location.pathname === '/login') {
          window.history.pushState({}, '', '/');
          setIsAuthOpen(false);
        }
      } else {
        setUserProfile(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Protected Role Switcher (checks session before opening private pages)
  const handleRoleChange = async (role: UserRole) => {
    if (role === 'captain' || role === 'provider') {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        window.history.pushState({}, '', '/login');
        setIsAuthOpen(true);
        showToast('يرجى تسجيل الدخول أولاً للوصول إلى هذه اللوحة الخاصة');
        return;
      }
    }
    setCurrentRole(role);
    if (window.location.pathname === '/login') {
      window.history.pushState({}, '', '/');
    }
  };

  // Fetch Initial Stores, Products & Orders from Supabase + Subscribe to Realtime Updates
  useEffect(() => {
    const loadSupabaseData = async () => {
      // 1. Fetch Stores Directory
      const dbStores = await fetchStoresFromSupabase();
      if (dbStores && dbStores.length > 0) {
        setStores((prev) => {
          const combined = [...dbStores, ...prev];
          // Filter duplicates by id
          return combined.filter((s, idx, self) => idx === self.findIndex((t) => t.id === s.id));
        });
      }

      // 2. Fetch Products
      const dbProducts = await fetchProductsFromSupabase();
      if (dbProducts && dbProducts.length > 0) {
        setProducts((prev) => {
          const combined = [...dbProducts, ...prev];
          return combined.filter((p, idx, self) => idx === self.findIndex((t) => t.id === p.id));
        });
      }

      // 3. Fetch Orders
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      const dbOrders = await fetchOrdersFromSupabase(userId, currentRole);
      if (dbOrders && dbOrders.length > 0) {
        setOrders(dbOrders);
      } else {
        // Fallback to local server API if Supabase table is empty
        fetch('/api/orders')
          .then((res) => res.json())
          .then((data) => {
            if (data.orders) setOrders(data.orders);
          })
          .catch((err) => console.error('Failed fetching orders', err));
      }
    };

    loadSupabaseData();

    // 4. Subscribe to Realtime Orders updates in Supabase
    const unsubscribe = subscribeToOrdersInSupabase((updatedOrder) => {
      setOrders((prev) => {
        const exists = prev.some((o) => o.id === updatedOrder.id);
        if (exists) {
          return prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o));
        }
        return [updatedOrder, ...prev];
      });
      showToast(`تحديث مباشر للطلب #${updatedOrder.orderNumber}: ${updatedOrder.status === 'delivered' ? 'تم التسليم' : 'تغيرت الحالة'}`);
    });

    return () => {
      unsubscribe();
    };
  }, [currentRole]);

  // Cart Handlers
  const handleAddToCart = (product: ProductItem, quantity: number) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`تمت إضافة "${product.name}" إلى السلة بنجاح!`);
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleAddErrand = (errand: CustomErrandRequest) => {
    setCustomErrand(errand);
    setIsCartOpen(true);
    showToast('تمت إضافة طلب المشوار الخاص إلى السلة!');
  };

  // Order Handlers
  const handleOrderCreated = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setCartItems([]);
    setCustomErrand(undefined);
    setIsOrdersTrackingOpen(true);
    showToast(`تم إرسال طلبك برقم #${newOrder.orderNumber} بنجاح للكابتن!`);
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const captainInfo = session?.user ? {
        id: session.user.id,
        name: userProfile?.name || 'الكابتن صادق اليعبري',
        phone: userProfile?.phone || '04212345',
        coords: { lat: 13.5790, lng: 44.0170 }
      } : undefined;

      await updateOrderStatusInSupabase(orderId, newStatus, captainInfo);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      showToast(`تم تحديث حالة الطلب إلى: ${newStatus === 'delivered' ? 'تم التسليم' : 'مع المندوب'}`);
    } catch (err) {
      console.error(err);
    }
  };

  // Add Service Listing Handler (for Providers)
  const handleAddListing = async (listing: any) => {
    const { data: { session } } = await supabase.auth.getSession();
    const created = await addProviderListingToSupabase(listing, session?.user?.id);
    if (created) {
      setStores((prev) => [listing, ...prev]);
    } else {
      setStores((prev) => [listing, ...prev]);
    }
    showToast('تمت إضافة نشاطك بنجاح إلى دليل تعز الشامل!');
  };

  // Re-order Handler
  const handleReorder = (order: Order) => {
    if (order.items && order.items.length > 0) {
      order.items.forEach((item) => handleAddToCart(item.product, item.quantity));
    }
    if (order.customErrand) {
      setCustomErrand(order.customErrand);
    }
    setIsCartOpen(true);
  };

  // Total Cart Count
  const cartTotalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0) + (customErrand ? 1 : 0);
  const activeOrdersCount = orders.filter((o) => o.status !== 'delivered').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Cairo',sans-serif]">
      
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-amber-500 text-slate-950 px-5 py-2.5 rounded-2xl font-extrabold text-xs shadow-2xl border border-amber-300 animate-bounce flex items-center gap-2">
          <span>🦅</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main App Header */}
      <Header
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        selectedDistrict={selectedDistrict}
        onDistrictChange={setSelectedDistrict}
        cartCount={cartTotalCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenCustomErrand={() => setIsCustomErrandOpen(true)}
        onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenAddService={() => setIsAddServiceOpen(true)}
        onOpenOrdersTracking={() => setIsOrdersTrackingOpen(true)}
        activeOrdersCount={activeOrdersCount}
        userName={userProfile?.name}
        favoritesCount={favoriteStoreIds.length}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
        onOpenAppDownload={() => setIsAppDownloadOpen(true)}
      />

      {/* Main Dynamic View based on Active Role */}
      <main className="flex-1">
        {currentRole === 'customer' || currentRole === 'guest' ? (
          <>
            {/* Promotional Banner Slider */}
            <BannerSlider
              onOpenCustomErrand={() => setIsCustomErrandOpen(true)}
              onSelectCategory={(cat) => setSelectedCategory(cat as CategoryId)}
              onOpenAddService={() => setIsAddServiceOpen(true)}
            />

            {/* Taiz Directory & Stores Catalog */}
            <div id="directory-section">
              <DirectorySection
                stores={stores}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                selectedDistrict={selectedDistrict}
                onDistrictChange={setSelectedDistrict}
                onSelectStore={(store) => setActiveStoreModal(store)}
                onOpenAddService={() => setIsAddServiceOpen(true)}
                onOpenCustomErrand={() => setIsCustomErrandOpen(true)}
                favoriteStoreIds={favoriteStoreIds}
                onToggleFavorite={toggleFavoriteStore}
                onOpenFavorites={() => setIsFavoritesOpen(true)}
              />
            </div>
          </>
        ) : currentRole === 'captain' ? (
          /* Captain View for Delivery Drivers */
          <CaptainDashboard
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
          />
        ) : (
          /* Provider View for Merchants / Engineers / Real Estate */
          <ProviderDashboard
            myListings={stores.filter((s) => s.category === 'engineers' || s.category === 'realestate' || s.isFeatured)}
            onOpenAddService={() => setIsAddServiceOpen(true)}
          />
        )}
      </main>

      {/* Modals & Slide-out Drawers */}

      {/* Store Catalog Detail Modal */}
      <StoreDetailModal
        store={activeStoreModal}
        products={products}
        onClose={() => setActiveStoreModal(null)}
        onAddToCart={handleAddToCart}
        cartItems={cartItems}
        onOpenCart={() => setIsCartOpen(true)}
        isFavorite={activeStoreModal ? favoriteStoreIds.includes(activeStoreModal.id) : false}
        onToggleFavorite={toggleFavoriteStore}
      />

      {/* Favorites Stores Modal */}
      <FavoritesModal
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        stores={stores}
        favoriteStoreIds={favoriteStoreIds}
        onToggleFavorite={toggleFavoriteStore}
        onClearAllFavorites={handleClearAllFavorites}
        onSelectStore={(store) => {
          setIsFavoritesOpen(false);
          setActiveStoreModal(store);
        }}
      />

      {/* Custom Errand Request Modal */}
      <CustomErrandModal
        isOpen={isCustomErrandOpen}
        onClose={() => setIsCustomErrandOpen(false)}
        onSubmitErrand={handleAddErrand}
      />

      {/* Shopping Cart & Checkout Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        customErrand={customErrand}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearErrand={() => setCustomErrand(undefined)}
        onOrderCreated={handleOrderCreated}
        isGuest={false}
        onPromptAuth={() => setIsAuthOpen(true)}
        onOpenAppDownload={() => setIsAppDownloadOpen(true)}
      />

      {/* Live Order Status Tracker & Map */}
      <OrderTrackingModal
        isOpen={isOrdersTrackingOpen}
        onClose={() => setIsOrdersTrackingOpen(false)}
        orders={orders}
        onReorder={handleReorder}
      />

      {/* Service Provider Subscription Modal */}
      <ServiceProviderFormModal
        isOpen={isAddServiceOpen}
        onClose={() => setIsAddServiceOpen(false)}
        onAddListing={handleAddListing}
      />

      {/* AI Smart Assistant Drawer (صقر AI) */}
      <AiAssistantDrawer
        isOpen={isAiAssistantOpen}
        onClose={() => setIsAiAssistantOpen(false)}
        userDistrict={selectedDistrict}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(usr) => { setUserProfile(usr); setCurrentRole(usr.role); }}
      />

      {/* App Download Modal */}
      <AppDownloadModal
        isOpen={isAppDownloadOpen}
        onClose={() => setIsAppDownloadOpen(false)}
      />

      {/* Floating Theme Toggle Button (Light/Dark Mode) */}
      <ThemeToggleButton />

      {/* Footer & Support Section */}
      <div>
        <SupportSection />
      </div>

    </div>
  );
}
