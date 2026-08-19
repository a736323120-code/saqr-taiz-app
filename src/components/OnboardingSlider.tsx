import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Sparkles, ShoppingBag, Percent, Bike, CheckCircle2, X } from 'lucide-react';
import appIcon from '../assets/images/sagr_app_logo_1786472350763.jpg';

interface OnboardingSliderProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAuth: () => void;
}

export const OnboardingSlider: React.FC<OnboardingSliderProps> = ({
  isOpen,
  onClose,
  onOpenAuth,
}) => {
  if (!isOpen) return null;

  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 'welcome',
      badge: 'منصة صقر للتسوق والتوصيل',
      title: 'أهلاً بك في منصة صقر تعز',
      subtitle: 'دليلك التجارِي الشامل وتوصيل الطلبات السريع في كل أحياء ومناطق محافظة تعز',
      icon: (
        <div className="w-28 h-28 mx-auto rounded-3xl overflow-hidden p-1 shadow-2xl shadow-emerald-500/30 border-2 border-emerald-400/40 bg-slate-900">
          <img src={appIcon} alt="صقر تعز" className="w-full h-full object-cover rounded-2xl" />
        </div>
      ),
      bgGradient: 'from-emerald-950/90 via-slate-900 to-slate-950',
    },
    {
      id: 'search',
      badge: 'تسوق أفضل المتاجر',
      title: 'ابحث عن أفضل المنتجات',
      subtitle: 'تصفح قائمة واسعة من المطاعم، المتاجر، الصيدليات، الخدمات الهندسية والعقارات في مكان واحد',
      icon: (
        <div className="w-24 h-24 mx-auto rounded-3xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40 shadow-xl">
          <ShoppingBag className="w-12 h-12 text-emerald-400" />
        </div>
      ),
      bgGradient: 'from-slate-900 via-emerald-950/60 to-slate-950',
    },
    {
      id: 'offers',
      badge: 'وفر أكثر يومياً',
      title: 'أكتشف العروض والخصومات',
      subtitle: 'استفد من خصومات حصرية تصل إلى 50% على أشهر المنتجات والوجبات والمشروبات في تعز',
      icon: (
        <div className="w-24 h-24 mx-auto rounded-3xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40 shadow-xl">
          <Percent className="w-12 h-12 text-emerald-400" />
        </div>
      ),
      bgGradient: 'from-slate-900 via-emerald-950/70 to-slate-950',
    },
    {
      id: 'delivery',
      badge: 'توصيل دقيق وسريع',
      title: 'توصيل سريع والمتابعة',
      subtitle: 'تابِع حركة كابتن التوصيل مباشرة على الخريطة حتى يصل طلبك إلى باب منزلَك أو كافيهك',
      icon: (
        <div className="w-24 h-24 mx-auto rounded-3xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40 shadow-xl">
          <Bike className="w-12 h-12 text-emerald-400" />
        </div>
      ),
      bgGradient: 'from-emerald-950 via-slate-900 to-slate-950',
    },
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  };

  const slide = slides[currentSlide];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-slate-900 border border-emerald-500/30 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative flex flex-col">
        
        {/* Top Header Controls */}
        <div className="p-4 flex items-center justify-between z-10">
          <button
            onClick={onClose}
            className="text-emerald-400 text-xs font-extrabold hover:text-emerald-300 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20 cursor-pointer"
          >
            تخطي
          </button>
          
          {/* Progress Indicators */}
          <div className="flex items-center gap-1.5">
            {slides.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentSlide === idx ? 'w-6 bg-emerald-500' : 'w-2 bg-slate-700'
                }`}
              />
            ))}
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Slide Body */}
        <div className={`p-8 text-center flex-1 flex flex-col justify-center items-center bg-gradient-to-b ${slide.bgGradient} transition-all duration-500 space-y-6`}>
          {slide.icon}

          <div className="space-y-2 max-w-xs mx-auto">
            <span className="inline-block bg-emerald-500/20 text-emerald-300 text-[11px] font-black px-3 py-1 rounded-full border border-emerald-500/30">
              {slide.badge}
            </span>
            <h2 className="text-2xl font-black text-white font-sans tracking-tight">
              {slide.title}
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              {slide.subtitle}
            </p>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="p-6 bg-slate-950 border-t border-emerald-500/20 space-y-3">
          {currentSlide === slides.length - 1 ? (
            <div className="space-y-2">
              <button
                onClick={() => {
                  onClose();
                  onOpenAuth();
                }}
                className="w-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400 hover:from-emerald-500 hover:to-emerald-300 text-slate-950 font-black text-sm py-3.5 px-4 rounded-2xl shadow-lg shadow-emerald-500/20 transition-all cursor-pointer active:scale-95"
              >
                تسجيل الدخول / إنشاء حساب
              </button>
              <button
                onClick={onClose}
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold py-2.5 rounded-xl border border-slate-700 cursor-pointer"
              >
                المتابعة كزائر
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-3">
              {currentSlide > 0 ? (
                <button
                  onClick={handlePrev}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 p-3 rounded-2xl border border-slate-700 cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              ) : <div />}

              <button
                onClick={handleNext}
                className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer active:scale-95 transition-all"
              >
                <span>التالي</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
