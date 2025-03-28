/**
 * Utilities for managing theme (dark/light mode)
 */

export type Theme = 'light' | 'dark' | 'system';

// Helper function to safely access localStorage
const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (typeof window === 'undefined') {
      return null;
    }
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error(`Error reading ${key} from localStorage`, error);
      return null;
    }
  },
  setItem: (key: string, value: string): boolean => {
    if (typeof window === 'undefined') {
      return false;
    }
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.error(`Error writing ${key} to localStorage`, error);
      return false;
    }
  }
};

/**
 * Set the theme preference
 */
export function setTheme(theme: Theme): void {
  if (typeof window === 'undefined') return;
  
  safeLocalStorage.setItem('sharpes_theme', theme);
  
  // Apply theme
  applyTheme(theme);
}

/**
 * Get the current theme preference
 */
export function getTheme(): Theme {
  if (typeof window === 'undefined') return 'system';
  
  return (safeLocalStorage.getItem('sharpes_theme') as Theme) || 'system';
}

/**
 * Apply the specified theme to the document
 */
export function applyTheme(theme: Theme): void {
  if (typeof window === 'undefined' || !document) return;
  
  // Determine if dark mode should be active
  const isDark = 
    theme === 'dark' || 
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  
  // Apply the appropriate class to the document
  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

/**
 * Initialize theme on page load
 */
export function initTheme(): void {
  if (typeof window === 'undefined' || !document) return;
  
  // Get saved theme
  const theme = getTheme();
  
  // Apply it
  applyTheme(theme);
  
  // Listen for system preference changes
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  
  // Add listener for system preference changes
  const handleChange = () => {
    if (getTheme() === 'system') {
      applyTheme('system');
    }
  };
  
  try {
    // Modern API (newer browsers)
    mediaQuery.addEventListener('change', handleChange);
  } catch (e) {
    try {
      // Legacy API (older browsers)
      mediaQuery.addListener(handleChange);
    } catch (error) {
      console.error('Could not add media query listener', error);
    }
  }
} 