import React, { useState } from 'react';
import { X, MapPin, Bike, Clock, AlertCircle, CheckCircle2, DollarSign } from 'lucide-react';
import { CustomErrandRequest } from '../types';
import { TAIZ_DISTRICTS } from '../data/taizData';
import appIcon from '../assets/images/sagr_app_logo_1786472350763.jpg';

interface CustomErrandModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitErrand: (errand: CustomErrandRequest) => void;
}

export const CustomErrandModal: React.FC<CustomErrandModalProps> = ({
  isOpen,
  onClose,
  onSubmitErrand,
}) => {
  if (!isOpen) return null;

  const [pickupDistrict, setPickupDistrict] = useState('شارع جمال');
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffDistrict, setDropoffDistrict] = useState('القاهرة');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [itemDetails, setItemDetails] = useState('');
  const [estimatedCost, setEstimatedCost] = useState('');
  const [notes, setNotes] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pickupLocation.trim() || !dropoffLocation.trim() || !itemDetails.trim()) {
      alert('يرجى ملء تفاصيل الاستلام، التسليم، ووصف الغرض المطلوب توصيله.');
      return;
    }

    const errand: CustomErrandRequest = {
      pickupDistrict,
      pickupLocation: pickupLocation.trim(),
      dropoffDistrict,
      dropoffLocation: dropoffLocation.trim(),
      itemDetails: itemDetails.trim(),
      estimatedCost: estimatedCost ? parseFloat(estimatedCost) : undefined,
      notes: notes.trim(),
      isUrgent,
    };

    onSubmitErrand(errand);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl space-y-4 p-6 relative">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl overflow-hidden border border-emerald-500/30 shrink-0">
              <img src={appIcon} alt="صقر توصيل" className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="font-black text-lg text-slate-900 dark:text-white">
                طلب مشوار / خدمة توصيل خاصة
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                مناديب صقر يوصلون أي غرض أو شحنة بين أحياء مدينة تعز بدقة وسرعة!
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-100 dark:bg-slate-800 rounded-xl cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          
          {/* Pickup Section */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-amber-500">
              <MapPin className="w-4 h-4" />
              <span>1. موقع الاستلام (منين نستلم الغرض؟)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">المنطقة في تعز</label>
                <select
                  value={pickupDistrict}
                  onChange={(e) => setPickupDistrict(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-2 font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  {TAIZ_DISTRICTS.filter((d) => d.id !== 'all').map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.nameAr}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">العنوان التفصيلي</label>
                <input
                  type="text"
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  placeholder="اسم الشارع، المعلم، أو اسم المحل"
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-2 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Dropoff Section */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-emerald-500">
              <MapPin className="w-4 h-4" />
              <span>2. موقع التسليم (لوين نوصل الغرض؟)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">المنطقة في تعز</label>
                <select
                  value={dropoffDistrict}
                  onChange={(e) => setDropoffDistrict(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-2 font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  {TAIZ_DISTRICTS.filter((d) => d.id !== 'all').map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.nameAr}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">العنوان التفصيلي</label>
                <input
                  type="text"
                  value={dropoffLocation}
                  onChange={(e) => setDropoffLocation(e.target.value)}
                  placeholder="اسم المنزل، العمارة، الشارع أو جولة التلاقي"
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-2 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-3">
            <div>
              <label className="font-bold text-slate-900 dark:text-white block mb-1">
                3. وصف الغرض أو المهمة المطلوبة
              </label>
              <textarea
                value={itemDetails}
                onChange={(e) => setItemDetails(e.target.value)}
                rows={2}
                placeholder="مثال: شراء علاج خاص من صيدلية التعاون بالمسبح وإحضار الفاتورة، أو توصيل ظروف مستندات لشركة في شارع جمال..."
                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl p-3 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500 text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-bold text-slate-900 dark:text-white block mb-1">
                  الميزانية / قيمة الغرض التقريبية (إن وجدت)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={estimatedCost}
                    onChange={(e) => setEstimatedCost(e.target.value)}
                    placeholder="مثال: 4000"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-2 pr-3 pl-16 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-bold">
                    ريال يمني
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-5">
                <input
                  type="checkbox"
                  id="urgentToggle"
                  checked={isUrgent}
                  onChange={(e) => setIsUrgent(e.target.checked)}
                  className="w-4 h-4 text-amber-500 rounded focus:ring-amber-500 cursor-pointer"
                />
                <label htmlFor="urgentToggle" className="font-bold text-amber-500 cursor-pointer text-xs">
                  طلب توصيل عاجل وخاص (أولوية فائقة)
                </label>
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-6 py-2.5 rounded-xl shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              إضافة المشوار إلى السلة
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
