import React, { useState, useEffect } from 'react';
import { 
  X, 
  Package, 
  CheckCircle2, 
  Clock, 
  Bike, 
  Phone, 
  RotateCcw, 
  MapPin,
  ChevronRight,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { TaizMap } from './TaizMap';
import appIcon from '../assets/images/sagr_app_logo_1786472350763.jpg';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  onReorder: (order: Order) => void;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  onClose,
  orders,
  onReorder,
}) => {
  if (!isOpen) return null;

  const [selectedOrderIndex, setSelectedOrderIndex] = useState(0);
  const activeOrder = orders[selectedOrderIndex] || orders[0];

  // Captain Position Simulator for live animation
  const [captainCoords, setCaptainCoords] = useState(
    activeOrder?.captainCoords || { lat: 13.5790, lng: 44.0170 }
  );

  useEffect(() => {
    if (!activeOrder || activeOrder.status !== 'on_the_way') return;

    const interval = setInterval(() => {
      setCaptainCoords((prev) => ({
        lat: prev.lat - 0.0001,
        lng: prev.lng - 0.0001,
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [activeOrder]);

  const getStatusStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'received': return 0;
      case 'preparing': return 1;
      case 'on_the_way': return 2;
      case 'delivered': return 3;
      default: return 0;
    }
  };

  const currentStep = activeOrder ? getStatusStepIndex(activeOrder.status) : 0;

  const steps = [
    { title: 'تم الاستلام', desc: 'تأكيد طلبك بالنظام' },
    { title: 'قيد التجهيز', desc: 'إعداد الطلب في المتجر' },
    { title: 'مع المندوب', desc: 'الكابتن يتحرك إليك بتعز' },
    { title: 'تم التسليم', desc: 'وصول الطلب بنجاح' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl overflow-hidden border border-emerald-500/30 shrink-0">
              <img src={appIcon} alt="صقر تتبع" className="w-full h-full object-cover" />
            </div>
            <h3 className="font-extrabold text-base">سجل وتتبع الطلبات المباشرة</h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Orders List Selector Bar (If multiple orders exist) */}
        {orders.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto p-3 bg-slate-100 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800">
            {orders.map((ord, idx) => (
              <button
                key={ord.id}
                onClick={() => { setSelectedOrderIndex(idx); if (ord.captainCoords) setCaptainCoords(ord.captainCoords); }}
                className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedOrderIndex === idx
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-white dark:bg-slate-900 text-slate-400 border border-slate-700'
                }`}
              >
                طلب #{ord.orderNumber} ({ord.total.toLocaleString()} ريال)
              </button>
            ))}
          </div>
        )}

        {/* Modal Body */}
        {!activeOrder ? (
          <div className="p-12 text-center text-slate-400 text-xs space-y-2">
            <Package className="w-12 h-12 text-amber-500/50 mx-auto" />
            <p>لا توجد طلبات سابقة لتتبعها حتى الآن.</p>
          </div>
        ) : (
          <div className="p-4 overflow-y-auto flex-1 space-y-5">
            
            {/* Order Status Stepper */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
                <span>رقم الطلب: <strong className="text-amber-500 font-mono text-sm">#{activeOrder.orderNumber}</strong></span>
                <span className="text-slate-400 font-normal">
                  {new Date(activeOrder.createdAt).toLocaleTimeString('ar-YE', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              {/* Step Progress Bar */}
              <div className="relative grid grid-cols-4 gap-2 text-center">
                {steps.map((st, idx) => {
                  const isCompleted = idx <= currentStep;
                  const isCurrent = idx === currentStep;

                  return (
                    <div key={idx} className="relative z-10 flex flex-col items-center space-y-1">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                          isCompleted
                            ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-500/20'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                        }`}
                      >
                        {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                      </div>

                      <span className={`text-[11px] font-bold ${isCurrent ? 'text-amber-400' : 'text-slate-400'}`}>
                        {st.title}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Captain Details & Taiz Map Tracker */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Bike className="w-4 h-4 text-amber-500" />
                  <span>تتبع المندوب والموقع المباشر في تعز</span>
                </h4>

                <span className="text-[11px] bg-emerald-500/10 text-emerald-500 font-bold px-2 py-0.5 rounded-lg border border-emerald-500/20">
                  الكابتن متحرك الآن 🛵
                </span>
              </div>

              {/* Captain Info Bar */}
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-500 text-slate-950 font-black rounded-xl flex items-center justify-center">
                    صقر
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 dark:text-white">
                      {activeOrder.captainName || 'الكابتن صادق اليعبري'}
                    </h5>
                    <span className="text-[10px] text-slate-400">مندوب توصيل منصة صقر - تعز</span>
                  </div>
                </div>

                <a
                  href={`tel:${activeOrder.captainPhone || '778990011'}`}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>اتصال بالكابتن</span>
                </a>
              </div>

              {/* Interactive Taiz Map */}
              <TaizMap
                captainCoords={captainCoords}
                customerDistrict={activeOrder.district}
                storeTitle={activeOrder.items[0]?.product.storeName || 'متجر صقر تعز'}
                height="280px"
              />
            </div>

            {/* Order Items & Summary Breakdown */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
              <h5 className="font-extrabold text-slate-900 dark:text-white">تفاصيل الطلب والعنوان:</h5>

              <div className="text-slate-400 space-y-1">
                <div><strong>العميل:</strong> {activeOrder.customerName} ({activeOrder.customerPhone})</div>
                <div><strong>العنوان:</strong> {activeOrder.district} - {activeOrder.addressDetails}</div>
                <div><strong>طريقة الدفع:</strong> {activeOrder.paymentMethod === 'kuraimi_bank' ? `تحويل الكريمي (مرجع: ${activeOrder.paymentReceiptRef || 'مكتمل'})` : 'الدفع عند الاستلام (COD)'}</div>
              </div>

              {/* Custom Errand Details */}
              {activeOrder.customErrand && (
                <div className="p-2.5 bg-amber-500/10 rounded-xl border border-amber-500/20">
                  <strong className="text-amber-400 block">تفاصيل المشوار الخاص:</strong>
                  <span>{activeOrder.customErrand.itemDetails}</span>
                </div>
              )}

              {/* Re-order Button */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-200 dark:border-slate-700">
                <span className="font-extrabold text-sm text-amber-500">
                  الإجمالي: {activeOrder.total.toLocaleString()} ريال يمني
                </span>

                <button
                  onClick={() => { onReorder(activeOrder); alert('تمت إعادة إضافة منتجات الطلب إلى السلة بنجاح!'); onClose(); }}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 border border-slate-700 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                  <span>إعادة الطلب (Re-order)</span>
                </button>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
