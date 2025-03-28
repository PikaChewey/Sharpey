'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { getTheme, setTheme, applyTheme, initTheme } from '@/utils/themeUtils';
import { FaSun, FaMoon } from 'react-icons/fa';
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';

type Theme = 'light' | 'dark' | 'system';

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  isMounted: boolean;
};

const initialState: ThemeContextType = {
  theme: 'system',
  setTheme: () => null,
  toggleTheme: () => null,
  isMounted: false,
};

const ThemeContext = createContext<ThemeContextType>(initialState);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('system');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as Theme;
    if (storedTheme) {
      setTheme(storedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
    
    localStorage.setItem('theme', theme);
  }, [theme, isMounted]);

  const toggleTheme = () => {
    setTheme(prev => {
      if (prev === 'light') return 'dark';
      return 'light';
    });
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        isMounted,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Theme switcher component
export function ThemeSwitcher() {
  const { theme, setTheme, toggleTheme, isMounted } = useTheme();
  
  // Avoid rendering the switcher on the server to prevent hydration mismatch
  if (!isMounted) {
    return <div className="w-16 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse"></div>;
  }
  
  const options: Array<{ value: Theme; label: string; icon: React.ReactNode }> = [
    { value: 'light', label: 'Light', icon: <FaSun className="w-4 h-4" /> },
    { value: 'dark', label: 'Dark', icon: <FaMoon className="w-4 h-4" /> },
  ];

  // Calculate if we're in dark mode (either explicit dark theme or system dark)
  const isDarkMode = theme === 'dark' || 
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  
  return (
    <div 
      className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1"
      style={{ 
        transform: 'rotate(-0.5deg)',
        border: '1px solid var(--notebook-line)',
        boxShadow: '1px 1px 3px rgba(0,0,0,0.15)'
      }}
    >
      {options.map((option) => {
        const isActive = 
          theme === option.value || 
          (theme === 'system' && 
            ((window.matchMedia('(prefers-color-scheme: dark)').matches && option.value === 'dark') || 
            (!window.matchMedia('(prefers-color-scheme: dark)').matches && option.value === 'light')));
            
        return (
          <button
            key={option.value}
            className={`flex items-center justify-center p-2 rounded-md transition-all duration-200 font-handwritten ${
              isActive
                ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm' 
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
            onClick={() => setTheme(option.value)}
            aria-label={`Switch to ${option.label} theme`}
            style={{
              transform: isActive ? 'scale(1.05)' : 'scale(1)',
            }}
          >
            {option.icon}
            <span className="ml-1 text-xs hidden md:inline">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
} 