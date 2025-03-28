/**
 * Utilities for managing portfolio data in local storage
 */

export interface Portfolio {
  id: string;
  username: string;
  stock1: string;
  stock2: string;
  weight: number;
  sharpeRatio: number;
  date: string;
}

const PORTFOLIOS_STORAGE_KEY = 'sharpes_saved_portfolios';
const USERNAME_STORAGE_KEY = 'sharpes_username';

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
 * Save a portfolio to local storage
 */
export function savePortfolio(portfolio: Portfolio): void {
  if (typeof window === 'undefined') return;
  
  const savedPortfolios = getSavedPortfolios();
  
  // Check if portfolio with same stocks and weight already exists
  const existingIndex = savedPortfolios.findIndex(
    p => p.stock1 === portfolio.stock1 && 
         p.stock2 === portfolio.stock2 && 
         p.weight === portfolio.weight
  );
  
  if (existingIndex !== -1) {
    // Replace the existing portfolio
    savedPortfolios[existingIndex] = portfolio;
  } else {
    // Add the new portfolio
    savedPortfolios.push(portfolio);
  }
  
  // Sort by Sharpe ratio (highest first)
  savedPortfolios.sort((a, b) => b.sharpeRatio - a.sharpeRatio);
  
  // Limit to 20 portfolios
  const limitedPortfolios = savedPortfolios.slice(0, 20);
  
  safeLocalStorage.setItem(PORTFOLIOS_STORAGE_KEY, JSON.stringify(limitedPortfolios));
}

/**
 * Get all saved portfolios from local storage
 */
export function getSavedPortfolios(): Portfolio[] {
  if (typeof window === 'undefined') {
    return [];
  }
  
  const savedData = safeLocalStorage.getItem(PORTFOLIOS_STORAGE_KEY);
  if (!savedData) {
    return [];
  }
  
  try {
    return JSON.parse(savedData) as Portfolio[];
  } catch (error) {
    console.error('Error parsing saved portfolios', error);
    return [];
  }
}

/**
 * Save username to local storage
 */
export function saveUsername(username: string): void {
  safeLocalStorage.setItem(USERNAME_STORAGE_KEY, username);
}

/**
 * Get username from local storage
 */
export function getUsername(): string {
  if (typeof window === 'undefined') {
    return 'Anonymous';
  }
  
  return safeLocalStorage.getItem(USERNAME_STORAGE_KEY) || 'Anonymous';
}

/**
 * Check if this is the first time the user is visiting
 */
export function isFirstTimeUser(): boolean {
  if (typeof window === 'undefined') {
    return true;
  }
  
  const visited = safeLocalStorage.getItem('sharpes_visited');
  if (!visited) {
    safeLocalStorage.setItem('sharpes_visited', 'true');
    return true;
  }
  
  return false;
}

/**
 * Increment and get portfolios tested count
 */
export function incrementPortfoliosTested(): number {
  if (typeof window === 'undefined') {
    return 0;
  }
  
  const count = safeLocalStorage.getItem('sharpes_portfolios_tested');
  const newCount = (count ? parseInt(count, 10) : 0) + 1;
  safeLocalStorage.setItem('sharpes_portfolios_tested', newCount.toString());
  return newCount;
}

/**
 * Get total portfolios tested
 */
export function getPortfoliosTested(): number {
  if (typeof window === 'undefined') {
    return 0;
  }
  
  const count = safeLocalStorage.getItem('sharpes_portfolios_tested');
  return count ? parseInt(count, 10) : 0;
} 