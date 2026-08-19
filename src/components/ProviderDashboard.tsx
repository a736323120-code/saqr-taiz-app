import React from 'react';
import { ShieldCheck, PlusCircle, Building2, MapPin, Phone, Star, MessageCircle } from 'lucide-react';
import { StoreListing } from '../types';
import appIcon from '../assets/images/sagr_app_logo_1786472350763.jpg';

interface ProviderDashboardProps {
  myListings: StoreListing[];
  onOpenAddService: () => void;
}

export const ProviderDashboard: React.FC<ProviderDashboardProps> = ({
  myListings,
  onOpenAddService,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-900 to-amber-700 text-white p-6 rounded-3xl border border-amber-500/30 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl overflow-hidden border border-amber-400/40 shrink-0">
              <img src={appIcon} alt="دليل صقر" className="w-full h-full object-cover" />
            </div>
            <h2 className="text-xl font-black">لوحة تحكم مزودي الخدمات والتجار بتعز</h2>
          </div>
          <p className="text-xs text-slate-300">
            أدر إدراجاتك في دليل تعز الشامل، استقبال استفسارات العملاء عبر الواتساب والهاتف، وإضافة عروضك الجديدة.
          </p>
        </div>

        <button
          onClick={onOpenAddService}
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-5 py-3 rounded-2xl flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>إضافة نشاط / خدمة جديدة</span>
        </button>
      </div>

      {/* Listings Section */}
      <div className="space-y-3">
        <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
          نشاطاتي وخدماتي المدرجة بالدليل ({myListings.length})
        </h3>

        {myListings.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-400 text-xs space-y-3">
            <Building2 className="w-12 h-12 text-amber-500/50 mx-auto" />
            <p>لم تقم بإضافة أي نشاط تجاري أو خدمي حتى الآن.</p>
            <button
              onClick={onOpenAddService}
              className="bg-amber-500 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs"
            >
              أضف نشاطك الأول الآن
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myListings.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 space-y-3 shadow-md"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-16 h-16 rounded-2xl object-cover shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{item.title}</h4>
                    <p className="text-xs text-slate-400">{item.addressDetails}</p>
                    <span className="text-[10px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full font-bold">
                      المنطقة: {item.district}
                    </span>
                  </div>
                </div>

                {item.customFields && (
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-xs space-y-1">
                    <div><strong>نوع الخدمة:</strong> {item.customFields.serviceType}</div>
                    <div><strong>الأسعار:</strong> {item.customFields.priceRange}</div>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-emerald-400 font-bold pt-2 border-t border-slate-800">
                  <span>الحالة: معتمد ومنشور بالدليل 🟢</span>
                  <span>هاتف: {item.phone}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
