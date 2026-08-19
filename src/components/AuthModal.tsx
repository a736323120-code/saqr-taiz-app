import React, { useState } from 'react';
import { X, Phone, Mail, Lock, KeyRound, ShieldCheck, User, Bike, CheckCircle2, ArrowLeft, Loader2 } from 'lucide-react';
import { UserRole } from '../types';
import { supabase } from '../supabaseClient';
import appIcon from '../assets/images/sagr_app_logo_1786472350763.jpg';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: { name: string; phone: string; role: UserRole }) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  if (!isOpen) return null;

  const [mode, setMode] = useState<'signin' | 'signup' | 'otp' | 'forgot'>('signin');
  const [authMethod, setAuthMethod] = useState<'phone' | 'email'>('email');
  const [phone, setPhone] = useState('771234567');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');
  const [otpCode, setOtpCode] = useState('');
  const [simulatedOtp, setSimulatedOtp] = useState('');
  const [message, setMessage] = useState('');
  const [authError, setAuthError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle Supabase Google OAuth
  const handleGoogleSignIn = async () => {
    setAuthError('');
    setInfoMessage('');
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) {
        setAuthError(error.message);
      }
    } catch (err: any) {
      setAuthError(err?.message || 'حدث خطأ أثناء تسجيل الدخول عبر Google');
    } finally {
      setLoading(false);
    }
  };

  // Handle Supabase Sign In
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setInfoMessage('');
    setLoading(true);

    try {
      const userEmail = email.trim() || (phone.trim() ? `${phone.trim()}@saqr.local` : '');
      const { data, error } = await supabase.auth.signInWithPassword({
        email: userEmail,
        password: password,
      });

      if (error) {
        setAuthError(error.message);
      } else if (data && data.session) {
        // Only redirect when a real session exists
        const userName = data.user?.user_metadata?.full_name || name.trim() || data.user?.email || 'مستخدم منصة صقر';
        const userRole = (data.user?.user_metadata?.role as UserRole) || selectedRole;
        onLoginSuccess({
          name: userName,
          phone: data.user?.user_metadata?.phone || phone.trim(),
          role: userRole,
        });
        onClose();
        window.location.href = '/';
      } else {
        setAuthError('حدث خطأ ولم يتم العثور على جلسة نشطة.');
      }
    } catch (err: any) {
      setAuthError(err?.message || 'حدث خطأ أثناء تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  // Handle Supabase Sign Up
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setInfoMessage('');
    setLoading(true);

    try {
      const userEmail = email.trim() || (phone.trim() ? `${phone.trim()}@saqr.local` : '');
      const { data, error } = await supabase.auth.signUp({
        email: userEmail,
        password: password,
        options: {
          data: {
            full_name: name.trim(),
            phone: phone.trim(),
            role: selectedRole,
          },
        },
      });

      if (error) {
        setAuthError(error.message);
      } else {
        // Successful signup
        // 1) Do NOT auto-login
        // 2) Pre-fill email and switch to Sign In page
        setEmail(userEmail);
        setPassword('');
        setAuthMethod('email');
        setMode('signin');
        // 3) Show success message on Sign In screen
        setInfoMessage('Your account has been created. Please check your email and verify your address before logging in.');
      }
    } catch (err: any) {
      setAuthError(err?.message || 'حدث خطأ أثناء إنشاء الحساب');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) {
      alert('يرجى كتابة رقم الهاتف.');
      return;
    }
    const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setSimulatedOtp(generatedOtp);
    setMode('otp');
    setMessage(`رمز التحقق (OTP) الخاص بك هو: ${generatedOtp}`);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode !== simulatedOtp && otpCode !== '1234') {
      alert('رمز التحقق غير صحيح. جرب 1234 أو الرمز الظاهر على الشاشة.');
      return;
    }

    onLoginSuccess({
      name: name.trim() || 'مستخدم منصة صقر',
      phone: phone.trim(),
      role: selectedRole,
    });
    alert('تم تسجيل الدخول بنجاح! حياك الله في منصة صقر تعز.');
    onClose();
    window.location.href = '/';
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    alert('تم إرسال تعليمات استعادة كلمة المرور عبر رسالة نصية/بريد إلكتروني بنجاح.');
    setMode('signin');
  };

  const switchMode = (newMode: 'signin' | 'signup') => {
    setAuthError('');
    setInfoMessage('');
    setMode(newMode);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl p-6 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 text-slate-400 hover:text-white bg-slate-100 dark:bg-slate-800 rounded-xl cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-1 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="w-16 h-16 rounded-2xl overflow-hidden mx-auto mb-2 shadow-lg shadow-emerald-500/20 border border-emerald-400/30">
            <img src={appIcon} alt="صقر تعز" className="w-full h-full object-cover" />
          </div>
          <h3 className="font-black text-xl text-slate-900 dark:text-white font-sans">
            {mode === 'signin' && 'أهلاً بعودتك - منصة صقر'}
            {mode === 'signup' && 'إنشاء حساب جديد - منصة صقر'}
            {mode === 'otp' && 'التحقق برمز الهاتف (OTP)'}
            {mode === 'forgot' && 'استعادة كلمة المرور'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            حساب واحد مخصص للعملاء، الكباتن، ومزودي الخدمات في تعز
          </p>
        </div>

        {/* Mode Switcher */}
        {mode !== 'otp' && mode !== 'forgot' && (
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl my-4 text-xs font-bold">
            <button
              onClick={() => switchMode('signin')}
              className={`flex-1 py-2 rounded-xl text-center cursor-pointer transition-all ${
                mode === 'signin' ? 'bg-emerald-500 text-slate-950 font-black shadow' : 'text-slate-400'
              }`}
            >
              تسجيل الدخول
            </button>
            <button
              onClick={() => switchMode('signup')}
              className={`flex-1 py-2 rounded-xl text-center cursor-pointer transition-all ${
                mode === 'signup' ? 'bg-emerald-500 text-slate-950 font-black shadow' : 'text-slate-400'
              }`}
            >
              حساب جديد
            </button>
          </div>
        )}

        {/* Form Body */}
        {mode === 'signin' && (
          <form onSubmit={handleSignIn} className="space-y-3 pt-2 text-xs">
            {infoMessage && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs text-center font-bold">
                {infoMessage}
              </div>
            )}
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">طريقة المصادقة</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setAuthMethod('phone')}
                  className={`flex-1 p-2 rounded-xl border font-bold flex items-center justify-center gap-1.5 cursor-pointer ${
                    authMethod === 'phone' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 'border-slate-700 text-slate-400'
                  }`}
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>رقم الهاتف + OTP</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMethod('email')}
                  className={`flex-1 p-2 rounded-xl border font-bold flex items-center justify-center gap-1.5 cursor-pointer ${
                    authMethod === 'email' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 'border-slate-700 text-slate-400'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>البريد الإلكتروني</span>
                </button>
              </div>
            </div>

            {authMethod === 'phone' ? (
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">رقم الهاتف (اليمن) *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="77XXXXXXX"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            ) : (
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">البريد الإلكتروني *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@gmail.com"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            )}

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[11px] text-slate-400">كلمة المرور *</label>
                <button
                  type="button"
                  onClick={() => setMode('forgot')}
                  className="text-[10px] text-emerald-400 hover:underline cursor-pointer"
                >
                  نسيت كلمة المرور؟
                </button>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {authError && (
              <div className="p-2.5 bg-red-500/10 border border-red-500/30 text-red-500 dark:text-red-400 rounded-xl text-[11px] text-center font-bold">
                {authError}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs py-3.5 rounded-2xl cursor-pointer shadow-lg shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>تسجيل الدخول</span>
            </button>

            <div className="relative my-2.5 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-800" />
              </div>
              <span className="relative bg-white dark:bg-slate-900 px-3 text-[10px] text-slate-400 font-medium">
                أو عبر وسائل التواصل
              </span>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs py-2.5 rounded-2xl cursor-pointer border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          </form>
        )}

        {mode === 'signup' && (
          <form onSubmit={handleSignUp} className="space-y-3 pt-2 text-xs">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">نوع الحساب والصلاحية *</label>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => setSelectedRole('customer')}
                  className={`p-2 rounded-xl border text-[11px] font-bold cursor-pointer ${
                    selectedRole === 'customer' ? 'bg-amber-500 text-slate-950 border-amber-500' : 'border-slate-700 text-slate-400'
                  }`}
                >
                  عميل
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole('captain')}
                  className={`p-2 rounded-xl border text-[11px] font-bold cursor-pointer ${
                    selectedRole === 'captain' ? 'bg-amber-500 text-slate-950 border-amber-500' : 'border-slate-700 text-slate-400'
                  }`}
                >
                  كابتن
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole('provider')}
                  className={`p-2 rounded-xl border text-[11px] font-bold cursor-pointer ${
                    selectedRole === 'provider' ? 'bg-amber-500 text-slate-950 border-amber-500' : 'border-slate-700 text-slate-400'
                  }`}
                >
                  مزود خدمة
                </button>
              </div>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">الاسم الكامل *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="أدخل اسمك الكريم"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">البريد الإلكتروني *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">رقم الهاتف اليمني *</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="77XXXXXXX"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 font-bold text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">كلمة المرور *</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            {infoMessage && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs text-center font-bold">
                {infoMessage}
              </div>
            )}

            {authError && (
              <div className="p-2.5 bg-red-500/10 border border-red-500/30 text-red-500 dark:text-red-400 rounded-xl text-[11px] text-center font-bold">
                {authError}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs py-3 rounded-2xl cursor-pointer shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>إنشاء حساب جديد</span>
            </button>

            <div className="relative my-2.5 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-800" />
              </div>
              <span className="relative bg-white dark:bg-slate-900 px-3 text-[10px] text-slate-400 font-medium">
                أو عبر وسائل التواصل
              </span>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs py-2.5 rounded-2xl cursor-pointer border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          </form>
        )}

        {mode === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4 pt-2 text-xs">
            {message && (
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-400 font-mono font-bold text-center">
                {message}
              </div>
            )}

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">أدخل رمز التحقق المكون من 4 أرقام *</label>
              <input
                type="text"
                required
                maxLength={4}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="1234"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-center text-lg font-mono font-bold tracking-widest text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs py-3 rounded-2xl cursor-pointer"
            >
              تأكيد الرمز والدخول فوراً
            </button>
          </form>
        )}

        {mode === 'forgot' && (
          <form onSubmit={handleResetPassword} className="space-y-3 pt-2 text-xs">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">أدخل رقم هاتفك أو بريدك الإلكتروني المسجل *</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="77XXXXXXX"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs py-3 rounded-2xl cursor-pointer"
            >
              إرسال رابط إعادة الضبط
            </button>

            <button
              type="button"
              onClick={() => setMode('signin')}
              className="w-full text-center text-slate-400 hover:text-white text-[11px] block pt-2 cursor-pointer"
            >
              الرجوع لشاشة تسجيل الدخول
            </button>
          </form>
        )}

      </div>
    </div>
  );
};

