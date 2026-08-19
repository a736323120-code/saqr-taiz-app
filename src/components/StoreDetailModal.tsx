import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Phone, 
  MessageCircle, 
  Star, 
  Clock, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Search,
  CheckCircle2,
  Sparkles,
  Heart,
  PhoneCall
} from 'lucide-react';
import { StoreListing, ProductItem, CartItem } from '../types';

interface StoreDetailModalProps {
  store: StoreListing | null;
  products: ProductItem[];
  onClose: () => void;
  onAddToCart: (product: ProductItem, quantity: number) => void;
  cartItems: CartItem[];
  onOpenCart: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: (storeId: string) => void;
}

export const StoreDetailModal: React.FC<StoreDetailModalProps> = ({
  store,
  products,
  onClose,
  onAddToCart,
  cartItems,
  onOpenCart,
  isFavorite = false,
  onToggleFavorite,
}) => {
  if (!store) return null;

  const [productSearch, setProductSearch] = useState('');
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  // Filter products for this specific store
  const storeProducts = products.filter((p) => p.storeId === store.id);
  const filteredProducts = storeProducts.filter((p) =>
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.description.toLowerCase().includes(productSearch.toLowerCase())
  );

  const getQuantity = (id: string) => quantities[id] || 1;

  const handleIncrease = (id: string) => {
    setQuantities((prev) => ({ ...prev, [id]: (prev[id] || 1) + 1 }));
  };

  const handleDecrease = (id: string) => {
    setQuantities((prev) => ({ ...prev, [id]: Math.max(1, (prev[id] || 1) - 1) }));
  };

  const totalStoreCartCount = cartItems
    .filter((item) => item.product.storeId === store.id)
    .reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Modal Header with Banner Image */}
        <div className="relative h-48 sm:h-56 w-full bg-slate-800">
          <img
            src={store.image}
            alt={store.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          {/* Top Actions: Close & Favorite */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
            <button
              onClick={onClose}
              className="pointer-events-auto bg-slate-950/70 text-white p-2 rounded-full hover:bg-slate-950 transition-all border border-slate-700 cursor-pointer"
              title="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>

            {onToggleFavorite && (
              <button
                onClick={() => onToggleFavorite(store.id)}
                className={`pointer-events-auto p-2.5 rounded-2xl backdrop-blur transition-all cursor-pointer shadow-lg flex items-center gap-1.5 ${
                  isFavorite
                    ? 'bg-red-500/30 text-red-400 border border-red-500/50'
                    : 'bg-slate-950/70 text-slate-200 hover:text-red-400 border border-slate-700'
                }`}
                title={isFavorite ? 'إزالة من المفضلة' : 'حفظ في المفضلة'}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                <span className="text-xs font-bold hidden sm:inline">
                  {isFavorite ? 'في المفضلة ❤️' : 'إضافة للمفضلة'}
                </span>
              </button>
            )}
          </div>

          {/* Store Info Header Overlay */}
          <div className="absolute bottom-4 right-4 left-4 text-white space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-md">
                {store.district}
              </span>
              <div className="flex items-center gap-1 text-emerald-300 text-xs font-extrabold bg-slate-900/80 px-2 py-0.5 rounded-full border border-emerald-500/30">
                <Star className="w-3 h-3 fill-emerald-400" />
                <span>{store.rating} ({store.reviewCount} تقييم)</span>
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-black font-sans">{store.title}</h2>
            <p className="text-xs text-slate-300 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{store.addressDetails}</span>
            </p>
          </div>
        </div>

        {/* Contact Badges & Search */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <a
              href={`https://wa.me/${store.whatsapp.replace('+', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all shadow-sm"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>واتساب {store.whatsapp}</span>
            </a>

            <a
              href={`tel:${store.phone}`}
              className="bg-slate-800 text-slate-200 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 border border-slate-700"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>هاتف: {store.phone}</span>
            </a>
          </div>

          {/* Search inside store */}
          <div className="relative flex-1 max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              placeholder="ابحث في قائمة المتجر..."
              className="w-full bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl pr-9 pl-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Custom Service Provider Fields (If Engineer/Real estate) */}
        {store.customFields && (
          <div className="p-4 bg-emerald-500/10 border-b border-emerald-500/20 text-slate-900 dark:text-white space-y-2">
            <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1">
              <Sparkles className="w-4 h-4" />
              <span>بيانات الاشتراك والخدمات المهنية:</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div><strong>نوع الخدمة:</strong> {store.customFields.serviceType}</div>
              <div><strong>نطاق الأسعار:</strong> {store.customFields.priceRange}</div>
              {store.customFields.experienceYears && (
                <div><strong>سنوات الخبرة:</strong> {store.customFields.experienceYears}</div>
              )}
            </div>
            {store.customFields.availableServices && (
              <div className="flex flex-wrap gap-1 pt-1">
                {store.customFields.availableServices.map((srv, idx) => (
                  <span key={idx} className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-lg border border-emerald-500/30">
                    ✓ {srv}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Products List Body */}
        <div className="p-4 overflow-y-auto flex-1 space-y-4 relative">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
            <span>القائمة والمنتجات المتاحة</span>
            <span className="text-xs text-slate-400 font-normal">({filteredProducts.length} عنصر)</span>
          </h3>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs">
              لا توجد منتجات مطابقة لـ "{productSearch}". يمكنك التواصل مباشرة عبر الواتساب للاستفسار!
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {filteredProducts.map((product) => {
                const qty = getQuantity(product.id);

                return (
                  <div
                    key={product.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500/30 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-16 rounded-xl object-cover shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="space-y-0.5">
                        <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                          {product.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                          {product.description}
                        </p>
                        <div className="text-emerald-400 font-black text-xs">
                          {product.price.toLocaleString()} <span className="text-[10px]">ريال يمني</span>
                        </div>
                      </div>
                    </div>

                    {/* Quantity & Add Button */}
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl">
                        <button
                          onClick={() => handleDecrease(product.id)}
                          className="p-1.5 hover:text-emerald-400 cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2 text-xs font-bold text-slate-900 dark:text-white">
                          {qty}
                        </span>
                        <button
                          onClick={() => handleIncrease(product.id)}
                          className="p-1.5 hover:text-emerald-400 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => onAddToCart(product, qty)}
                        className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-3 py-2 rounded-xl flex items-center gap-1 transition-all cursor-pointer active:scale-95 shadow-md shadow-emerald-500/20"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>إضافة للسلة</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Floating Action Button (FAB) for Direct Contact */}
          <div className="sticky bottom-2 right-2 flex flex-col items-end gap-2 z-30 pointer-events-auto">
            <a
              href={`https://wa.me/${store.whatsapp.replace('+', '')}?text=${encodeURIComponent(`مرحباً ${store.title}، لدي استفسار مباشر من تطبيق صقر.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 border-2 border-emerald-300/50 transform hover:scale-105 active:scale-95 transition-all cursor-pointer"
              title="محادثة مباشرة مع التاجر على الواتساب"
            >
              <MessageCircle className="w-5 h-5 fill-slate-950 text-emerald-500" />
              <span className="text-xs font-black">محادثة صاحب المتجر</span>
            </a>
          </div>

        </div>

        {/* Modal Footer with Cart Summary */}
        <div className="p-4 bg-slate-900 text-white border-t border-slate-800 flex items-center justify-between gap-3">
          <div>
            <span className="text-xs text-slate-400 block">إجمالي العناصر المضافة:</span>
            <span className="font-bold text-emerald-400 text-sm">{totalStoreCartCount} عنصر من هذا المتجر</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer"
            >
              متابعة التسوق
            </button>
            <button
              onClick={() => { onClose(); onOpenCart(); }}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>الانتقال للسلة والإتمام</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
