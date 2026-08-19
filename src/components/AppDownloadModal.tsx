import React, { useState } from 'react';
import { X, Smartphone, Download, CheckCircle2, ShieldCheck, ArrowRight, Share2, Sparkles } from 'lucide-react';
import { SAQR_CONTACT } from '../data/taizData';
import appIcon from '../assets/images/sagr_app_logo_1786472350763.jpg';

interface AppDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AppDownloadModal: React.FC<AppDownloadModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleStartDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      setDownloadSuccess(true);
      
      // Trigger dummy download file creation
      const element = document.createElement("a");
      const file = new Blob([
        "تطبيق صقر تعز الشامل - Saqr Taiz Mobile App\n\nأهلاً بك! تم تحميل حزمة التطبيق بنجاح.\nللتثبيت: افتح الملف واضغط تثبيت."
      ], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = "saqr-taiz-v2.apk";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-emerald-500/30 rounded-3xl shadow-2xl overflow-hidden text-white">
        
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-700 p-5 text-slate-950 relative">
          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-1.5 bg-slate-950/20 hover:bg-slate-950/40 text-slate-950 rounded-full transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-slate-950 text-emerald-400 rounded-2xl overflow-hidden shadow-lg border border-emerald-300/30">
              <img src={appIcon} alt="صقر تعز" className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="bg-slate-950 text-emerald-300 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-400/30">
                النسخة المعتمدة 2.4
              </span>
              <h2 className="text-lg font-black text-slate-950 mt-0.5">
                تطبيق صقر تعز للهواتف الذكية 📲
              </h2>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          
          {/* Main Download CTA */}
          {!downloadSuccess ? (
            <button
              onClick={handleStartDownload}
              disabled={downloading}
              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-slate-950 font-black p-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all cursor-pointer active:scale-95 disabled:opacity-75"
            >
              {downloading ? (
                <>
                  <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>جاري تحضير رابط التحميل...</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5 text-slate-950 animate-bounce" />
                  <span className="text-sm">تحميل التطبيق للاندرويد (APK) مجاناً</span>
                </>
              )}
            </button>
          ) : (
            <div className="bg-emerald-500/15 border border-emerald-500/40 p-4 rounded-2xl text-center space-y-2">
              <div className="w-10 h-10 bg-emerald-500 text-slate-950 rounded-full flex items-center justify-center mx-auto font-black">
                ✓
              </div>
              <h3 className="font-extrabold text-sm text-emerald-400">تم بدء تحميل حزمة saqr-taiz.apk!</h3>
              <p className="text-xs text-slate-300">
                يرجى فتح ملف التحميلات على هاتفك والضغط على "تثبيت".
              </p>
            </div>
          )}

          {/* Installation Steps */}
          <div className="bg-slate-800/80 border border-slate-700/80 p-4 rounded-2xl space-y-3">
            <h4 className="text-xs font-extrabold text-emerald-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>خطوات التثبيت المباشر للاندرويد:</span>
            </h4>
            <ul className="text-xs text-slate-300 space-y-2 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono font-bold text-[10px]">1</span>
                <span>اضغط زر <strong>تحميل التطبيق (APK)</strong> في الأعلى.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono font-bold text-[10px]">2</span>
                <span>عند اكتمال التنزيل، افتح ملف <strong className="text-emerald-300 font-mono">saqr-taiz-v2.apk</strong>.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono font-bold text-[10px]">3</span>
                <span>إذا ظهرت رسالة الأمان، اختر <strong>"تثبيت من هذا المصدر"</strong>.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono font-bold text-[10px]">4</span>
                <span>استمتع بتسوق وتوصيل أسرع وتنبيهات مباشرة لطلباتك في تعز!</span>
              </li>
            </ul>
          </div>

          {/* Alternative Quick Web Shortcut */}
          <div className="text-center pt-1 border-t border-slate-800">
            <p className="text-[11px] text-slate-400">
              تصفح أيضاً كـ web-app سلس على iPhone أو Android بفتح المتصفح وإضافة الصفحة للشاشة الرئيسية 📱
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-slate-950 p-3 text-center border-t border-slate-800">
          <button
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer font-bold"
          >
            إغلاق
          </button>
        </div>

      </div>
    </div>
  );
};
