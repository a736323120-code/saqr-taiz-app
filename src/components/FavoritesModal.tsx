import React, { useState } from 'react';
import { 
  Heart, 
  X, 
  Search, 
  MapPin, 
  Star, 
  Phone, 
  MessageCircle, 
  Clock, 
  ChevronLeft, 
  Trash2, 
  Sparkles, 
  Store,
  Filter
} from 'lucide-react';
import { StoreListing, CategoryId } from '../types';
import { DIRECTORY_CATEGORIES, TAIZ_DISTRICTS } from '../data/taizData';

interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
  stores: StoreListing[];
  favoriteStoreIds: string[];
  onToggleFavorite: (storeId: string) => void;
  onClearAllFavorites: () => void;
  onSelectStore: (store: StoreListing) => void;
}

export const FavoritesModal: React.FC<FavoritesModalProps> = ({
  isOpen,
  onClose,
  stores,
  favoriteStoreIds,
  onToggleFavorite,
  onClearAllFavorites,
  onSelectStore,
}) => {
  if (!isOpen) return null;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');

  // Filter full list of stores to only favorited ones
  const favoriteStores = stores.filter((s) => favoriteStoreIds.includes(s.id));

  // Apply internal filters
  const filteredFavorites = favoriteStores.filter((store) => {
    const matchesCategory = selectedCategory === 'all' || store.category === selectedCategory;
    const matchesDistrict = selectedDistrict === 'all' || store.district === selectedDistrict;
    
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch = !query || 
      store.title.toLowerCase().includes(query) ||
      store.district.toLowerCase().includes(query) ||
      store.addressDetails.toLowerCase().includes(query);

    return matchesCategory && matchesDistrict && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fade-in">
      <div className="bg-[#141416] border border-emerald-500/30 rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-[#141416] via-[#1d1d21] to-[#141416] p-5 border-b border-emerald-500/20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Heart className="w-6 h-6 text-slate-950 fill-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-[#fdfbf7] flex items-center gap-2 font-sans">
                  مفضلة المتاجر والخدمات 🦅
                </h2>
                <span className="bg-emerald-500/20 text-emerald-300 text-xs font-black px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  {favoriteStores.length} متجر
                </span>
              </div>
              <p className="text-xs text-[#eee6d6]/70 mt-0.5">
                قائمة متاجر تعز والخدمات المفضلة المحفوظة في حسابك للوصول السريع
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {favoriteStores.length > 0 && (
              <button
                onClick={onClearAllFavorites}
                className="hidden sm:flex items-center gap-1 bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-500/30 text-xs px-3 py-1.5 rounded-xl transition-all cursor-pointer"
                title="مسح جميع المتاجر المفضلة"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>إفراغ القائمة</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="bg-[#1d1d21] text-[#fdfbf7] p-2 rounded-xl hover:bg-[#29292e] transition-all border border-emerald-500/20 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Controls (Shown only if there are favorite stores) */}
        {favoriteStores.length > 0 && (
          <div className="p-4 bg-[#1d1d21]/60 border-b border-emerald-500/15 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              
              {/* Search Bar */}
              <div className="sm:col-span-8 relative">
                <Search className="w-4 h-4 text-emerald-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث في مفضلتك باسم المتجر أو الحي..."
                  className="w-full bg-[#141416] text-xs sm:text-sm text-[#fdfbf7] border border-emerald-500/20 rounded-xl pr-10 pl-3 py-2.5 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* District Filter */}
              <div className="sm:col-span-4 relative">
                <MapPin className="w-4 h-4 text-emerald-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full bg-[#141416] text-xs text-[#fdfbf7] border border-emerald-500/20 rounded-xl pr-9 pl-3 py-2.5 font-bold focus:outline-none focus:border-emerald-500 cursor-pointer appearance-none"
                >
                  <option value="all">جميع الأحياء ({favoriteStores.length})</option>
                  {TAIZ_DISTRICTS.filter((d) => d.id !== 'all').map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.nameAr}
                    </option>
                  ))}
                </select>
                <Filter className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

            </div>

            {/* Category Pills Slider */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`shrink-0 px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-emerald-500 text-slate-950 font-black'
                    : 'bg-[#141416] text-[#eee6d6] hover:text-emerald-400 border border-slate-800'
                }`}
              >
                الكل ({favoriteStores.length})
              </button>
              {DIRECTORY_CATEGORIES.filter((c) => c.id !== 'all').map((cat) => {
                const count = favoriteStores.filter((s) => s.category === cat.id).length;
                if (count === 0) return null;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`shrink-0 px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer border ${
                      selectedCategory === cat.id
                        ? 'bg-emerald-500 text-slate-950 font-black border-emerald-500'
                        : 'bg-[#141416] text-[#eee6d6] border-slate-800 hover:border-emerald-500/40'
                    }`}
                  >
                    {cat.nameAr} ({count})
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Favorites Content Body */}
        <div className="p-5 overflow-y-auto flex-1">
          {favoriteStores.length === 0 ? (
            /* Empty State */
            <div className="py-12 text-center space-y-4 bg-[#1d1d21]/30 rounded-3xl border border-dashed border-emerald-500/20 p-8">
              <div className="w-20 h-20 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20 shadow-inner">
                <Heart className="w-10 h-10 stroke-1" />
              </div>
              <div className="space-y-1 max-w-md mx-auto">
                <h3 className="text-lg font-bold font-sans text-[#fdfbf7]">
                  لا توجد متاجر في المفضلة حالياً
                </h3>
                <p className="text-xs text-[#eee6d6]/70 leading-relaxed">
                  يمكنك إضافة أي متجر، مطعم، صيدلية، أو مهندس في تعز إلى المفضلة بالضغط على رمز القلب ❤️ في دليل المنصة للوصول السريع إليها لاحقاً!
                </p>
              </div>
              <button
                onClick={onClose}
                className="bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-slate-950 font-black text-xs px-6 py-3 rounded-2xl shadow-lg shadow-emerald-500/20 transition-all cursor-pointer active:scale-95 flex items-center gap-2 mx-auto"
              >
                <Store className="w-4 h-4" />
                <span>استكشف دليل تعز وتصفح المتاجر</span>
              </button>
            </div>
          ) : filteredFavorites.length === 0 ? (
            /* Filter Empty State */
            <div className="py-12 text-center space-y-3">
              <p className="text-sm text-[#eee6d6]">
                لم نجد متاجر مفضلة تطابق خيارات الفلترة المحددة.
              </p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); setSelectedDistrict('all'); }}
                className="bg-[#1d1d21] text-emerald-400 text-xs font-bold px-4 py-2 rounded-xl border border-emerald-500/30"
              >
                إلغاء تصفية الفلاتر
              </button>
            </div>
          ) : (
            /* Grid of Favorited Stores */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredFavorites.map((store) => (
                <div
                  key={store.id}
                  className="bg-[#1d1d21] border border-emerald-500/20 hover:border-emerald-500/50 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="relative h-36 w-full bg-[#0f0f10]">
                    <img
                      src={store.image}
                      alt={store.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#141416] via-transparent to-black/40" />

                    {/* Top Bar Badges & Remove Heart */}
                    <div className="absolute top-2.5 right-2.5 left-2.5 flex items-center justify-between">
                      <span className="bg-[#0f0f10]/80 text-emerald-400 text-[10px] font-bold px-2.5 py-0.5 rounded-lg border border-emerald-500/30 backdrop-blur flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-emerald-400" />
                        {store.district}
                      </span>

                      <button
                        onClick={() => onToggleFavorite(store.id)}
                        className="bg-red-500/20 hover:bg-red-500/40 text-red-400 p-1.5 rounded-xl border border-red-500/40 backdrop-blur transition-all cursor-pointer"
                        title="إزالة من المفضلة"
                      >
                        <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                      </button>
                    </div>

                    {/* Delivery Time Badge */}
                    {store.deliveryTimeEstimate && (
                      <div className="absolute bottom-2 right-2 bg-[#0f0f10]/90 text-[#eee6d6] text-[10px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1 border border-slate-700">
                        <Clock className="w-3 h-3 text-emerald-400" />
                        <span>{store.deliveryTimeEstimate}</span>
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-bold text-sm sm:text-base text-[#fdfbf7] group-hover:text-emerald-400 transition-colors line-clamp-1">
                          {store.title}
                        </h3>
                        <div className="flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded text-xs font-bold shrink-0">
                          <Star className="w-3 h-3 fill-emerald-400" />
                          <span>{store.rating}</span>
                        </div>
                      </div>

                      <p className="text-xs text-[#eee6d6]/60 line-clamp-1 mt-1">
                        {store.addressDetails}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-2 border-t border-emerald-500/10 flex items-center justify-between gap-2">
                      <a
                        href={`https://wa.me/${store.whatsapp.replace('+', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-xl transition-all"
                        title="تواصل مباشر عبر الواتساب"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </a>

                      <a
                        href={`tel:${store.phone}`}
                        className="p-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-xl transition-all"
                        title="اتصال هاتفي مباشر"
                      >
                        <Phone className="w-4 h-4" />
                      </a>

                      <button
                        onClick={() => {
                          onClose();
                          onSelectStore(store);
                        }}
                        className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-slate-950 font-black text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-1 transition-all cursor-pointer shadow-md shadow-emerald-500/20"
                      >
                        <span>تصفح والطلب</span>
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#141416] border-t border-emerald-500/20 flex items-center justify-between text-xs text-[#eee6d6]/60">
          <span>يتم حفظ مفضلتك تلقائياً في جهازك للأوقات القادمة</span>
          <button
            onClick={onClose}
            className="bg-[#1d1d21] hover:bg-[#29292e] text-[#fdfbf7] px-4 py-2 rounded-xl font-bold border border-slate-700 cursor-pointer"
          >
            إغلاق
          </button>
        </div>

      </div>
    </div>
  );
};
