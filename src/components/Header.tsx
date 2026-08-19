import React from 'react';
import { 
  ShoppingBag, 
  MapPin, 
  User, 
  Bot, 
  Package, 
  Compass, 
  PhoneCall, 
  ShieldCheck,
  Bike,
  PlusCircle,
  ChevronDown,
  Smartphone,
  Download
} from 'lucide-react';
import { UserRole } from '../types';
import { TAIZ_DISTRICTS, SAQR_CONTACT } from '../data/taizData';
import appIcon from '../assets/images/sagr_app_logo_1786472350763.jpg';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  selectedDistrict: string;
  onDistrictChange: (district: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenCustomErrand: () => void;
  onOpenAiAssistant: () => void;
  onOpenAuth: () => void;
  onOpenAddService: () => void;
  onOpenOrdersTracking: () => void;
  activeOrdersCount: number;
  userName?: string;
  favoritesCount?: number;
  onOpenFavorites?: () => void;
  onOpenAppDownload?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  selectedDistrict,
  onDistrictChange,
  cartCount,
  onOpenCart,
  onOpenCustomErrand,
  onOpenAiAssistant,
  onOpenAuth,
  onOpenAddService,
  onOpenOrdersTracking,
  activeOrdersCount,
  userName,
  favoritesCount = 0,
  onOpenFavorites,
  onOpenAppDownload,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md text-white shadow-xl border-b border-emerald-500/20">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-900 text-white text-xs py-1.5 px-3 sm:px-4 font-semibold border-b border-emerald-600/30">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="bg-slate-950 text-emerald-400 px-2.5 py-0.5 rounded-full text-[10px] uppercase font-black tracking-wide border border-emerald-500/40 shrink-0">
              تطبيق تعز الأول 🦅
            </span>
            <span className="text-[11px] sm:text-xs text-emerald-100 font-medium">
              منصة صقر: دليل وتوصيل تعز الشامل - خدمات وسرعة فائقة!
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-emerald-200 shrink-0">
            <a 
              href={`https://wa.me/${SAQR_CONTACT.whatsappRaw}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-white flex items-center gap-1 transition-colors"
            >
              <PhoneCall className="w-3 h-3 text-emerald-400" />
              <span>واتساب الدعم: {SAQR_CONTACT.whatsapp}</span>
            </a>
            <span className="hidden sm:inline text-emerald-500/50">|</span>
            <span className="hidden sm:inline">الكريمي: <strong className="bg-slate-950 text-emerald-300 px-1.5 py-0.5 rounded font-mono border border-emerald-500/30">{SAQR_CONTACT.kuraimiAccount}</strong></span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Right Section: Logo & Location Badge */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="relative group cursor-pointer" onClick={() => onRoleChange('customer')}>
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl overflow-hidden shadow-md shadow-emerald-500/20 transform group-hover:scale-105 transition-transform duration-200 border border-emerald-400/40 bg-slate-900">
                <img src={appIcon} alt="صقر تعز" className="w-full h-full object-cover" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-slate-900"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-1 font-sans">
                  منصة <span className="text-emerald-400">صـقـر</span>
                </h1>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] sm:text-[11px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  تعز
                </span>
              </div>
              <p className="text-[10px] text-slate-300 hidden md:block">
                دليل تجاري • توصيل سريع • مشاوير خاصة
              </p>
            </div>

            {/* Desktop Location Selector */}
            <div className="hidden lg:flex items-center gap-2 bg-slate-800/90 border border-slate-700/80 rounded-2xl px-3 py-1.5 hover:border-emerald-500/40 transition-colors mr-2">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="text-right">
                <span className="text-[9px] text-slate-400 block font-medium">المنطقة في تعز</span>
                <select
                  value={selectedDistrict}
                  onChange={(e) => onDistrictChange(e.target.value)}
                  className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer"
                >
                  {TAIZ_DISTRICTS.map((d) => (
                    <option key={d.id} value={d.id} className="bg-slate-900 text-white">
                      {d.nameAr}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Center Section: Main Service CTAs (Desktop & Tablet) */}
          <div className="hidden md:flex items-center gap-2">
            {/* Custom Errand Button */}
            <button
              onClick={onOpenCustomErrand}
              className="bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-slate-950 font-black text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all cursor-pointer active:scale-95"
              title="طلب مشوار أو توصيل غرض خاص بين أحياء تعز"
            >
              <Bike className="w-4 h-4 text-slate-950 shrink-0" />
              <span>طلب مشوار خاص</span>
            </button>

            {/* AI Assistant Button */}
            <button
              onClick={onOpenAiAssistant}
              className="bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/30 font-bold text-xs px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
              title="تحدث مع مساعد صقر الذكي"
            >
              <Bot className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>مساعد صقر AI</span>
            </button>
          </div>

          {/* Left Section: User Action Icons (Cart, Orders, Favorites, Profile) */}
          <div className="flex items-center gap-1.5 sm:gap-2">

            {/* Mobile Errand Shortcut */}
            <button
              onClick={onOpenCustomErrand}
              className="md:hidden bg-emerald-500 text-slate-950 font-black text-xs p-2 rounded-xl flex items-center gap-1 shadow-md cursor-pointer active:scale-95"
              title="مشوار خاص"
            >
              <Bike className="w-4 h-4" />
              <span className="hidden xs:inline">مشوار</span>
            </button>

            {/* Active Orders Tracker */}
            <button
              onClick={onOpenOrdersTracking}
              className="relative bg-slate-800/90 hover:bg-slate-700 text-slate-200 p-2 sm:px-3 sm:py-2 rounded-xl flex items-center gap-1.5 border border-slate-700/80 transition-all cursor-pointer shrink-0"
              title="متابعة حالة الطلبات الحالية"
            >
              <Package className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="hidden xl:inline text-xs font-semibold">طلباتي</span>
              {activeOrdersCount > 0 && (
                <span className="bg-emerald-500 text-slate-950 text-[10px] font-extrabold px-1.5 py-0.2 rounded-full animate-bounce">
                  {activeOrdersCount}
                </span>
              )}
            </button>

            {/* Shopping Cart & Integrated App Download Button Container */}
            <div className="relative bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl flex items-center shadow-md shadow-emerald-500/20 transition-all shrink-0 border border-emerald-300/40 divide-x divide-x-reverse divide-slate-950/20">
              {/* Shopping Cart Button */}
              <button
                onClick={onOpenCart}
                className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 font-black text-xs hover:bg-slate-950/10 rounded-r-xl transition-all cursor-pointer active:scale-95"
                title="سلة المشتريات والطلبات"
              >
                <ShoppingBag className="w-4.5 h-4.5 shrink-0" />
                <span className="hidden sm:inline">السلة</span>
                {cartCount > 0 && (
                  <span className="bg-slate-950 text-emerald-300 text-[11px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border border-emerald-400/50">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Download App Button inside Cart Button Container */}
              <button
                onClick={onOpenAppDownload}
                className="flex items-center gap-1 px-2.5 py-2 bg-slate-950/15 hover:bg-slate-950/30 text-slate-950 rounded-l-xl transition-all cursor-pointer font-black text-xs"
                title="تحميل تطبيق صقر للهواتف (Android APK)"
              >
                <Smartphone className="w-4 h-4 text-slate-950 shrink-0" />
                <span className="text-[11px] font-black hidden xs:inline">تحميل التطبيق 📲</span>
              </button>
            </div>

            {/* Auth / Profile Trigger */}
            <button
              onClick={onOpenAuth}
              className="bg-slate-800/90 hover:bg-slate-700 border border-slate-700/80 text-slate-200 p-2 sm:px-3 sm:py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
              title="الحساب والتسجيل"
            >
              <User className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-xs font-bold max-w-[80px] truncate hidden md:inline">
                {userName ? userName : 'الحساب'}
              </span>
            </button>

          </div>

        </div>

        {/* Sub-Navigation Row: Mode Segmented Switcher & Merchant Callout */}
        <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
          
          {/* Role Segmented Switcher Control */}
          <div className="flex items-center gap-1 bg-slate-800/90 p-1 rounded-2xl border border-slate-700/70 flex-1 sm:flex-initial">
            <button
              onClick={() => onRoleChange('customer')}
              className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-xl font-extrabold text-[11px] text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                currentRole === 'customer' || currentRole === 'guest'
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>تصفح كعميل</span>
            </button>
            <button
              onClick={() => onRoleChange('captain')}
              className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-xl font-extrabold text-[11px] text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                currentRole === 'captain'
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Bike className="w-3.5 h-3.5" />
              <span>كابتن التوصيل</span>
            </button>
            <button
              onClick={() => onRoleChange('provider')}
              className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-xl font-extrabold text-[11px] text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                currentRole === 'provider'
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>مزود الخدمة</span>
            </button>
          </div>

          {/* Quick Shortcuts: District Selector for Mobile + Add Merchant Button */}
          <div className="flex items-center gap-2 text-[11px] shrink-0">
            {/* Mobile District Selector */}
            <div className="lg:hidden flex items-center gap-1 bg-slate-800/90 text-emerald-300 border border-slate-700 px-2.5 py-1.5 rounded-xl">
              <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <select
                value={selectedDistrict}
                onChange={(e) => onDistrictChange(e.target.value)}
                className="bg-transparent text-[11px] font-bold text-white focus:outline-none cursor-pointer"
              >
                {TAIZ_DISTRICTS.map((d) => (
                  <option key={d.id} value={d.id} className="bg-slate-900 text-white">
                    {d.nameAr}
                  </option>
                ))}
              </select>
            </div>

            {/* Merchant Onboarding Button */}
            <button
              onClick={onOpenAddService}
              className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1.5 rounded-xl font-extrabold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
            >
              <PlusCircle className="w-4 h-4 text-emerald-400" />
              <span>أضف متجرك أو نشاطك ➕</span>
            </button>
          </div>

        </div>

      </div>
    </header>
  );
};

