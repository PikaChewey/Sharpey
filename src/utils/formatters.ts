/**
 * Utility functions for formatting values in the application
 */

/**
 * Format a number as currency
 * @param value The number to format
 * @param decimals Number of decimal places (default: 2)
 * @param currency Currency symbol (default: $)
 */
export function formatCurrency(value: number, decimals = 2, currency = '$'): string {
  if (value === null || value === undefined || isNaN(value)) {
    return `${currency}0.00`;
  }
  
  // Format with commas and fixed decimal places
  const formattedValue = value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
  
  return `${currency}${formattedValue}`;
}

/**
 * Format a number as percentage
 * @param value The number to format (0.1 = 10%)
 * @param decimals Number of decimal places
 */
export function formatPercentage(value: number, decimals = 2): string {
  if (value === null || value === undefined || isNaN(value)) {
    return '0.00%';
  }
  
  // Convert to percentage and format
  const percentage = value * 100;
  return `${percentage.toFixed(decimals)}%`;
}

/**
 * Format a large number in a readable way (K, M, B)
 * @param value The number to format
 */
export function formatLargeNumber(value: number): string {
  if (value === null || value === undefined || isNaN(value)) {
    return '0';
  }
  
  if (value >= 1000000000) {
    return `${(value / 1000000000).toFixed(1)}B`;
  }
  
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  
  return value.toString();
}

/**
 * Format a date to a localized string
 * @param date The date to format
 * @param format The format to use ('short', 'medium', 'long', or 'full')
 * @returns Formatted date string
 */
export function formatDate(date: Date, format: 'short' | 'medium' | 'long' | 'full' = 'medium'): string {
  return date.toLocaleDateString('en-US', { 
    dateStyle: format 
  });
}

/**
 * Format a number with thousands separators
 * @param value The number to format
 * @param decimals Number of decimal places (default: 2)
 * @returns Formatted number string
 */
export function formatNumber(value: number, decimals: number = 2): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value);
}

/**
 * Format a large number with abbreviations (K, M, B)
 * @param value The number to format
 * @param decimals Number of decimal places
 * @returns Formatted abbreviated number
 */
export function formatCompactNumber(value: number, decimals: number = 1): string {
  if (value === null || value === undefined || isNaN(value)) {
    return '0';
  }
  
  // Use Intl.NumberFormat with notation: 'compact' for K, M, B suffixes
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value);
} 