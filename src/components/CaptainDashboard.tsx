import React, { useState } from 'react';
import { 
  Bike, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Phone, 
  Navigation, 
  AlertCircle,
  Building2,
  DollarSign
} from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { TaizMap } from './TaizMap';
import appIcon from '../assets/images/sagr_app_logo_1786472350763.jpg';

interface CaptainDashboardProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
}

export const CaptainDashboard: React.FC<CaptainDashboardProps> = ({
  orders,
  onUpdateOrderStatus,
}) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'my_deliveries'>('pending');

  const pendingOrders = orders.filter((o) => o.status === 'received' || o.status === 'preparing');
  const activeDeliveries = orders.filter((o) => o.status === 'on_the_way');

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      
      {/* Captain Welcome Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-slate-900 to-amber-700 text-white p-6 rounded-3xl border border-amber-500/30 shadow-xl space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-lg border border-amber-400/40 shrink-0">
              <img src={appIcon} alt="صقر اللوجستية" className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="text-xl font-black">واجهة الكباتن - صقر اللوجستية تعز</h2>
              <p className="text-xs text-slate-300">أهلاً بك الكابتن صادق اليعبري! التغطية الحالية: مديريات تعز (القاهرة، المظفر، صالة، شارع جمال، المسبح...)</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-900/80 px-4 py-2 rounded-2xl border border-slate-700 text-xs font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>الحالة: متصل وجاهز للاستلام 🟢</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 rounded-2xl font-bold text-xs transition-all cursor-pointer ${
            activeTab === 'pending'
              ? 'bg-amber-500 text-slate-950'
              : 'bg-slate-800 text-slate-300'
          }`}
        >
          الطلبات المتاحة للتوصيل ({pendingOrders.length})
        </button>

        <button
          onClick={() => setActiveTab('my_deliveries')}
          className={`px-4 py-2 rounded-2xl font-bold text-xs transition-all cursor-pointer ${
            activeTab === 'my_deliveries'
              ? 'bg-amber-500 text-slate-950'
              : 'bg-slate-800 text-slate-300'
          }`}
        >
          طلباتي الحالية قيد التوصيل ({activeDeliveries.length})
        </button>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {activeTab === 'pending' ? (
          pendingOrders.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-400 text-xs">
              لا توجد طلبات جديدة معلقة حالياً في أحياء تعز.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-3 shadow-md"
                >
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-amber-500">طلب #{ord.orderNumber}</span>
                    <span className="bg-amber-500/10 text-amber-400 px-2.5 py-1 rounded-lg border border-amber-500/20">
                      رسوم التوصيل: {ord.deliveryFee.toLocaleString()} ريال
                    </span>
                  </div>

                  <div className="text-xs text-slate-300 space-y-1">
                    <div><strong>العميل:</strong> {ord.customerName} ({ord.customerPhone})</div>
                    <div><strong>المنطقة بتعز:</strong> {ord.district} - {ord.addressDetails}</div>
                    <div><strong>إجمالي المبلغ:</strong> {ord.total.toLocaleString()} ريال يمني</div>
                  </div>

                  {ord.customErrand && (
                    <div className="p-2.5 bg-amber-500/10 rounded-xl text-xs text-amber-300 border border-amber-500/20">
                      📌 مشوار خاص: {ord.customErrand.itemDetails}
                    </div>
                  )}

                  <div className="pt-2 flex gap-2">
                    <button
                      onClick={() => onUpdateOrderStatus(ord.id, 'on_the_way')}
                      className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs py-2.5 rounded-xl cursor-pointer shadow-md"
                    >
                      قبول الطلب وبدء التوصيل 🛵
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          activeDeliveries.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-400 text-xs">
              ليس لديك طلبات نشطة قيد التوصيل حالياً.
            </div>
          ) : (
            <div className="space-y-4">
              {activeDeliveries.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-amber-400">طلب #{ord.orderNumber} - جارِ التوصيل</h4>
                      <p className="text-xs text-slate-400">الوجهة: {ord.district} - {ord.addressDetails}</p>
                    </div>

                    <a
                      href={`tel:${ord.customerPhone}`}
                      className="bg-emerald-600 text-white font-bold text-xs px-3 py-2 rounded-xl flex items-center gap-1"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>اتصال بالعميل</span>
                    </a>
                  </div>

                  {/* Interactive Map for Captain Navigation */}
                  <TaizMap
                    captainCoords={ord.captainCoords}
                    customerDistrict={ord.district}
                    height="240px"
                  />

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                    <span className="text-xs font-bold text-slate-300">
                      المبلغ المطلوب استلامه: <strong className="text-amber-400">{ord.total.toLocaleString()} ريال</strong>
                    </span>

                    <button
                      onClick={() => onUpdateOrderStatus(ord.id, 'delivered')}
                      className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>تأكيد تسليم الطلب بنجاح</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>

    </div>
  );
};
