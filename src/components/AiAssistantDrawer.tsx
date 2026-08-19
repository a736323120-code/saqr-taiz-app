import React, { useState, useRef, useEffect } from 'react';
import { X, Bot, Send, Sparkles, User, RefreshCw, MessageCircle } from 'lucide-react';
import { SAQR_CONTACT } from '../data/taizData';
import appIcon from '../assets/images/sagr_app_logo_1786472350763.jpg';

interface AiAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  userDistrict?: string;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  time: string;
}

export const AiAssistantDrawer: React.FC<AiAssistantDrawerProps> = ({
  isOpen,
  onClose,
  userDistrict,
}) => {
  if (!isOpen) return null;

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: `حياك الله مع المساعد الذكي "صقر AI"! 🦅
أنا هنا لإجابتك عن أي استفسارات تخص المطاعم، الصيدليات، خدمات المهندسين والعقارات، أو كيفية طلب مشوار توصيل خاص في مدينة تعز! كيف أقدر أساعدك اليوم؟`,
      time: new Date().toLocaleTimeString('ar-YE', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const quickQuestions = [
    'أيش أسرع صيدلية متوفرة بالمسبح؟ 💊',
    'كيف أسدد قيمة الطلب عبر تحويل الكريمي؟ 🏦',
    'كم رسوم التوصيل لحي الحوبان أو القاهرة؟ 🛵',
    'أين أجد مطاعم السلته والوجبات الشعبية؟ 🍲',
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const prompt = (textToSend || inputPrompt).trim();
    if (!prompt || isLoading) return;

    const userMsg: ChatMessage = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      text: prompt,
      time: new Date().toLocaleTimeString('ar-YE', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, userDistrict }),
      });

      const data = await res.json();

      const aiMsg: ChatMessage = {
        id: 'ai-' + Date.now(),
        sender: 'ai',
        text: data.reply || 'أهلاً بك! يسعدني إجابتك دائماً عبر منصة صقر تعز.',
        time: new Date().toLocaleTimeString('ar-YE', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: 'err-' + Date.now(),
          sender: 'ai',
          text: 'أهلاً بك! يمكنك تصفح الدليل والتواصل المباشر مع دعم منصة صقر عبر الواتساب: +967780947342.',
          time: new Date().toLocaleTimeString('ar-YE', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex justify-end animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 w-full max-w-md h-full flex flex-col shadow-2xl relative">
        
        {/* Drawer Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl overflow-hidden border border-emerald-500/30 shrink-0">
              <img src={appIcon} alt="صقر AI" className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="font-extrabold text-base flex items-center gap-1.5">
                <span>صقر AI</span>
                <span className="text-[10px] bg-amber-500 text-slate-950 font-bold px-1.5 py-0.2 rounded-full">
                  ذكي تعز
                </span>
              </h3>
              <p className="text-[10px] text-slate-400">مساعدك الذكي للاستفسارات بمدينة تعز</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Question Chips */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="shrink-0 bg-white dark:bg-slate-900 hover:border-amber-500 text-slate-700 dark:text-slate-300 text-[11px] font-bold px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 transition-all cursor-pointer whitespace-nowrap"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-2 ${
                msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl overflow-hidden flex items-center justify-center font-bold text-xs shrink-0 ${
                  msg.sender === 'user'
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-800 text-amber-400 border border-slate-700'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <img src={appIcon} alt="صقر AI" className="w-full h-full object-cover" />}
              </div>

              <div
                className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-amber-500 text-slate-950 font-semibold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700/80'
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>
                <span
                  className={`text-[9px] block text-left mt-1 ${
                    msg.sender === 'user' ? 'text-slate-900/60' : 'text-slate-400'
                  }`}
                >
                  {msg.time}
                </span>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-amber-400 p-2">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>صقر AI يفكر بالإجابة...</span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Direct Contact Support Footer */}
        <div className="p-2 bg-slate-100 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 text-center text-[10px] text-slate-400">
          دعم مباشر عبر الواتساب: <a href={`https://wa.me/${SAQR_CONTACT.whatsappRaw}`} target="_blank" rel="noopener noreferrer" className="text-amber-400 font-bold underline">{SAQR_CONTACT.whatsapp}</a>
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="اكتب سؤالك لصقر AI هنا..."
            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={isLoading || !inputPrompt.trim()}
            className="bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 p-2.5 rounded-xl cursor-pointer transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
