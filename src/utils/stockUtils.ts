/**
 * Utility functions for stock data and Sharpe ratio calculations
 */

// Risk-free rate (assumed to be 2% annually)
const RISK_FREE_RATE = 0.02;

/**
 * Calculate the Sharpe Ratio
 * @param returns Annual return percentage (e.g., 0.10 for 10%)
 * @param volatility Annual volatility/standard deviation (e.g., 0.15 for 15%)
 * @returns Sharpe Ratio
 */
export function calculateSharpeRatio(returns: number, volatility: number): number {
  // Prevent division by zero
  if (volatility === 0) return 0;
  
  return (returns - RISK_FREE_RATE) / volatility;
}

/**
 * Generate random stock price history
 * @param months Number of months to generate data for
 * @param initialPrice Initial price of the stock
 * @param annualReturn Expected annual return (e.g., 0.10 for 10%)
 * @param annualVolatility Annual volatility (e.g., 0.20 for 20%)
 * @returns Array of stock prices
 */
function generatePriceHistory(
  months: number = 60, 
  initialPrice: number = 100, 
  annualReturn: number = 0.10, 
  annualVolatility: number = 0.20
): number[] {
  const monthlyReturn = Math.pow(1 + annualReturn, 1/12) - 1;
  const monthlyVolatility = annualVolatility / Math.sqrt(12);
  
  const prices = [initialPrice];
  let currentPrice = initialPrice;
  
  for (let i = 1; i < months; i++) {
    // Generate random return based on normal distribution (simplified)
    const randomReturn = (Math.random() * 2 - 1) * monthlyVolatility;
    const monthlyPrice = currentPrice * (1 + monthlyReturn + randomReturn);
    
    currentPrice = monthlyPrice;
    prices.push(monthlyPrice);
  }
  
  return prices;
}

/**
 * Simulate fetching stock data
 * In a real app, this would call an actual API
 * @param symbol Stock ticker symbol
 * @returns Simulated stock data
 */
export async function fetchStockData(symbol: string): Promise<any> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));
  
  // Generate random parameters based on the symbol to ensure consistency
  const symbolHash = hashString(symbol);
  const seed = symbolHash % 100;
  
  const annualReturn = 0.05 + (seed % 25) / 100; // Returns between 5% and 30%
  const annualVolatility = 0.10 + (seed % 35) / 100; // Volatility between 10% and 45%
  
  // Generate price history
  const priceHistory = generatePriceHistory(60, 100, annualReturn, annualVolatility);
  
  // Calculate returns and volatility from price history
  const firstPrice = priceHistory[0];
  const lastPrice = priceHistory[priceHistory.length - 1];
  const actualAnnualReturn = Math.pow(lastPrice / firstPrice, 12 / priceHistory.length) - 1;
  
  // Calculate volatility from price history
  const monthlyReturns = [];
  for (let i = 1; i < priceHistory.length; i++) {
    monthlyReturns.push(priceHistory[i] / priceHistory[i-1] - 1);
  }
  
  const avgMonthlyReturn = monthlyReturns.reduce((sum, r) => sum + r, 0) / monthlyReturns.length;
  const squaredDeviations = monthlyReturns.map(r => Math.pow(r - avgMonthlyReturn, 2));
  const variance = squaredDeviations.reduce((sum, sd) => sum + sd, 0) / squaredDeviations.length;
  const monthlyVolatility = Math.sqrt(variance);
  const actualAnnualVolatility = monthlyVolatility * Math.sqrt(12);
  
  return {
    symbol,
    priceHistory,
    returns: actualAnnualReturn,
    volatility: actualAnnualVolatility,
    lastPrice: lastPrice.toFixed(2),
    percentChange: ((lastPrice / firstPrice - 1) * 100).toFixed(2),
  };
}

/**
 * Simple string hash function to get consistent random numbers from a ticker symbol
 * @param str String to hash
 * @returns Numeric hash value
 */
function hashString(str: string): number {
  let hash = 0;
  if (str.length === 0) return hash;
  
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer 
  }
  
  return Math.abs(hash);
} 