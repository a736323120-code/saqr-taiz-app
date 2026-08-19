import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Star, 
  Phone, 
  MessageCircle, 
  Clock, 
  PlusCircle, 
  Sparkles, 
  UtensilsCrossed, 
  Coffee, 
  ShoppingCart, 
  Apple, 
  Pill, 
  ShoppingBag, 
  Wrench, 
  Home, 
  Briefcase, 
  LayoutGrid,
  ChevronLeft,
  CheckCircle2,
  Filter,
  Heart
} from 'lucide-react';
import { CategoryId, StoreListing } from '../types';
import { DIRECTORY_CATEGORIES, TAIZ_DISTRICTS } from '../data/taizData';

interface DirectorySectionProps {
  stores: StoreListing[];
  selectedCategory: CategoryId;
  onCategoryChange: (category: CategoryId) => void;
  selectedDistrict: string;
  onDistrictChange: (district: string) => void;
  onSelectStore: (store: StoreListing) => void;
  onOpenAddService: () => void;
  onOpenCustomErrand: () => void;
  favoriteStoreIds?: string[];
  onToggleFavorite?: (storeId: string) => void;
  onOpenFavorites?: () => void;
}

const CATEGORY_ICONS: Record<string, React.FC<{ className?: string }>> = {
  LayoutGrid,
  UtensilsCrossed,
  Coffee,
  ShoppingCart,
  Apple,
  Pill,
  ShoppingBag,
  Wrench,
  Home,
  Briefcase,
};

export const DirectorySection: React.FC<DirectorySectionProps> = ({
  stores,
  selectedCategory,
  onCategoryChange,
  selectedDistrict,
  onDistrictChange,
  onSelectStore,
  onOpenAddService,
  onOpenCustomErrand,
  favoriteStoreIds = [],
  onToggleFavorite,
  onOpenFavorites,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter stores based on Search Query, Category, and Selected District
  const filteredStores = stores.filter((store) => {
    const matchesCategory = selectedCategory === 'all' || store.category === selectedCategory;
    const matchesDistrict = selectedDistrict === 'all' || store.district === selectedDistrict;
    
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch = !query || 
      store.title.toLowerCase().includes(query) ||
      store.district.toLowerCase().includes(query) ||
      store.addressDetails.toLowerCase().includes(query) ||
      (store.customFields?.serviceType && store.customFields.serviceType.toLowerCase().includes(query)) ||
      (store.customFields?.availableServices && store.customFields.availableServices.some(s => s.toLowerCase().includes(query)));

    return matchesCategory && matchesDistrict && matchesSearch;
  });

  return (
    <section className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      
      {/* Title & Add Service Banner Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/90 p-5 rounded-3xl border border-emerald-500/20 text-white shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white font-sans">
              دليل تعز الشامل والخدمات 🦅
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            استكشف أحدث المطاعم، الصيدليات، المتاجر، المهندسين والعقارات في جميع أحياء مدينة تعز.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onOpenFavorites && (
            <button
              onClick={onOpenFavorites}
              className="bg-slate-800 hover:bg-slate-700 border border-emerald-500/30 text-emerald-300 font-bold text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer relative"
              title="عرض المتاجر المفضلة المحفوظة"
            >
              <Heart className={`w-4 h-4 ${favoriteStoreIds.length > 0 ? 'fill-red-500 text-red-500' : 'text-emerald-400'}`} />
              <span>المفضلة</span>
              {favoriteStoreIds.length > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full">
                  {favoriteStoreIds.length}
                </span>
              )}
            </button>
          )}

          <button
            onClick={onOpenAddService}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>أضف نشاطك / خدمتك بالدليل</span>
          </button>

          <button
            onClick={onOpenCustomErrand}
            className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-emerald-300 font-bold text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>طلب مشوار خاص</span>
          </button>
        </div>
      </div>

      {/* Advanced Search Engine & District Selector */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        
        {/* Search Input */}
        <div className="md:col-span-8 relative">
          <Search className="w-5 h-5 text-emerald-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث باسم المتجر، المنتج، المهندس، أو نوع الخدمة في تعز..."
            className="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 rounded-2xl pr-11 pl-4 py-3.5 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-sm"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg"
            >
              مسح
            </button>
          )}
        </div>

        {/* District Selector Filter */}
        <div className="md:col-span-4 relative">
          <MapPin className="w-5 h-5 text-emerald-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={selectedDistrict}
            onChange={(e) => onDistrictChange(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 rounded-2xl pr-11 pl-4 py-3.5 text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-sm cursor-pointer appearance-none"
          >
            {TAIZ_DISTRICTS.map((d) => (
              <option key={d.id} value={d.id}>
                {d.nameAr}
              </option>
            ))}
          </select>
          <Filter className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

      </div>

      {/* Category Pills Slider */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {DIRECTORY_CATEGORIES.map((cat) => {
          const IconComponent = CATEGORY_ICONS[cat.icon] || LayoutGrid;
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`shrink-0 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 flex items-center gap-2 border cursor-pointer ${
                isSelected
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20 font-black scale-102'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-emerald-500/40'
              }`}
            >
              <IconComponent className={`w-4 h-4 ${isSelected ? 'text-slate-950' : 'text-emerald-500'}`} />
              <span>{cat.nameAr}</span>
            </button>
          );
        })}
      </div>

      {/* Results Count Badge */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium px-1">
        <span>
          تم العثور على <strong className="text-emerald-400 font-bold">{filteredStores.length}</strong> نشاط تجاري وخدمي في تعز
        </span>
        {selectedDistrict !== 'all' && (
          <span className="bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-lg border border-emerald-500/20 font-bold">
            الفرز حسب: {selectedDistrict}
          </span>
        )}
      </div>

      {/* Store Listings Grid */}
      {filteredStores.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-4">
          <div className="w-16 h-16 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mx-auto">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            لم نجد نتائج مطابقة لـ "{searchQuery}"
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            جرب البحث بكلمة مختلفة أو اختر حي يمني آخر في تعز، أو أضف خدمتك الجديدة فوراً في دليل المنصة!
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => { setSearchQuery(''); onCategoryChange('all'); onDistrictChange('all'); }}
              className="bg-slate-800 text-white font-bold text-xs px-4 py-2 rounded-xl"
            >
              إعادة ضبط الفلاتر
            </button>
            <button
              onClick={onOpenAddService}
              className="bg-amber-500 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl"
            >
              إضافة نشاط جديد
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredStores.map((store) => {
            const isFav = favoriteStoreIds.includes(store.id);

            return (
              <div
                key={store.id}
                className="group bg-[#141416] border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col"
              >
                {/* Store Thumbnail Image */}
                <div className="relative h-48 w-full overflow-hidden bg-[#0f0f10]">
                  <img
                    src={store.image}
                    alt={store.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141416] via-transparent to-transparent" />

                  {/* Top Badges & Heart Toggle */}
                  <div className="absolute top-3.5 right-3.5 left-3.5 flex items-center justify-between">
                    <span className="bg-[#0f0f10]/80 text-emerald-400 backdrop-blur text-[11px] font-extrabold px-2.5 py-1 rounded-xl border border-slate-800 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-400" />
                      {store.district}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {store.isFeatured && (
                        <span className="bg-emerald-500 text-slate-950 text-[10px] font-black px-2.5 py-1 rounded-xl shadow-sm">
                          موصى به ⭐
                        </span>
                      )}

                      {onToggleFavorite && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite(store.id);
                          }}
                          className={`p-2 rounded-xl backdrop-blur transition-all cursor-pointer ${
                            isFav 
                              ? 'bg-red-500/20 text-red-500 border border-red-500/40' 
                              : 'bg-[#0f0f10]/80 hover:bg-[#0f0f10] text-[#eee6d6] hover:text-red-400 border border-slate-800'
                          }`}
                          title={isFav ? 'إزالة من المفضلة' : 'حفظ في المفضلة'}
                        >
                          <Heart className={`w-4 h-4 ${isFav ? 'fill-red-500 text-red-500' : ''}`} />
                        </button>
                      )}
                    </div>
                  </div>

                {/* Delivery Time Badge */}
                {store.deliveryTimeEstimate && (
                  <div className="absolute bottom-3.5 right-3.5 bg-[#0f0f10]/90 text-[#eee6d6] text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 backdrop-blur border border-slate-800">
                    <Clock className="w-3 h-3 text-emerald-400" />
                    <span>{store.deliveryTimeEstimate}</span>
                  </div>
                )}
              </div>

              {/* Store Details Content */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-black text-base text-[#fdfbf7] line-clamp-1 group-hover:text-emerald-400 transition-colors">
                      {store.title}
                    </h3>
                    <div className="flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg text-xs font-bold shrink-0">
                      <Star className="w-3 h-3 fill-emerald-400" />
                      <span>{store.rating}</span>
                      <span className="text-[10px] text-[#eee6d6]/60">({store.reviewCount})</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#eee6d6]/70 line-clamp-1 mt-1.5">
                    {store.addressDetails}
                  </p>

                  {/* Professional Services Custom Fields Display (Engineers / Real Estate) */}
                  {store.customFields && (
                    <div className="mt-3 p-3 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1.5 text-xs">
                      {store.customFields.serviceType && (
                        <div className="text-emerald-400 font-bold text-[11px]">
                          📌 {store.customFields.serviceType}
                        </div>
                      )}
                      {store.customFields.priceRange && (
                        <div className="text-[#eee6d6] font-semibold text-[11px]">
                          💰 {store.customFields.priceRange}
                        </div>
                      )}
                      {store.customFields.availableServices && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {store.customFields.availableServices.slice(0, 3).map((srv, idx) => (
                            <span key={idx} className="bg-[#141416] text-[#eee6d6] px-2 py-0.5 rounded text-[10px] border border-slate-800">
                              ✓ {srv}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer Buttons */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2.5">
                  
                  {/* WhatsApp Direct Contact Button */}
                  <a
                    href={`https://wa.me/${store.whatsapp.replace('+', '')}?text=${encodeURIComponent(`مرحباً ${store.title}، أتواصل معك عبر منصة صقر تعز.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-xl transition-all border border-emerald-500/20"
                    title="تواصل مباشر عبر الواتساب"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>

                  {/* Call Direct Button */}
                  <a
                    href={`tel:${store.phone}`}
                    className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all border border-slate-700"
                    title="اتصال هاتفي مباشر"
                  >
                    <Phone className="w-4 h-4" />
                  </a>

                  {/* View Products / Order Button */}
                  <button
                    onClick={() => onSelectStore(store)}
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-slate-950 font-black text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-1 transition-all cursor-pointer shadow-sm"
                  >
                    <span>
                      {store.category === 'engineers' || store.category === 'realestate' || store.category === 'services'
                        ? 'عرض التفاصيل والطلب'
                        : 'تصفح قائمة الطعام/المنتجات'}
                    </span>
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>

                </div>

              </div>
            </div>
          );
        })}
        </div>
      )}

    </section>
  );
};
