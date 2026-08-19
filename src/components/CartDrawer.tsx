import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Tag, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  User, 
  Building2, 
  CreditCard, 
  Bike,
  Sparkles,
  ArrowLeft,
  AlertCircle,
  Smartphone,
  Download
} from 'lucide-react';
import { CartItem, CustomErrandRequest, PaymentMethod } from '../types';
import { TAIZ_DISTRICTS, SAQR_CONTACT } from '../data/taizData';
import { supabase } from '../supabaseClient';
import { createOrderInSupabase } from '../supabaseService';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  customErrand?: CustomErrandRequest;
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearErrand: () => void;
  onOrderCreated: (order: any) => void;
  isGuest: boolean;
  onPromptAuth: () => void;
  onOpenAppDownload?: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  customErrand,
  onUpdateQuantity,
  onRemoveItem,
  onClearErrand,
  onOrderCreated,
  isGuest,
  onPromptAuth,
  onOpenAppDownload,
}) => {
  if (!isOpen) return null;

  // Checkout Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [district, setDistrict] = useState('شارع جمال');
  const [addressDetails, setAddressDetails] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [receiptRef, setReceiptRef] = useState('');

  // Coupon State
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<{
    percent?: number;
    amount?: number;
    description?: string;
  } | null>(null);
  const [couponError, setCouponError] = useState('');
  const [isVerifyingCoupon, setIsVerifyingCoupon] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Subtotal Calculation
  const itemsSubtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const errandEstimatedCost = customErrand?.estimatedCost || 0;
  const subtotal = itemsSubtotal + errandEstimatedCost;

  // Delivery Fee based on District in Taiz
  const getDeliveryFee = (dist: string) => {
    if (dist === 'الحوبان' || dist === 'صالة') return 1500;
    if (dist === 'الروضة' || dist === 'عصيفرة') return 1200;
    return 1000; // Standard Taiz city rate
  };

  const deliveryFee = customErrand?.isUrgent ? getDeliveryFee(district) + 500 : getDeliveryFee(district);

  // Calculate discount amount
  let discountAmount = 0;
  if (appliedDiscount) {
    if (appliedDiscount.percent) {
      discountAmount = Math.round((subtotal * appliedDiscount.percent) / 100);
    } else if (appliedDiscount.amount) {
      discountAmount = appliedDiscount.amount;
    }
  }

  const grandTotal = Math.max(0, subtotal + deliveryFee - discountAmount);

  // Apply Coupon Code
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setIsVerifyingCoupon(true);
    setCouponError('');

    try {
      const res = await fetch('/api/coupons/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode, subtotal }),
      });
      const data = await res.json();

      if (data.valid) {
        setAppliedDiscount({
          percent: data.discountPercent,
          amount: data.discountAmount,
          description: data.description,
        });
        setCouponError('');
      } else {
        setAppliedDiscount(null);
        setCouponError(data.message || 'كود الخصم غير صالح');
      }
    } catch (err) {
      setCouponError('تعذر التحقق من الكود حالياً');
    } finally {
      setIsVerifyingCoupon(false);
    }
  };

  // Submit Final Checkout Order
  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cartItems.length === 0 && !customErrand) {
      alert('السلة فارغة! أضف بعض المنتجات أو طلب مشوار خاص للبدء.');
      return;
    }

    if (!customerName.trim() || !customerPhone.trim() || !addressDetails.trim()) {
      alert('يرجى كتابة الاسم ورقم الهاتف والعنوان التفصيلي للتسليم.');
      return;
    }

    if (paymentMethod === 'kuraimi_bank' && !receiptRef.trim()) {
      alert('عند اختيار الدفع عبر الكريمي للصرافة، يرجى إدخال رقم إشعار/رقم حوالة التحويل للتحقق.');
      return;
    }

    if (isGuest) {
      onPromptAuth();
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = {
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        district,
        addressDetails: addressDetails.trim(),
        items: cartItems,
        customErrand,
        subtotal,
        deliveryFee,
        discount: discountAmount,
        total: grandTotal,
        paymentMethod,
        paymentReceiptRef: receiptRef.trim() || undefined,
      };

      const { data: { session } } = await supabase.auth.getSession();
      const newOrder = await createOrderInSupabase(orderData, session?.user?.id);

      if (newOrder) {
        onOrderCreated(newOrder);
        onClose();
      } else {
        // Fallback to local server API if Supabase call fails
        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderData),
        });

        const data = await res.json();

        if (data.success && data.order) {
          onOrderCreated(data.order);
          onClose();
        } else {
          alert('حدث خطأ أثناء إرسال الطلب، يرجى المحاولة ثانية.');
        }
      }
    } catch (err) {
      console.error(err);
      alert('تعذر الاتصال بالخادم. حاول مجدداً.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex justify-end animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 w-full max-w-lg h-full flex flex-col shadow-2xl relative">
        
        {/* Drawer Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-400" />
            <h3 className="font-extrabold text-base">سلة المشتريات وإتمام الطلب</h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* App Download Callout Banner inside Cart Drawer */}
        {onOpenAppDownload && (
          <div className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 text-slate-950 px-4 py-2.5 flex items-center justify-between gap-2 shadow-sm border-b border-emerald-400/30">
            <div className="flex items-center gap-2 overflow-hidden">
              <Smartphone className="w-4 h-4 text-slate-950 shrink-0 animate-bounce" />
              <span className="text-xs font-black truncate">حمل تطبيق صقر للهاتف (Android APK) 📲</span>
            </div>
            <button
              onClick={onOpenAppDownload}
              className="bg-slate-950 hover:bg-slate-900 text-emerald-300 px-3 py-1 rounded-xl text-xs font-black cursor-pointer shadow transition-all shrink-0 active:scale-95 flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>تحميل</span>
            </button>
          </div>
        )}

        {/* Drawer Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          
          {/* Empty State */}
          {cartItems.length === 0 && !customErrand ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mx-auto">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-base">
                سلتك فارغة حالياً
              </h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                استكشف دليل تعز والمتاجر لإضافة الوجبات والمواد الغذائية أو اطلب مشوار توصيل خاص بأغراضك!
              </p>
            </div>
          ) : (
            <>
              {/* Custom Errand Card (If attached) */}
              {customErrand && (
                <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl relative space-y-2">
                  <button
                    onClick={onClearErrand}
                    className="absolute top-3 left-3 text-red-400 hover:text-red-500 text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>إلغاء المشوار</span>
                  </button>

                  <div className="flex items-center gap-1.5 font-bold text-xs text-amber-400">
                    <Bike className="w-4 h-4" />
                    <span>طلب مشوار خاص (توصيل غرض)</span>
                  </div>

                  <p className="text-xs text-slate-200 font-semibold">{customErrand.itemDetails}</p>

                  <div className="text-[11px] text-slate-400 space-y-0.5">
                    <div><strong>من:</strong> {customErrand.pickupDistrict} - {customErrand.pickupLocation}</div>
                    <div><strong>إلى:</strong> {customErrand.dropoffDistrict} - {customErrand.dropoffLocation}</div>
                    {customErrand.estimatedCost && (
                      <div className="text-amber-400 font-bold">
                        ميزانية الشراء التقديرية: {customErrand.estimatedCost.toLocaleString()} ريال
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Cart Items List */}
              {cartItems.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-extrabold text-xs text-slate-400 uppercase tracking-wider">
                    المنتجات المختارة ({cartItems.length})
                  </h4>

                  {cartItems.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex items-center justify-between gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-12 h-12 rounded-xl object-cover shrink-0"
                        referrerPolicy="no-referrer"
                      />

                      <div className="flex-1 min-w-0">
                        <h5 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                          {item.product.name}
                        </h5>
                        <div className="text-[10px] text-slate-400 truncate">
                          {item.product.storeName}
                        </div>
                        <div className="text-amber-500 font-bold text-xs mt-0.5">
                          {(item.product.price * item.quantity).toLocaleString()} ريال
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg">
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, -1)}
                            className="p-1 hover:text-amber-500 cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-bold text-slate-900 dark:text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, 1)}
                            className="p-1 hover:text-amber-500 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => onRemoveItem(item.product.id)}
                          className="text-slate-400 hover:text-red-400 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Coupon Code Verification Box */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-amber-500" />
                  <span>كود الخصم الترويجي</span>
                </label>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="جرب كود TAIZ20 أو SQR10"
                    className="flex-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs uppercase font-mono font-bold text-slate-900 dark:text-white focus:outline-none"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    disabled={isVerifyingCoupon}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer"
                  >
                    {isVerifyingCoupon ? 'جارِ...' : 'تطبيق'}
                  </button>
                </div>

                {appliedDiscount && (
                  <div className="text-[11px] text-emerald-500 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>تم تطبيق الخصم: {appliedDiscount.description}</span>
                  </div>
                )}

                {couponError && (
                  <div className="text-[11px] text-red-400 font-bold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{couponError}</span>
                  </div>
                )}
              </div>

              {/* Delivery Address & Customer Details Form */}
              <form id="checkoutForm" onSubmit={handleCheckout} className="space-y-3 pt-2">
                <h4 className="font-extrabold text-xs text-slate-400 uppercase tracking-wider">
                  بيانات العميل وعنوان التوصيل بتعز
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">الاسم الكامل *</label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="أدخل اسمك"
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">رقم الهاتف للتواصل *</label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="77XXXXXXX"
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">المنطقة في تعز *</label>
                    <select
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 font-bold text-slate-900 dark:text-white focus:outline-none"
                    >
                      {TAIZ_DISTRICTS.filter((d) => d.id !== 'all').map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.nameAr}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">العنوان التفصيلي *</label>
                    <input
                      type="text"
                      required
                      value={addressDetails}
                      onChange={(e) => setAddressDetails(e.target.value)}
                      placeholder="اسم الشارع، المعلم، أو أرقام المنازل"
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* Payment Method Selector */}
                <div className="space-y-2 pt-2">
                  <label className="font-extrabold text-xs text-slate-400 uppercase tracking-wider block">
                    طريقة الدفع والسداد
                  </label>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    
                    {/* COD Choice */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cod')}
                      className={`p-3 rounded-2xl font-bold border text-right transition-all cursor-pointer ${
                        paymentMethod === 'cod'
                          ? 'bg-amber-500/10 border-amber-500 text-amber-500'
                          : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-400'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <CreditCard className="w-4 h-4" />
                        <span>الدفع عند الاستلام</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-normal">تسليم المبلغ للكابتن فور الوصول</span>
                    </button>

                    {/* Kuraimi Choice */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('kuraimi_bank')}
                      className={`p-3 rounded-2xl font-bold border text-right transition-all cursor-pointer ${
                        paymentMethod === 'kuraimi_bank'
                          ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500'
                          : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-400'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <Building2 className="w-4 h-4" />
                        <span>تحويل بنك الكريمي</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-normal">حساب رقم {SAQR_CONTACT.kuraimiAccount}</span>
                    </button>

                  </div>

                  {/* Kuraimi Account Details Box */}
                  {paymentMethod === 'kuraimi_bank' && (
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-xs space-y-2 text-slate-900 dark:text-white">
                      <div className="font-bold text-emerald-500 flex items-center justify-between">
                        <span>شبكة الكريمي للصرافة (حساب المبيعات):</span>
                        <strong className="bg-emerald-500 text-slate-950 px-2 py-0.5 rounded font-mono text-sm">
                          {SAQR_CONTACT.kuraimiAccount}
                        </strong>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        اسم الحساب: <strong>{SAQR_CONTACT.kuraimiAccountName}</strong>
                      </p>
                      <div>
                        <label className="text-[11px] font-bold block mb-1">
                          أدخل رقم إشعار التحويل / السند البنكي *
                        </label>
                        <input
                          type="text"
                          required
                          value={receiptRef}
                          onChange={(e) => setReceiptRef(e.target.value)}
                          placeholder="رقم العملية أو إشعار التحويل من تطبيق الكريمي"
                          className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-2 text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none"
                        />
                      </div>
                    </div>
                  )}

                </div>

              </form>
            </>
          )}

        </div>

        {/* Total Summary & Checkout Button Footer */}
        {(cartItems.length > 0 || customErrand) && (
          <div className="p-4 bg-slate-900 text-white border-t border-slate-800 space-y-3">
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>مجموع المنتجات/الخدمات:</span>
                <span>{subtotal.toLocaleString()} ريال يمني</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>رسوم التوصيل ({district}):</span>
                <span>{deliveryFee.toLocaleString()} ريال يمني</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400 font-bold">
                  <span>الخصم المطبق:</span>
                  <span>- {discountAmount.toLocaleString()} ريال يمني</span>
                </div>
              )}
              <div className="flex justify-between text-base font-black text-amber-400 pt-1 border-t border-slate-800">
                <span>الإجمالي النهائي:</span>
                <span>{grandTotal.toLocaleString()} ريال يمني</span>
              </div>
            </div>

            <button
              form="checkoutForm"
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm py-3 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer transition-all active:scale-95"
            >
              <span>{isSubmitting ? 'جارِ إرسال الطلب...' : 'إتمام الطلب وتوصيله مع الكابتن'}</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
