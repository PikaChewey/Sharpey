'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaInfoCircle, FaSearch, FaShareAlt, FaSave, FaUser, FaTimes } from 'react-icons/fa';
import StockInputField from './StockInputField';
import PortfolioSlider from './PortfolioSlider';
import SharpeRatioCard from './SharpeRatioCard';
import PerformanceChart from './PerformanceChart';
import ComparisonToggle from './ComparisonToggle';
import { calculateSharpeRatio } from '@/utils/stockUtils';
import { fetchRealStockData, validateStockSymbol } from '@/utils/stockAPI';
import { v4 as uuidv4 } from 'uuid';
import { 
  Portfolio, 
  savePortfolio, 
  getUsername, 
  saveUsername, 
  incrementPortfoliosTested,
  getPortfoliosTested
} from '@/utils/localStorageUtils';

// Example market indices for comparison
const MARKET_INDICES = [
  { name: 'S&P 500', ticker: 'SPY', sharpeRatio: 0.42 },
  { name: 'NASDAQ', ticker: 'QQQ', sharpeRatio: 0.46 },
  { name: 'Dow Jones', ticker: 'DIA', sharpeRatio: 0.39 },
];

// Import the StockData interface
interface StockData {
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

// Helper function to calculate returns and volatility from price history
function calculateMetricsFromPriceHistory(data: StockData) {
  const prices = data.priceHistory;
  const dates = data.dates;
  
  if (!prices || prices.length < 2) {
    return {
      returns: 0,
      volatility: 0.01
    };
  }
  
  // Calculate returns
  const returns = [];
  for (let i = 1; i < prices.length; i++) {
    returns.push(prices[i] / prices[i-1] - 1);
  }
  
  // Calculate annualized return
  const firstPrice = prices[0];
  const lastPrice = prices[prices.length - 1];
  const totalReturn = lastPrice / firstPrice - 1;
  
  // Get time difference in years
  const timeDiffMs = dates[dates.length - 1].getTime() - dates[0].getTime();
  const timeDiffYears = timeDiffMs / (1000 * 60 * 60 * 24 * 365);
  
  // Annualize the return
  const annualizedReturn = timeDiffYears > 0
    ? Math.pow(1 + totalReturn, 1 / timeDiffYears) - 1
    : 0;
  
  // Calculate volatility (standard deviation of returns, annualized)
  const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
  const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length;
  const periodVolatility = Math.sqrt(variance);
  
  // Annualize volatility based on data frequency
  const avgDaysBetweenPeriods = timeDiffMs / (dates.length - 1) / (1000 * 60 * 60 * 24);
  let periodsPerYear = 52; // Default to weekly
  if (avgDaysBetweenPeriods <= 3) {
    periodsPerYear = 252; // Daily data (trading days per year)
  } else if (avgDaysBetweenPeriods >= 25) {
    periodsPerYear = 12; // Monthly data
  }
  
  const annualizedVolatility = periodVolatility * Math.sqrt(periodsPerYear);
  
  return {
    returns: annualizedReturn,
    volatility: annualizedVolatility || 0.01 // Prevent zero volatility
  };
}

// Doodle elements for the game section
const GameDoodleElements = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {/* All elements positioned absolutely within their container - no fixed positioning */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Financial chart arrow */}
        <svg className="absolute top-[10%] right-[8%] w-24 h-16 text-green-500 dark:text-green-400 opacity-20 dark:opacity-60" viewBox="0 0 100 50" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M0,30 L20,35 L40,20 L60,15 L80,25 L95,10" className="animate-draw" style={{ animationDelay: '0.3s' }} />
          <path d="M85,10 L95,10 L95,20" className="animate-draw" style={{ animationDelay: '0.8s' }} />
        </svg>
        
        {/* Percentage symbol */}
        <svg className="absolute bottom-[15%] left-[7%] w-16 h-16 text-blue-500 dark:text-blue-400 opacity-25 dark:opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="7" cy="7" r="4" className="animate-draw" style={{ animationDelay: '0.5s' }} />
          <circle cx="17" cy="17" r="4" className="animate-draw" style={{ animationDelay: '0.7s' }} />
          <path d="M4,20 L20,4" className="animate-draw" style={{ animationDelay: '0.9s' }} />
        </svg>
        
        {/* Calculator icon */}
        <svg className="absolute top-[30%] left-[5%] w-20 h-20 text-gray-500 dark:text-gray-400 opacity-20 dark:opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="4" y="3" width="16" height="18" rx="2" className="animate-draw" style={{ animationDelay: '0.4s' }} />
          <line x1="8" y1="7" x2="16" y2="7" className="animate-draw" style={{ animationDelay: '0.6s' }} />
          <line x1="8" y1="12" x2="10" y2="12" className="animate-draw" style={{ animationDelay: '0.8s' }} />
          <line x1="14" y1="12" x2="16" y2="12" className="animate-draw" style={{ animationDelay: '1.0s' }} />
          <line x1="8" y1="16" x2="10" y2="16" className="animate-draw" style={{ animationDelay: '1.2s' }} />
          <line x1="14" y1="16" x2="16" y2="16" className="animate-draw" style={{ animationDelay: '1.4s' }} />
        </svg>
        
        {/* Star rating */}
        <svg className="absolute top-[65%] right-[10%] w-24 h-12 text-yellow-500 dark:text-yellow-400 opacity-25 dark:opacity-60" viewBox="0 0 120 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12,2 L15,8 L22,9 L17,14 L18,21 L12,18 L6,21 L7,14 L2,9 L9,8 L12,2Z" className="animate-draw" style={{ animationDelay: '0.2s' }} />
          <path d="M42,2 L45,8 L52,9 L47,14 L48,21 L42,18 L36,21 L37,14 L32,9 L39,8 L42,2Z" className="animate-draw" style={{ animationDelay: '0.4s' }} />
          <path d="M72,2 L75,8 L82,9 L77,14 L78,21 L72,18 L66,21 L67,14 L62,9 L69,8 L72,2Z" className="animate-draw" style={{ animationDelay: '0.6s' }} />
          <path d="M102,2 L105,8 L112,9 L107,14 L108,21 L102,18 L96,21 L97,14 L92,9 L99,8 L102,2Z" className="animate-draw" style={{ animationDelay: '0.8s' }} />
        </svg>
      </div>
    </div>
  );
};

export default function GameSection() {
  // State for stock inputs
  const [stock1, setStock1] = useState<string>('');
  const [stock2, setStock2] = useState<string>('');
  const [stockData1, setStockData1] = useState<any>(null);
  const [stockData2, setStockData2] = useState<any>(null);
  
  // Confirmed state variables - only update when Calculate is pressed
  const [confirmedStock1, setConfirmedStock1] = useState<string>('');
  const [confirmedStock2, setConfirmedStock2] = useState<string>('');
  
  // Error state for each stock input
  const [stock1Error, setStock1Error] = useState<string>('');
  const [stock2Error, setStock2Error] = useState<string>('');
  
  // Portfolio weight state
  const [weight, setWeight] = useState<number>(50);
  const [confirmedWeight, setConfirmedWeight] = useState<number>(50);
  
  // Results state
  const [portfolioReturns, setPortfolioReturns] = useState<number | null>(null);
  const [portfolioVolatility, setPortfolioVolatility] = useState<number | null>(null);
  const [portfolioSharpeRatio, setPortfolioSharpeRatio] = useState<number | null>(null);
  const [sortinoRatio, setSortinoRatio] = useState<number | null>(null);
  
  // UI state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [showComparison, setShowComparison] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [isUsernameModalOpen, setIsUsernameModalOpen] = useState<boolean>(false);
  const [portfoliosCreated, setPortfoliosCreated] = useState<number>(0);
  
  // Function to handle clearing all stock inputs
  const handleClearStocks = () => {
    setStock1('');
    setStock2('');
    setStockData1(null);
    setStockData2(null);
    setConfirmedStock1('');
    setConfirmedStock2('');
    setPortfolioReturns(null);
    setPortfolioVolatility(null);
    setPortfolioSharpeRatio(null);
    setSortinoRatio(null);
    setError('');
    setSuccessMessage('');
  };

  // Initialize and load portfolios tested count
  useEffect(() => {
    setUsername(getUsername());
    setPortfoliosCreated(getPortfoliosTested());
  }, []);
  
  // Calculate results from real stock data
  const calculateResults = async () => {
    if (!stock1 || !stock2) {
      setError('Please enter both stock symbols');
      return;
    }
    
    if (stock1 === stock2) {
      setError('Please enter two different stock symbols');
      return;
    }
    
    // Check for validation errors
    if (error) {
      setError('Please correct the errors in the stock symbols');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    // Update confirmed state with current input values when Calculate is pressed
    setConfirmedStock1(stock1);
    setConfirmedStock2(stock2);
    setConfirmedWeight(weight);
    
    try {
      // Fetch real data from API
      console.log(`Fetching stock data for ${stock1} and ${stock2}...`);
      
      // Fetch data for both stocks concurrently
      const [data1Result, data2Result] = await Promise.allSettled([
        fetchRealStockData(stock1, { allowFallback: true }),
        fetchRealStockData(stock2, { allowFallback: true })
      ]);
      
      // Handle potential failures of either stock fetch
      let data1, data2;
      
      // Process first stock result
      if (data1Result.status === 'fulfilled') {
        data1 = data1Result.value;
        // Check for error response
        if ('error' in data1) {
          console.warn(`Error in first stock response: ${data1.error}`);
          setError(`Error with ${stock1}: ${data1.error}`);
          setIsLoading(false);
          return;
        }
      } else {
        console.error(`Failed to fetch ${stock1}:`, data1Result.reason);
        setError(`Failed to fetch data for ${stock1}. Please try again.`);
        setIsLoading(false);
        return;
      }
      
      // Process second stock result
      if (data2Result.status === 'fulfilled') {
        data2 = data2Result.value;
        // Check for error response
        if ('error' in data2) {
          console.warn(`Error in second stock response: ${data2.error}`);
          setError(`Error with ${stock2}: ${data2.error}`);
          setIsLoading(false);
          return;
        }
      } else {
        console.error(`Failed to fetch ${stock2}:`, data2Result.reason);
        setError(`Failed to fetch data for ${stock2}. Please try again.`);
        setIsLoading(false);
        return;
      }
      
      // Track if we're using fallback data
      if (data1.isFallback || data2.isFallback) {
        console.log("Using fallback data for calculations");
        setError("Using simulated market data for calculations");
      }
      
      // At this point, we have valid stock data for both stocks
      setStockData1(data1);
      setStockData2(data2);
      
      // Create deep copies of the data to avoid modifying the original objects
      // This is critical to prevent the Sharpe ratio calculation from interfering with the graph data
      const stockData1 = {
        ...data1,
        priceHistory: [...data1.priceHistory],
        dates: [...data1.dates],
        volumes: [...data1.volumes]
      };
      
      const stockData2 = {
        ...data2,
        priceHistory: [...data2.priceHistory],
        dates: [...data2.dates],
        volumes: [...data2.volumes]
      };
      
      // Calculate metrics using the copies, not the original data
      let returns1 = stockData1.returns;
      let volatility1 = stockData1.volatility;
      let returns2 = stockData2.returns;
      let volatility2 = stockData2.volatility;
      
      // Calculate returns and volatility if not already present
      if (!returns1 || !volatility1) {
        const calculatedMetrics = calculateMetricsFromPriceHistory(stockData1);
        returns1 = calculatedMetrics.returns;
        volatility1 = calculatedMetrics.volatility;
      }
      
      if (!returns2 || !volatility2) {
        const calculatedMetrics = calculateMetricsFromPriceHistory(stockData2);
        returns2 = calculatedMetrics.returns;
        volatility2 = calculatedMetrics.volatility;
      }
      
      // Ensure we have numeric values for returns and volatility
      returns1 = typeof returns1 === 'number' ? returns1 : 0;
      returns2 = typeof returns2 === 'number' ? returns2 : 0;
      volatility1 = typeof volatility1 === 'number' ? volatility1 : 0.01;
      volatility2 = typeof volatility2 === 'number' ? volatility2 : 0.01;
      
      // Calculate Sharpe ratios
      const sr1 = calculateSharpeRatio(returns1, volatility1);
      const sr2 = calculateSharpeRatio(returns2, volatility2);
      
      // Add Sharpe ratios to the stock data objects so they're displayed in their cards
      stockData1.sharpeRatio = sr1;
      stockData2.sharpeRatio = sr2;
      
      // Update the state with the complete stock data including Sharpe ratios
      setStockData1({...data1, sharpeRatio: sr1, returns: returns1, volatility: volatility1});
      setStockData2({...data2, sharpeRatio: sr2, returns: returns2, volatility: volatility2});
      
      // Calculate portfolio Sharpe ratio based on weights
      const w1 = weight / 100;
      const w2 = 1 - w1;
      
      const portfolioReturn = (w1 * returns1) + (w2 * returns2);
      
      // Use a more realistic correlation calculation
      // We'll use a default correlation of 0.5 if we can't calculate it
      let correlation = 0.5;
      
      // Ensure we have price history for both stocks before calculating correlation
      if (stockData1.priceHistory && stockData2.priceHistory && 
          stockData1.priceHistory.length > 1 && stockData2.priceHistory.length > 1 && 
          stockData1.priceHistory.length === stockData2.priceHistory.length) {
        // Calculate returns for correlation
        const returnSeries1 = [];
        const returnSeries2 = [];
        for (let i = 1; i < stockData1.priceHistory.length; i++) {
          returnSeries1.push(stockData1.priceHistory[i] / stockData1.priceHistory[i-1] - 1);
          returnSeries2.push(stockData2.priceHistory[i] / stockData2.priceHistory[i-1] - 1);
        }
        
        // Calculate correlation coefficient
        const mean1 = returnSeries1.reduce((a, b) => a + b, 0) / returnSeries1.length;
        const mean2 = returnSeries2.reduce((a, b) => a + b, 0) / returnSeries2.length;
        
        let num = 0;
        let denom1 = 0;
        let denom2 = 0;
        
        for (let i = 0; i < returnSeries1.length; i++) {
          const diff1 = returnSeries1[i] - mean1;
          const diff2 = returnSeries2[i] - mean2;
          num += diff1 * diff2;
          denom1 += diff1 * diff1;
          denom2 += diff2 * diff2;
        }
        
        // Prevent division by zero
        if (denom1 > 0 && denom2 > 0) {
          correlation = num / (Math.sqrt(denom1) * Math.sqrt(denom2));
          
          // Handle NaN or invalid correlation values
          if (isNaN(correlation) || correlation < -1 || correlation > 1) {
            correlation = 0.5;
          }
        }
      }
      
      const portfolioVolatility = Math.sqrt(
        Math.pow(w1, 2) * Math.pow(volatility1, 2) +
        Math.pow(w2, 2) * Math.pow(volatility2, 2) +
        2 * w1 * w2 * volatility1 * volatility2 * correlation
      );
      
      const portfolioSR = calculateSharpeRatio(portfolioReturn, portfolioVolatility);
      
      // Calculate Sortino ratio using only negative returns
      let sortinoRatio = portfolioSR; // Default to Sharpe if we can't calculate Sortino
      
      if (stockData1.priceHistory && stockData2.priceHistory && 
          stockData1.priceHistory.length > 1 && stockData2.priceHistory.length > 1) {
        const negativeReturns1 = stockData1.priceHistory
          .map((price: number, i: number, arr: number[]) => i > 0 ? price / arr[i-1] - 1 : 0)
          .filter((ret: number) => ret < 0);
        
        const negativeReturns2 = stockData2.priceHistory
          .map((price: number, i: number, arr: number[]) => i > 0 ? price / arr[i-1] - 1 : 0)
          .filter((ret: number) => ret < 0);
        
        const avgNegativeReturn = (
          w1 * (negativeReturns1.length ? negativeReturns1.reduce((a: number, b: number) => a + b, 0) / negativeReturns1.length : 0) +
          w2 * (negativeReturns2.length ? negativeReturns2.reduce((a: number, b: number) => a + b, 0) / negativeReturns2.length : 0)
        );
        
        const downside = Math.abs(avgNegativeReturn) * Math.sqrt(12);
        sortinoRatio = downside === 0 ? portfolioSR : portfolioReturn / downside;
      }
      
      setPortfolioReturns(portfolioReturn);
      setPortfolioVolatility(portfolioVolatility);
      setPortfolioSharpeRatio(portfolioSR);
      setSortinoRatio(sortinoRatio);
      
      // Increment portfolios created counter
      const newCount = incrementPortfoliosTested();
      setPortfoliosCreated(newCount);
      
    } catch (err: any) {
      setError(err.message || 'Error fetching stock data. Please try again.');
      console.error('Error calculating results:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to save portfolio to local storage
  const handleSavePortfolio = () => {
    if (!portfolioSharpeRatio || !confirmedStock1 || !confirmedStock2) return;
    
    if (username === 'Anonymous') {
      // Prompt for username if not set
      setIsUsernameModalOpen(true);
      return;
    }
    
    savePortfolioToStorage();
  };
  
  // Function to actually save the portfolio
  const savePortfolioToStorage = () => {
    if (!portfolioSharpeRatio || !confirmedStock1 || !confirmedStock2) return;
    
    const portfolio: Portfolio = {
      id: uuidv4(),
      username,
      stock1: confirmedStock1,
      stock2: confirmedStock2,
      weight: confirmedWeight,
      sharpeRatio: portfolioSharpeRatio,
      date: new Date().toISOString(),
    };
    
    savePortfolio(portfolio);
    setSuccessMessage('Portfolio saved to leaderboard!');
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };
  
  // Function to save username and continue
  const handleSaveUsername = () => {
    if (username.trim()) {
      saveUsername(username);
      setIsUsernameModalOpen(false);
      savePortfolioToStorage();
    }
  };
  
  // Function to share portfolio
  const sharePortfolio = () => {
    if (!portfolioSharpeRatio) return;
    
    // Create share text
    const shareText = `Check out my portfolio in Sharpes! 
${confirmedStock1} (${confirmedWeight}%) and ${confirmedStock2} (${100-confirmedWeight}%) 
with a Sharpe Ratio of ${portfolioSharpeRatio.toFixed(2)}!`;
    
    // In a real app, this would use the Web Share API
    // For demonstration, we'll copy to clipboard
    navigator.clipboard.writeText(shareText)
      .then(() => {
        setSuccessMessage('Share text copied to clipboard!');
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
        setError('Failed to copy text to clipboard');
      });
  };

  return (
    <section
      id="game"
      className="relative py-16 sm:py-24 lined-background"
    >
      {/* Doodle elements for visual interest */}
      <GameDoodleElements />

      <div className="container-custom game-section-wrapper lined-background">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-3xl md:text-4xl font-handwritten text-notebook-blue dark:text-blue-300 mb-4"
          >
            Sharpe Ratio Calculator
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-notebook-gray dark:text-gray-200 font-handwritten max-w-3xl mx-auto"
          >
            Build a two-stock portfolio and test its risk-adjusted performance. Try different combinations
            to see how diversification affects your Sharpe ratio!
          </motion.p>
        </div>

        {/* Main Game Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Stock Selection & Portfolio Weight */}
          <div className="lg:col-span-1 space-y-6">
            {/* First Card - Stock Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="border border-notebook-line dark:border-notebook-dark-line bg-notebook-paper dark:bg-notebook-dark-paper game-card rounded-lg shadow-sm"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-handwritten text-notebook-blue dark:text-blue-300 flex items-center">
                  Stock Selection
                </h3>
                <button 
                  onClick={handleClearStocks}
                  className="p-2 rounded text-notebook-gray hover:text-notebook-blue transition-colors"
                  title="Clear stocks"
                >
                  <FaTimes className="h-5 w-5" />
                </button>
              </div>

              {/* Stock Input Fields */}
              <div className="space-y-4">
                <div>
                  <StockInputField
                    value={stock1}
                    onChange={setStock1}
                    error={stock1Error}
                    setError={setStock1Error}
                    placeholder="e.g. AAPL"
                    index={0}
                  />
                </div>
                <div>
                  <StockInputField
                    value={stock2}
                    onChange={setStock2}
                    error={stock2Error}
                    setError={setStock2Error}
                    placeholder="e.g. MSFT"
                    index={1}
                  />
                </div>
              </div>
            </motion.div>

            {/* Second Card - Portfolio Weight */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="border border-notebook-line dark:border-notebook-dark-line bg-notebook-paper dark:bg-notebook-dark-paper game-card rounded-lg shadow-sm"
            >
              <h3 className="font-handwritten text-xl text-notebook-blue dark:text-blue-300 flex items-center">
                Adjust Portfolio Weights
              </h3>

              {/* Portfolio Weight Slider */}
              <PortfolioSlider
                value={weight}
                onChange={setWeight}
                stock1={confirmedStock1 || "Stock 1"}
                stock2={confirmedStock2 || "Stock 2"}
              />
            </motion.div>

            {/* Calculate Button & Error Display */}
            <div className="space-y-4">
              <button
                onClick={calculateResults}
                disabled={isLoading}
                className="btn-notebook w-full py-4 text-base flex items-center justify-center"
                style={{ filter: 'url(#marker-effect)' }}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    Calculating...
                    <svg className="ml-2 animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </span>
                ) : (
                  <span className="flex items-center">
                    Calculate Sharpe Ratio
                    <svg className="ml-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </span>
                )}
              </button>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-white border border-notebook-red rounded-md">
                  <p className="text-notebook-red font-handwritten text-sm">{error}</p>
                </div>
              )}

              {/* Success Message */}
              {successMessage && (
                <div className="p-3 bg-white border border-notebook-blue rounded-md">
                  <p className="text-notebook-blue font-handwritten text-sm">{successMessage}</p>
                </div>
              )}
            </div>
            
            {/* Portfolio Counter */}
            <div className="text-center">
              <p className="text-sm font-handwritten text-notebook-gray dark:text-gray-100">
                {portfoliosCreated} portfolios tested so far
              </p>
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Performance Chart */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="border border-notebook-line dark:border-notebook-dark-line bg-notebook-paper dark:bg-notebook-dark-paper game-card rounded-lg shadow-sm"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-handwritten text-xl text-notebook-blue dark:text-blue-300 flex items-center">
                  Performance Comparison
                </h3>
                <ComparisonToggle 
                  showComparison={showComparison} 
                  onChange={() => setShowComparison(!showComparison)} 
                  label="Show Market Indices"
                />
              </div>
              <PerformanceChart 
                stockData1={stockData1} 
                stockData2={stockData2} 
                portfolioWeights={[confirmedWeight, 100-confirmedWeight]}
                showComparison={showComparison}
                isLoading={isLoading}
              />
            </motion.div>

            {/* Sharpe Ratio Results */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="border border-notebook-line dark:border-notebook-dark-line bg-notebook-paper dark:bg-notebook-dark-paper game-card rounded-lg shadow-sm"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-handwritten text-xl text-notebook-blue flex items-center">
                  Sharpe Ratio Analysis
                </h3>
                
                <div className="flex gap-3">
                  <button
                    onClick={handleSavePortfolio}
                    disabled={!portfolioSharpeRatio}
                    className="px-3 py-1 rounded flex items-center bg-notebook-paper dark:bg-notebook-dark-paper border border-notebook-line dark:border-notebook-dark-line text-notebook-gray hover:text-notebook-blue hover:bg-blue-50 dark:hover:bg-blue-900/20 disabled:opacity-50 disabled:hover:text-notebook-gray disabled:hover:bg-transparent transition-colors font-handwritten"
                    title="Save Portfolio"
                  >
                    <FaSave className="h-4 w-4 mr-1" />
                    <span>Save</span>
                  </button>
                </div>
              </div>

              {/* Sharpe Ratio Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <SharpeRatioCard
                  title={confirmedStock1 || "Stock 1"}
                  sharpeRatio={stockData1?.sharpeRatio || null}
                  isLoading={isLoading}
                  returns={stockData1?.returns}
                  volatility={stockData1?.volatility}
                  badge={stockData1?.isFallback ? "Simulated Data" : ""}
                />
                
                <SharpeRatioCard
                  title={confirmedStock2 || "Stock 2"}
                  sharpeRatio={stockData2?.sharpeRatio || null}
                  isLoading={isLoading}
                  returns={stockData2?.returns}
                  volatility={stockData2?.volatility}
                  badge={stockData2?.isFallback ? "Simulated Data" : ""}
                />
                
                <SharpeRatioCard
                  title="Portfolio"
                  sharpeRatio={portfolioSharpeRatio}
                  isLoading={isLoading}
                  isHighlighted={true}
                  returns={portfolioReturns !== null ? portfolioReturns : undefined}
                  volatility={portfolioVolatility !== null ? portfolioVolatility : undefined}
                  weightDetails={`${confirmedStock1} (${confirmedWeight}%) + ${confirmedStock2} (${100-confirmedWeight}%)`}
                  sortinoRatio={sortinoRatio}
                />
              </div>

              {/* Market Comparison */}
              {showComparison && (
                <div className="mt-6">
                  <h4 className="font-handwritten text-lg text-notebook-gray mb-2">Market Benchmarks</h4>
                  <div className="grid grid-cols-3 gap-4">
                    {MARKET_INDICES.map((index) => (
                      <div 
                        key={index.name}
                        className="text-center p-4 bg-notebook-paper dark:bg-notebook-dark-paper border border-notebook-line dark:border-notebook-dark-line rounded"
                      >
                        <p className="font-handwritten text-sm text-notebook-gray">{index.name}</p>
                        <p className="font-handwritten text-xl text-notebook-blue font-medium mt-1">
                          {index.sharpeRatio.toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Username Modal */}
        {isUsernameModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-notebook-paper dark:bg-notebook-dark-paper game-card border-2 border-notebook-line dark:border-notebook-dark-line rounded-lg p-6 max-w-md w-full mx-4"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-handwritten text-xl text-notebook-blue">Save Your Results</h3>
                <button
                  onClick={() => setIsUsernameModalOpen(false)}
                  className="text-notebook-gray hover:text-notebook-red transition-colors"
                >
                  <FaTimes className="h-5 w-5" />
                </button>
              </div>
              
              <p className="font-handwritten text-notebook-gray mb-4">
                Enter your name to save your portfolio to the leaderboard
              </p>
              
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-2 border border-notebook-line dark:border-notebook-dark-line rounded font-handwritten bg-notebook-paper dark:bg-notebook-dark-paper game-card focus:border-notebook-blue"
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsUsernameModalOpen(false)}
                  className="btn-outline font-handwritten py-2 px-4"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveUsername}
                  className="btn-notebook font-handwritten py-2 px-4"
                  style={{ filter: 'url(#marker-effect)' }}
                >
                  Save Portfolio
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
} 