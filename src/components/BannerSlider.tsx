import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Sparkles, Bike, Tag, ShieldCheck, ArrowLeft } from 'lucide-react';

interface BannerSliderProps {
  onOpenCustomErrand: () => void;
  onSelectCategory: (category: string) => void;
  onOpenAddService: () => void;
}

export const BannerSlider: React.FC<BannerSliderProps> = ({
  onOpenCustomErrand,
  onSelectCategory,
  onOpenAddService,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      title: 'منصة صقر - الدليل والتوصيل الأول في تعز!',
      subtitle: 'تجمع المطاعم، البقالات، الصيدليات، والمشاوير اللوجستية في تطبيق واحد سلس وودود.',
      badge: 'خدمة فائقة السرعة',
      bgGradient: 'from-emerald-900 via-emerald-800 to-slate-900',
      icon: Sparkles,
      buttonText: 'طلب مشوار توصيل سريع',
      action: onOpenCustomErrand,
      secondaryText: 'تصفح دليل تعز',
      secondaryAction: () => onSelectCategory('all'),
      image: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 2,
      title: 'خصم 20% بمناسبة الافتتاح في تعز!',
      subtitle: 'استخدم كود الخصم (TAIZ20) عند السداد واحصل على خصم فوري مميز على مشترياتك وتوصيلك.',
      badge: 'عروض الخصم الترويجية',
      bgGradient: 'from-emerald-950 via-emerald-800 to-teal-900',
      icon: Tag,
      buttonText: 'تصفح العروض والمتاجر',
      action: () => onSelectCategory('restaurants'),
      secondaryText: 'استخدم كود TAIZ20',
      secondaryAction: () => onSelectCategory('all'),
      image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 3,
      title: 'دفع وإيداع مالي آمن عبر شبكة الكريمي',
      subtitle: 'سدد قيمة مشترياتك أو خدمات التوصيل فوراً عبر رقم الحساب المعتمد (2180919) أو الدفع عند الاستلام.',
      badge: 'الكريمي للصرافة - 2180919',
      bgGradient: 'from-slate-900 via-emerald-900 to-slate-950',
      icon: ShieldCheck,
      buttonText: 'طلب خدمة أو مشوار',
      action: onOpenCustomErrand,
      secondaryText: 'واتساب الدعم المباشر',
      secondaryAction: () => window.open('https://wa.me/967780947342', '_blank'),
      image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 4,
      title: 'أنت مهندس أو صاحب محل أو مكتب عقار في تعز؟',
      subtitle: 'انضم إلى دليل تعز الشامل واعرض خدماتك ومنتجاتك لآلاف العملاء يومياً عبر منصة صقر.',
      badge: 'اشتراك مزودي الخدمات',
      bgGradient: 'from-amber-700 via-slate-900 to-emerald-900',
      icon: Bike,
      buttonText: 'أضف نشاطك في الدليل الآن',
      action: onOpenAddService,
      secondaryText: 'شاهد الدليل التجاري',
      secondaryAction: () => onSelectCategory('services'),
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handleNext = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const handlePrev = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const active = slides[currentSlide];
  const IconComp = active.icon;

  return (
    <div className="relative w-full overflow-hidden my-4 px-4 max-w-7xl mx-auto">
      <div className={`relative rounded-3xl bg-gradient-to-r ${active.bgGradient} text-white shadow-2xl p-6 sm:p-8 md:p-10 border border-amber-500/30 transition-all duration-500 overflow-hidden`}>
        
        {/* Background Image Overlay with blur */}
        <div className="absolute inset-0 opacity-20 bg-cover bg-center mix-blend-overlay pointer-events-none" style={{ backgroundImage: `url(${active.image})` }} />

        {/* Decorative subtle glows */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 items-center gap-6">
          
          {/* Content Column */}
          <div className="md:col-span-8 space-y-4 text-right">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-bold">
              <IconComp className="w-3.5 h-3.5 text-emerald-400" />
              <span>{active.badge}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black leading-tight tracking-tight text-white">
              {active.title}
            </h2>

            <p className="text-sm sm:text-base text-slate-200/90 max-w-2xl font-normal leading-relaxed">
              {active.subtitle}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={active.action}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm px-5 py-3 rounded-2xl flex items-center gap-2 shadow-lg shadow-emerald-500/30 transition-all cursor-pointer active:scale-95"
              >
                <span>{active.buttonText}</span>
                <ArrowLeft className="w-4 h-4" />
              </button>

              <button
                onClick={active.secondaryAction}
                className="bg-slate-900/80 hover:bg-slate-800 text-slate-100 border border-slate-700/80 font-bold text-xs sm:text-sm px-4 py-3 rounded-2xl transition-all cursor-pointer"
              >
                {active.secondaryText}
              </button>
            </div>
          </div>

          {/* Image & Badge Card Column */}
          <div className="hidden md:col-span-4 md:flex justify-center items-center">
            <div className="relative w-full max-w-[260px] aspect-4/3 rounded-2xl overflow-hidden shadow-2xl border-2 border-emerald-400/40 group">
              <img
                src={active.image}
                alt={active.title}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-3">
                <span className="text-emerald-300 text-xs font-bold drop-shadow">
                  منصة صقر - تعز
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Navigation Arrows */}
        <button
          onClick={handlePrev}
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-slate-950/50 hover:bg-slate-950/80 text-white p-2 rounded-full backdrop-blur transition-all border border-slate-700 cursor-pointer"
          aria-label="السهام السابقة"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-slate-950/50 hover:bg-slate-950/80 text-white p-2 rounded-full backdrop-blur transition-all border border-slate-700 cursor-pointer"
          aria-label="السهام التالية"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Slider Indicator Dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                currentSlide === idx ? 'w-6 bg-emerald-400' : 'w-2 bg-slate-500/60 hover:bg-slate-400'
              }`}
              aria-label={`شريحة ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </div>
  );
};
