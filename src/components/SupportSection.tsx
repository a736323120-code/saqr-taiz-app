import React from 'react';
import { PhoneCall, MessageCircle, Mail, Building2, MapPin, ShieldCheck, Clock, Heart } from 'lucide-react';
import { SAQR_CONTACT } from '../data/taizData';
import appIcon from '../assets/images/sagr_app_logo_1786472350763.jpg';

export const SupportSection: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-white border-t border-amber-500/20 mt-12 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 space-y-10">
        
        {/* Support Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-2xl overflow-hidden shadow-lg border border-emerald-500/30 shrink-0">
                <img src={appIcon} alt="صقر تعز" className="w-full h-full object-cover" />
              </div>
              <h3 className="font-extrabold text-lg text-white">منصة <span className="text-amber-400">صقر</span> تعز</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              التطبيق الموحد لخدمات التوصيل السريع والمشاوير اللوجستية والدليل التجاري والمهني لمدينة تعز باليمن.
            </p>
            <div className="text-[11px] text-amber-400 font-semibold flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>{SAQR_CONTACT.officeAddress}</span>
            </div>
          </div>

          {/* Direct Support Contacts */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-amber-400">الدعم الفني المباشر</h4>
            <div className="space-y-2 text-xs">
              
              {/* WhatsApp Direct */}
              <a
                href={`https://wa.me/${SAQR_CONTACT.whatsappRaw}?text=${encodeURIComponent('مرحباً فريق منصة صقر تعز، أحتاج مساعدة.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 p-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/20 transition-all"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>واتساب: {SAQR_CONTACT.whatsapp}</span>
              </a>

              {/* Email Direct */}
              <a
                href={`mailto:${SAQR_CONTACT.email}`}
                className="flex items-center gap-2.5 p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 transition-all"
              >
                <Mail className="w-4 h-4 text-amber-400" />
                <span>البريد: {SAQR_CONTACT.email}</span>
              </a>

            </div>
          </div>

          {/* Bank Payment Account */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-amber-400">حساب السداد البنكي</h4>
            <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <Building2 className="w-4 h-4" />
                <span>شبكة الكريمي للصرافة</span>
              </div>
              <p className="text-[11px] text-slate-300">
                رقم الحساب المعتمد: <strong className="bg-emerald-500 text-slate-950 font-mono px-2 py-0.5 rounded text-xs">{SAQR_CONTACT.kuraimiAccount}</strong>
              </p>
              <p className="text-[10px] text-slate-400">
                اسم الحساب: {SAQR_CONTACT.kuraimiAccountName}
              </p>
            </div>
          </div>

          {/* Taiz Coverage Areas */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-amber-400">مناطق التغطية والتوصيل</h4>
            <p className="text-xs text-slate-400">
              خدمات الكباتن متوفرة على مدار الساعة في: القاهرة، المظفر، صالة، شارع جمال، المسبح، الروضة، عصيفرة، الحوبان، والمرور.
            </p>
            <div className="flex items-center gap-1 text-xs text-emerald-400 font-bold">
              <Clock className="w-3.5 h-3.5" />
              <span>خدمة شغالين 24 ساعة يومياً</span>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-wrap items-center justify-between gap-2">
          <span>© 2026 جميع الحقوق محفوظة - منصة صقر تعز للتوصيل والدليل التجاري</span>
          <span className="flex items-center gap-1">
            صنع بـ <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> لخدمة أبناء مدينة تعز
          </span>
        </div>

      </div>
    </footer>
  );
};
