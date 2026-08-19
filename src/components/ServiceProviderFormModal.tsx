import React, { useState } from 'react';
import { X, ShieldCheck, Building2, MapPin, Phone, MessageCircle, PlusCircle, CheckCircle2 } from 'lucide-react';
import { CategoryId } from '../types';
import { DIRECTORY_CATEGORIES, TAIZ_DISTRICTS } from '../data/taizData';
import appIcon from '../assets/images/sagr_app_logo_1786472350763.jpg';

interface ServiceProviderFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddListing: (listing: any) => void;
}

export const ServiceProviderFormModal: React.FC<ServiceProviderFormModalProps> = ({
  isOpen,
  onClose,
  onAddListing,
}) => {
  if (!isOpen) return null;

  const [providerName, setProviderName] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CategoryId>('engineers');
  const [district, setDistrict] = useState('شارع جمال');
  const [addressDetails, setAddressDetails] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [description, setDescription] = useState('');
  const [servicesInput, setServicesInput] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !phone.trim() || !addressDetails.trim()) {
      alert('يرجى كتابة اسم النشاط أو الخدمة ورقم الهاتف والعنوان في تعز.');
      return;
    }

    const availableServices = servicesInput
      ? servicesInput.split(',').map((s) => s.trim()).filter(Boolean)
      : ['خدمات متكاملة'];

    const newListing = {
      title: title.trim(),
      category,
      district,
      addressDetails: addressDetails.trim(),
      image: imageUrl.trim() || 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
      rating: 5.0,
      reviewCount: 1,
      phone: phone.trim(),
      whatsapp: whatsapp.trim() || phone.trim(),
      isFeatured: true,
      isOpen: true,
      customFields: {
        serviceType: description.trim() || 'خدمة معتمدة بمدينة تعز',
        priceRange: priceRange.trim() || 'أسعار مناسبة',
        availableServices,
      },
    };

    onAddListing(newListing);
    alert('تم إضافة نشاطك التجاري/الخدمي بنجاح إلى دليل منصة صقر تعز!');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl p-6 relative">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl overflow-hidden border border-amber-500/30 shrink-0">
              <img src={appIcon} alt="صقر تعز" className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="font-black text-lg text-slate-900 dark:text-white">
                اشتراك وإضافة نشاط إلى دليل تعز الشامل
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                للمهندسين، ملاك المطاعم، المتاجر الإلكترونية، ومكاتب العقارات بمدينة تعز
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
        <form onSubmit={handleSubmit} className="space-y-3 pt-3 text-xs sm:text-sm">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">اسم النشاط أو المكتب / المتجر *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مثال: المكتب الهندسي أو مطعم تعز"
                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">تصنيف الدليل *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryId)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 font-bold text-slate-900 dark:text-white focus:outline-none"
              >
                {DIRECTORY_CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nameAr}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
                placeholder="مثال: شارع جمال - عمارة الأمل"
                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">رقم الهاتف للتواصل *</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="042XXXXX"
                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">رقم الواتساب للتواصل</label>
              <input
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="+9677XXXXXXX"
                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] text-slate-400 block mb-1">وصف الخدمة / نوع النشاط</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="مثال: استشارات هندسية، تأجير شقق مفروشة، وجبات تعزية شعبية..."
              className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">نطاق الأسعار / الرسوم</label>
              <input
                type="text"
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                placeholder="مثال: شقق من 80,000 ريال يمني"
                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">الخدمات المقدمة (مفصولة بفاصلة)</label>
              <input
                type="text"
                value={servicesInput}
                onChange={(e) => setServicesInput(e.target.value)}
                placeholder="تصميم معماري, إشراف, صيانة"
                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>

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
              نشر النشاط بالدليل فوراً
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
