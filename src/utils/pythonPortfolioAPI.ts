/**
 * Mock implementation of Python Portfolio API
 * This file provides a simplified implementation of the portfolio API 
 * to replace the previous Python backend dependency
 */

import { fetchRealStockData } from './stockAPI';

// Re-export the StockData interface from stockAPI to maintain compatibility
export interface StockData {
  symbol: string;
  priceHistory: number[];
  dates: Date[];
  volumes: number[];
  lastPrice: string;
  minPrice?: string;
  maxPrice?: string;
  dataPoints?: number;
  isFallback?: boolean;
  returns?: number;
  volatility?: number;
  sharpeRatio?: number;
  percentChange?: string;
  error?: string;
  timespan?: string;
}

// Type guard to check if we have valid StockData (not an error object)
function isStockData(data: any): data is StockData {
  return data && !('error' in data);
}

/**
 * Calculate portfolio metrics using JavaScript instead of Python
 * This is a simplified implementation meant to replace the Python backend
 */
export async function calculatePythonPortfolioMetrics(
  symbol1: string,
  symbol2: string,
  weight1: number
): Promise<any> {
  try {
    // Fetch stock data using our regular stock API
    const data1 = await fetchRealStockData(symbol1);
    const data2 = await fetchRealStockData(symbol2);
    
    // Check for error objects
    if (!isStockData(data1)) {
      throw new Error(`Error fetching ${symbol1}: ${data1.error}`);
    }
    
    if (!isStockData(data2)) {
      throw new Error(`Error fetching ${symbol2}: ${data2.error}`);
    }
    
    // Calculate portfolio metrics in JavaScript
    // This is simplified and doesn't require the Python backend
    const w1 = weight1 / 100;
    const w2 = 1 - w1;
    
    // Calculate returns and volatility if not already present
    if (!data1.returns || !data1.volatility) {
      data1.returns = calculateReturn(data1);
      data1.volatility = calculateVolatility(data1);
    }
    
    if (!data2.returns || !data2.volatility) {
      data2.returns = calculateReturn(data2);
      data2.volatility = calculateVolatility(data2);
    }
    
    // Simple portfolio returns calculation
    const returns1 = data1.returns || 0;
    const returns2 = data2.returns || 0;
    const portfolioReturn = (returns1 * w1) + (returns2 * w2);
    
    // Use a correlation of 0.5 for simplicity
    const correlation = 0.5;
    
    // Calculate portfolio volatility
    const volatility1 = data1.volatility || 0;
    const volatility2 = data2.volatility || 0;
    const portfolioVolatility = Math.sqrt(
      (w1 * w1 * volatility1 * volatility1) +
      (w2 * w2 * volatility2 * volatility2) +
      (2 * w1 * w2 * volatility1 * volatility2 * correlation)
    );
    
    // Calculate Sharpe Ratio (assuming 2% risk-free rate)
    const riskFreeRate = 0.02;
    const sharpeRatio = (portfolioReturn - riskFreeRate) / portfolioVolatility;
    
    return {
      portfolioReturn,
      portfolioVolatility,
      sharpeRatio,
      stocks: [data1, data2],
      weights: [w1, w2]
    };
  } catch (error) {
    console.error('Error calculating portfolio metrics:', error);
    throw error;
  }
}

/**
 * Calculate annualized return from price history
 */
function calculateReturn(data: StockData): number {
  if (!data.priceHistory || data.priceHistory.length < 2) return 0;
  
  const firstPrice = data.priceHistory[0];
  const lastPrice = data.priceHistory[data.priceHistory.length - 1];
  const totalReturn = lastPrice / firstPrice - 1;
  
  // Get time difference in years
  const timeDiffMs = data.dates[data.dates.length - 1].getTime() - data.dates[0].getTime();
  const timeDiffYears = timeDiffMs / (1000 * 60 * 60 * 24 * 365);
  
  // Annualize the return
  return timeDiffYears > 0
    ? Math.pow(1 + totalReturn, 1 / timeDiffYears) - 1
    : 0;
}

/**
 * Calculate annualized volatility from price history
 */
function calculateVolatility(data: StockData): number {
  if (!data.priceHistory || data.priceHistory.length < 2) return 0.01;
  
  // Calculate returns
  const returns = [];
  for (let i = 1; i < data.priceHistory.length; i++) {
    returns.push(data.priceHistory[i] / data.priceHistory[i-1] - 1);
  }
  
  // Calculate volatility (standard deviation of returns)
  const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
  const squaredDiffs = returns.map(r => Math.pow(r - avgReturn, 2));
  const variance = squaredDiffs.reduce((sum, sq) => sum + sq, 0) / returns.length;
  const stdDev = Math.sqrt(variance);
  
  // Estimate frequency (daily, weekly, monthly) based on average time between data points
  const timeDiffMs = data.dates[data.dates.length - 1].getTime() - data.dates[0].getTime();
  const avgDaysBetweenPoints = timeDiffMs / (data.dates.length - 1) / (1000 * 60 * 60 * 24);
  
  // Annualize based on frequency
  let periodsPerYear = 52; // Default to weekly
  if (avgDaysBetweenPoints <= 3) {
    periodsPerYear = 252; // Daily (trading days)
  } else if (avgDaysBetweenPoints >= 25) {
    periodsPerYear = 12; // Monthly
  }
  
  return stdDev * Math.sqrt(periodsPerYear);
} 