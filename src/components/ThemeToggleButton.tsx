import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleButtonProps {
  onThemeChange?: (isDark: boolean) => void;
}

export const ThemeToggleButton: React.FC<ThemeToggleButtonProps> = ({ onThemeChange }) => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('saqr_theme_mode');
      if (saved) {
        return saved === 'dark';
      }
    } catch {
      // Default to dark mode for Saqr brand
    }
    return true;
  });

  // Apply theme to document element and body
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    if (isDark) {
      root.classList.add('dark');
      root.classList.remove('light');
      body.classList.remove('light-mode');
      try {
        localStorage.setItem('saqr_theme_mode', 'dark');
      } catch (e) {
        console.error(e);
      }
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      body.classList.add('light-mode');
      try {
        localStorage.setItem('saqr_theme_mode', 'light');
      } catch (e) {
        console.error(e);
      }
    }

    if (onThemeChange) {
      onThemeChange(isDark);
    }
  }, [isDark, onThemeChange]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 flex items-center gap-2 group print:hidden">
      <button
        onClick={toggleTheme}
        aria-label={isDark ? 'التبديل إلى الوضع النهاري' : 'التبديل إلى الوضع الليلي'}
        title={isDark ? 'التبديل إلى الوضع النهاري (Light Mode)' : 'التبديل إلى الوضع الليلي (Dark Mode)'}
        className={`relative flex items-center gap-2 px-3.5 py-3 rounded-full shadow-2xl backdrop-blur-md transition-all duration-300 transform active:scale-95 hover:scale-105 border cursor-pointer ${
          isDark
            ? 'bg-slate-900/90 text-amber-400 border-amber-500/40 hover:border-amber-400 hover:shadow-amber-500/20'
            : 'bg-white/95 text-slate-800 border-emerald-500/40 hover:border-emerald-600 hover:shadow-emerald-500/20 shadow-slate-400/30'
        }`}
      >
        {/* Animated Icon Wrapper */}
        <div className="relative w-6 h-6 flex items-center justify-center">
          {isDark ? (
            <Sun className="w-5 h-5 text-amber-400 animate-spin-slow transition-transform duration-300 transform rotate-0" />
          ) : (
            <Moon className="w-5 h-5 text-emerald-700 transition-transform duration-300 transform -rotate-12" />
          )}
        </div>

        {/* Text Label - Expands on hover or visible on desktop */}
        <span className="text-xs font-black tracking-wide hidden group-hover:inline-block transition-all duration-200 whitespace-nowrap">
          {isDark ? 'الوضع النهاري ☀️' : 'الوضع الليلي 🌙'}
        </span>

        {/* Glow indicator dot */}
        <span
          className={`w-2 h-2 rounded-full animate-pulse ${
            isDark ? 'bg-amber-400' : 'bg-emerald-600'
          }`}
        />
      </button>
    </div>
  );
};
