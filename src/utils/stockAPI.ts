/**
 * Stock data API integration for fetching real 1-year price history
 * Using Alpha Vantage API which provides accurate historical data
 * type shyt
 */

// API endpoints
const ALPHA_VANTAGE_URL = 'https://www.alphavantage.co/query';
// This is a free tier API key with limited requests per day
// Since this is a client-side application, we're using it directly here
// For a production app, this should be moved to a backend service
const ALPHA_VANTAGE_KEY = 'VUJWGCVZ29XN582R';

// Cache for stock validation and data
const validSymbolsCache = new Set<string>();
const invalidSymbolsCache = new Set<string>();
const dataCache = new Map<string, { timestamp: number, data: any }>();
// Track API failures to avoid repeated attempts
const apiFailures = new Map<string, { timestamp: number, count: number }>();
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes
const API_FAILURE_RESET = 10 * 60 * 1000; // 10 minutes before trying again

// Common stocks for quick validation with known current prices (as of May 2024)
const COMMON_STOCKS = [
  'AAPL', 'MSFT', 'GOOG', 'GOOGL', 'AMZN', 'META', 'TSLA', 'NVDA', 'AMD', 'INTC',
  'JPM', 'BAC', 'WFC', 'GS', 'V', 'MA', 'PYPL', 'PFE', 'JNJ', 'UNH',
  'PG', 'KO', 'PEP', 'MCD', 'SBUX', 'DIS', 'NFLX', 'CMCSA', 'T', 'VZ',
  'HD', 'LOW', 'TGT', 'WMT', 'COST', 'XOM', 'CVX', 'BP', 'SHEL', 'COP',
  'SPY', 'QQQ', 'DIA', 'IWM', 'VTI'
];

// Initialize cache with common stocks
COMMON_STOCKS.forEach(symbol => validSymbolsCache.add(symbol));

// For backup, include alternative free financial APIs
const BACKUP_API_URL = 'https://financialmodelingprep.com/api/v3';
const BACKUP_API_KEY = '4e08929e76cbf98ec4e8e0bd53aeef46';

// Yahoo Finance API endpoint for third backup option
const YAHOO_FINANCE_URL = 'https://query1.finance.yahoo.com/v8/finance/chart';

// Actual current stock prices (May 2024) for more accurate fallback
const CURRENT_PRICES: Record<string, number> = {
  'AAPL': 182.25, 'MSFT': 407.54, 'GOOG': 168.95, 'GOOGL': 167.30, 'AMZN': 179.62, 
  'META': 475.30, 'TSLA': 177.58, 'NVDA': 121.67, 'AMD': 154.15, 'INTC': 30.28,
  'JPM': 193.57, 'BAC': 38.46, 'WFC': 59.04, 'GS': 440.24, 'V': 274.58, 'MA': 455.79, 
  'PYPL': 62.14, 'PFE': 27.88, 'JNJ': 147.60, 'UNH': 481.76,
  'PG': 165.97, 'KO': 61.95, 'PEP': 172.19, 'MCD': 254.85, 'SBUX': 75.48, 'DIS': 113.87, 
  'NFLX': 623.37, 'T': 17.94, 'VZ': 39.81,
  'HD': 342.09, 'LOW': 232.11, 'TGT': 149.32, 'WMT': 61.27, 'COST': 731.31,
  'XOM': 113.49, 'CVX': 157.36, 'BP': 36.09, 'SHEL': 69.33,
  'SPY': 516.64, 'QQQ': 432.95, 'DIA': 382.69, 'IWM': 204.65
};

// Define type for stock data
interface StockDataPoint {
  price: number;
  date: Date;
  volume: number;
}

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

// Helper to validate basic ticker format
function isValidTickerFormat(symbol: string): boolean {
  // Most stock symbols are 1-5 letters, optionally followed by a dot and additional characters
  // e.g., AAPL, MSFT, BRK.A, BRK.B
  const tickerRegex = /^[A-Z]{1,5}(\.[A-Z]+)?$/;
  return tickerRegex.test(symbol);
}

/**
 * Fetch historical stock data from Alpha Vantage
 */
async function fetchHistoricalStockData(symbol: string): Promise<StockData> {
  console.log(`Fetching weekly adjusted data for ${symbol}`);
  
  // Check cache first
  const cacheKey = `alpha_${symbol}`;
  const cachedData = dataCache.get(cacheKey);
  if (cachedData && (Date.now() - cachedData.timestamp < CACHE_TTL)) {
    console.log(`Using cached Alpha Vantage data for ${symbol}`);
    return cachedData.data;
  }
  
  // Check for recent API failures to avoid repeated attempts
  const failureKey = `alpha_${symbol}`;
  const apiFailure = apiFailures.get(failureKey);
  if (apiFailure && (Date.now() - apiFailure.timestamp < API_FAILURE_RESET)) {
    if (apiFailure.count > 2) {
      console.warn(`Skipping Alpha Vantage API for ${symbol} due to recent failures`);
      throw new Error(`Alpha Vantage API temporarily unavailable for ${symbol}`);
    }
  }
  
  // We'll use the weekly adjusted time series for 1 year of data with good resolution
  const functionName = 'TIME_SERIES_WEEKLY_ADJUSTED';
  
  // URL for Alpha Vantage API
  const apiUrl = `${ALPHA_VANTAGE_URL}?function=${functionName}&symbol=${symbol}&apikey=${ALPHA_VANTAGE_KEY}&outputsize=full`;
  
  console.log(`Alpha Vantage API URL for ${symbol}: ${apiUrl}`);
  
  try {
    // Fetch data from Alpha Vantage API with browser-like headers to reduce rejections
    const response = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'application/json'
      },
      // Add timeout to prevent hanging requests
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });
    
    if (!response.ok) {
      // Track API failure
      const currentFailure = apiFailures.get(failureKey) || { timestamp: Date.now(), count: 0 };
      apiFailures.set(failureKey, {
        timestamp: Date.now(),
        count: currentFailure.count + 1
      });
      
      throw new Error(`Alpha Vantage API error for ${symbol}: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Check for Alpha Vantage error messages
    if (data["Error Message"]) {
      // Track API failure
      const currentFailure = apiFailures.get(failureKey) || { timestamp: Date.now(), count: 0 };
      apiFailures.set(failureKey, {
        timestamp: Date.now(),
        count: currentFailure.count + 1
      });
      
      throw new Error(`Alpha Vantage error for ${symbol}: ${data["Error Message"]}`);
    }
    
    if (data["Information"]) {
      // This is usually rate limiting info - track as a failure
      const currentFailure = apiFailures.get(failureKey) || { timestamp: Date.now(), count: 0 };
      apiFailures.set(failureKey, {
        timestamp: Date.now(),
        count: currentFailure.count + 1
      });
      
      console.warn(`Alpha Vantage info for ${symbol}: ${data["Information"]}`);
      throw new Error(`Alpha Vantage rate limit reached: ${data["Information"]}`);
    }
    
    // Reset failures on success
    apiFailures.delete(failureKey);
    
    // Get weekly time series data
    const timeSeries = data["Weekly Adjusted Time Series"];
    
    if (!timeSeries || Object.keys(timeSeries).length === 0) {
      throw new Error(`No weekly time series data available for ${symbol}`);
    }
    
    // Process the historical data
    const priceData: number[] = [];
    const dateLabels: Date[] = [];
    const volumeData: number[] = [];
    
    // Get current date to ensure we don't include future dates
    const now = new Date();
    
    // Get cutoff date for 1 year ago
    const oneYearCutoff = new Date();
    oneYearCutoff.setFullYear(oneYearCutoff.getFullYear() - 1);
    
    console.log(`${symbol} date filter: from ${oneYearCutoff.toLocaleDateString()} to ${now.toLocaleDateString()}`);
    
    // Process each data point in the time series
    for (const dateStr in timeSeries) {
      const date = new Date(dateStr);
      
      // Skip future dates and dates more than 1 year ago
      if (date > now || date < oneYearCutoff) {
        continue;
      }
      
      // Use adjusted close price to account for dividends and splits
      const adjustedClose = parseFloat(timeSeries[dateStr]["5. adjusted close"]);
      
      if (!isNaN(adjustedClose) && adjustedClose > 0) {
        dateLabels.push(date);
        priceData.push(adjustedClose);
        
        // Add volume data if available
        const volume = parseInt(timeSeries[dateStr]["6. volume"] || '0');
        volumeData.push(volume);
      }
    }
    
    // Ensure we have sufficient data points
    if (priceData.length < 5) {
      throw new Error(`Not enough valid price data from Alpha Vantage for ${symbol}: ${priceData.length} points`);
    }
    
    // Sort data chronologically
    const combined = dateLabels.map((date, i) => ({
      date,
      price: priceData[i],
      volume: volumeData[i]
    }));
    
    combined.sort((a, b) => a.date.getTime() - b.date.getTime());
    
    // Debug hash to verify uniqueness
    const uniqueDataHash = combined.reduce((hash, point, idx) => hash + (point.price * (idx + 1)), 0);
    console.log(`${symbol} Alpha Vantage data uniqueness hash: ${uniqueDataHash.toFixed(2)}`);
    
    // Rebuild arrays after sorting
    for (let i = 0; i < combined.length; i++) {
      dateLabels[i] = combined[i].date;
      priceData[i] = combined[i].price;
      volumeData[i] = combined[i].volume;
    }
    
    // Calculate min/max prices
    const minPrice = Math.min(...priceData);
    const maxPrice = Math.max(...priceData);
    
    console.log(`Alpha Vantage: Got ${priceData.length} valid data points for ${symbol}`);
    console.log(`${symbol} date range from Alpha Vantage: ${dateLabels[0].toLocaleDateString()} to ${dateLabels[dateLabels.length-1].toLocaleDateString()}`);
    console.log(`${symbol} price range from Alpha Vantage: $${minPrice.toFixed(2)} to $${maxPrice.toFixed(2)}`);
    
    // Check if the price data seems realistic
    const lastPrice = priceData[priceData.length - 1];
    const knownCurrentPrice = CURRENT_PRICES[symbol];
    
    if (knownCurrentPrice && (lastPrice > knownCurrentPrice * 1.5 || lastPrice < knownCurrentPrice * 0.5)) {
      console.warn(`Alpha Vantage last price for ${symbol} ($${lastPrice.toFixed(2)}) differs significantly from known price ($${knownCurrentPrice.toFixed(2)})`);
      // Continue with the data, but log the concern
    }
    
    // Create stock data object
    const stockData = {
      symbol,
      priceHistory: priceData,
      dates: dateLabels,
      volumes: volumeData,
      lastPrice: priceData[priceData.length - 1].toFixed(2),
      minPrice: minPrice.toFixed(2),
      maxPrice: maxPrice.toFixed(2),
      dataPoints: priceData.length,
      timespan: '1Y'
    };
    
    // Cache the data for future requests
    dataCache.set(cacheKey, {
      timestamp: Date.now(),
      data: stockData
    });
    
    return stockData;
  } catch (error) {
    // Track API failure if not already tracked
    if (!apiFailures.has(failureKey)) {
      apiFailures.set(failureKey, {
        timestamp: Date.now(),
        count: 1
      });
    }
    
    console.error(`Error fetching from Alpha Vantage for ${symbol}:`, error);
    throw error;
  }
}

/**
 * Fetch from Yahoo Finance API as another backup
 */
async function fetchFromYahooFinance(symbol: string): Promise<StockData> {
  console.log(`Trying Yahoo Finance API for ${symbol}`);
  
  // Check cache first
  const cacheKey = `yahoo_${symbol}`;
  const cachedData = dataCache.get(cacheKey);
  if (cachedData && (Date.now() - cachedData.timestamp < CACHE_TTL)) {
    console.log(`Using cached Yahoo Finance data for ${symbol}`);
    return cachedData.data;
  }
  
  // Check for recent API failures to avoid repeated attempts
  const failureKey = `yahoo_${symbol}`;
  const apiFailure = apiFailures.get(failureKey);
  if (apiFailure && (Date.now() - apiFailure.timestamp < API_FAILURE_RESET)) {
    if (apiFailure.count > 2) {
      console.warn(`Skipping Yahoo Finance API for ${symbol} due to recent failures`);
      throw new Error(`Yahoo Finance API temporarily unavailable for ${symbol}`);
    }
  }
  
  // Calculate period for 1 year of historical data
  const now = new Date();
  const oneYearAgo = new Date(now);
  oneYearAgo.setFullYear(now.getFullYear() - 1);
  
  // Yahoo Finance requires epoch time (seconds)
  const startTime = Math.floor(oneYearAgo.getTime() / 1000);
  const endTime = Math.floor(now.getTime() / 1000);
  
  // Yahoo Finance API URL for 1 year of weekly data
  const interval = '1wk'; // weekly data
  
  // Use a CORS proxy to bypass browser security issues when needed
  // This helps with "Failed to fetch" errors from client-side calls
  let useProxy = false;
  let yahooUrl = `https://query1.finance.yahoo.com/v7/finance/chart/${symbol}?period1=${startTime}&period2=${endTime}&interval=${interval}&events=div,split`;
  
  // When running in the browser, we might need to use a proxy for Yahoo Finance
  if (typeof window !== 'undefined') {
    useProxy = true;
    // You can use public CORS proxies or set up your own
    yahooUrl = `https://corsproxy.io/?${encodeURIComponent(yahooUrl)}`;
  }
  
  console.log(`Yahoo Finance API URL for ${symbol}: ${useProxy ? 'Using proxy for' : ''} ${yahooUrl}`);
  
  try {
    const response = await fetch(yahooUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'application/json',
        'Origin': typeof window !== 'undefined' ? window.location.origin : 'https://localhost:3000'
      },
      // Set higher timeout to avoid quick failures
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });
    
    if (!response.ok) {
      // Track API failure
      const currentFailure = apiFailures.get(failureKey) || { timestamp: Date.now(), count: 0 };
      apiFailures.set(failureKey, {
        timestamp: Date.now(),
        count: currentFailure.count + 1
      });
      
      throw new Error(`Yahoo Finance API error for ${symbol}: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Reset any previous failures since we succeeded
    apiFailures.delete(failureKey);
    
    // Validate response structure
    if (!data.chart || !data.chart.result || !data.chart.result[0]) {
      throw new Error(`Invalid data structure from Yahoo Finance for ${symbol}`);
    }
    
    const result = data.chart.result[0];
    
    if (!result.timestamp || !result.indicators || !result.indicators.quote || !result.indicators.quote[0]) {
      throw new Error(`Missing price data from Yahoo Finance for ${symbol}`);
    }
    
    // Get price data
    const timestamps = result.timestamp;
    const quote = result.indicators.quote[0];
    const adjClose = result.indicators.adjclose && result.indicators.adjclose[0]?.adjclose;
    
    console.log(`Yahoo Finance raw data for ${symbol}: ${timestamps.length} data points`);
    
    const priceData: number[] = [];
    const dateLabels: Date[] = [];
    const volumeData: number[] = [];
    
    // Get cutoff date for 1 year ago
    const oneYearCutoff = new Date();
    oneYearCutoff.setFullYear(oneYearCutoff.getFullYear() - 1);
    
    // Process the data points
    for (let i = 0; i < timestamps.length; i++) {
      // Yahoo provides timestamps in seconds
      const date = new Date(timestamps[i] * 1000);
      
      // Skip future dates and dates more than 1 year ago
      if (date > now || date < oneYearCutoff) {
        continue;
      }
      
      // Use adjusted close when available, otherwise use close price
      const price = adjClose ? adjClose[i] : quote.close[i];
      
      if (price && !isNaN(price) && price > 0) {
        priceData.push(price);
        dateLabels.push(date);
        volumeData.push(quote.volume[i] || 0);
      }
    }
    
    // Ensure we have enough valid data points
    if (priceData.length < 5) {
      throw new Error(`Not enough valid price data from Yahoo Finance for ${symbol}: ${priceData.length} points`);
    }
    
    // Sort data chronologically
    const combined = dateLabels.map((date, i) => ({
      date,
      price: priceData[i],
      volume: volumeData[i]
    }));
    
    combined.sort((a, b) => a.date.getTime() - b.date.getTime());
    
    // Debug hash to verify uniqueness
    const uniqueDataHash = combined.reduce((hash, point, idx) => hash + (point.price * (idx + 1)), 0);
    console.log(`${symbol} Yahoo Finance data uniqueness hash: ${uniqueDataHash.toFixed(2)}`);
    
    // Rebuild arrays after sorting
    for (let i = 0; i < combined.length; i++) {
      dateLabels[i] = combined[i].date;
      priceData[i] = combined[i].price;
      volumeData[i] = combined[i].volume;
    }
    
    // Calculate min/max prices
    const minPrice = Math.min(...priceData);
    const maxPrice = Math.max(...priceData);
    
    console.log(`Yahoo Finance: Got ${priceData.length} valid data points for ${symbol}`);
    console.log(`${symbol} date range from Yahoo Finance: ${dateLabels[0].toLocaleDateString()} to ${dateLabels[dateLabels.length-1].toLocaleDateString()}`);
    console.log(`${symbol} price range from Yahoo Finance: $${minPrice.toFixed(2)} to $${maxPrice.toFixed(2)}`);
    
    // Check if the price data seems realistic
    const lastPrice = priceData[priceData.length - 1];
    const knownCurrentPrice = CURRENT_PRICES[symbol];
    
    if (knownCurrentPrice && (lastPrice > knownCurrentPrice * 1.5 || lastPrice < knownCurrentPrice * 0.5)) {
      console.warn(`Yahoo Finance last price for ${symbol} ($${lastPrice.toFixed(2)}) differs significantly from known price ($${knownCurrentPrice.toFixed(2)})`);
      // Continue with the data, but log the concern
    }
    
    const stockData = {
      symbol,
      priceHistory: priceData,
      dates: dateLabels,
      volumes: volumeData,
      lastPrice: priceData[priceData.length - 1].toFixed(2),
      minPrice: minPrice.toFixed(2),
      maxPrice: maxPrice.toFixed(2),
      dataPoints: priceData.length,
      timespan: '1Y'
    };
    
    // Cache the data for future requests
    dataCache.set(cacheKey, {
      timestamp: Date.now(),
      data: stockData
    });
    
    return stockData;
  } catch (error) {
    // Track API failure
    const currentFailure = apiFailures.get(failureKey) || { timestamp: Date.now(), count: 0 };
    apiFailures.set(failureKey, {
      timestamp: Date.now(),
      count: currentFailure.count + 1
    });
    
    console.error(`Error fetching from Yahoo Finance for ${symbol}:`, error);
    throw error;
  }
}

/**
 * Fetch from Financial Modeling Prep API as a backup
 */
async function fetchFromBackupAPI(symbol: string): Promise<StockData> {
  console.log(`Trying backup API (Financial Modeling Prep) for ${symbol}`);
  
  // Check cache first
  const cacheKey = `backup_${symbol}`;
  const cachedData = dataCache.get(cacheKey);
  if (cachedData && (Date.now() - cachedData.timestamp < CACHE_TTL)) {
    console.log(`Using cached Backup API data for ${symbol}`);
    return cachedData.data;
  }
  
  // Check for recent API failures to avoid repeated attempts
  const failureKey = `backup_${symbol}`;
  const apiFailure = apiFailures.get(failureKey);
  if (apiFailure && (Date.now() - apiFailure.timestamp < API_FAILURE_RESET)) {
    if (apiFailure.count > 2) {
      console.warn(`Skipping Backup API for ${symbol} due to recent failures`);
      throw new Error(`Backup API temporarily unavailable for ${symbol}`);
    }
  }
  
  // Calculate date range for 1 year
  const now = new Date();
  const oneYearAgo = new Date(now);
  oneYearAgo.setFullYear(now.getFullYear() - 1);
  
  // Format dates for API - YYYY-MM-DD
  const fromDate = oneYearAgo.toISOString().split('T')[0];
  const toDate = now.toISOString().split('T')[0];
  
  // URL for historical prices (1 year)
  let backupUrl = `${BACKUP_API_URL}/historical-price-full/${symbol}?from=${fromDate}&to=${toDate}&apikey=${BACKUP_API_KEY}`;
  
  // Use proxy for browser requests to avoid CORS issues
  let useProxy = false;
  if (typeof window !== 'undefined') {
    useProxy = true;
    backupUrl = `https://corsproxy.io/?${encodeURIComponent(backupUrl)}`;
  }
  
  console.log(`Backup API URL for ${symbol}: ${useProxy ? 'Using proxy for' : ''} ${backupUrl}`);
  
  try {
    const response = await fetch(backupUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'application/json',
        'Origin': typeof window !== 'undefined' ? window.location.origin : 'https://localhost:3000'
      },
      // Set higher timeout to avoid quick failures
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });
    
    if (!response.ok) {
      // Track API failure
      const currentFailure = apiFailures.get(failureKey) || { timestamp: Date.now(), count: 0 };
      apiFailures.set(failureKey, {
        timestamp: Date.now(),
        count: currentFailure.count + 1
      });
      
      throw new Error(`Backup API error for ${symbol}: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Reset failures on success
    apiFailures.delete(failureKey);
    
    // Validate response structure
    if (!data.historical || !Array.isArray(data.historical) || data.historical.length === 0) {
      throw new Error(`Invalid or empty data structure from backup API for ${symbol}`);
    }
    
    console.log(`Backup API raw data for ${symbol}: ${data.historical.length} data points`);
    
    // Process data in a consistent format
    const priceData: number[] = [];
    const dateLabels: Date[] = [];
    const volumeData: number[] = [];
    
    // Get cutoff date for 1 year ago
    const oneYearCutoff = new Date();
    oneYearCutoff.setFullYear(oneYearCutoff.getFullYear() - 1);
    
    // Process each historical data point
    for (const entry of data.historical) {
      if (!entry.date || !entry.adjClose) continue;
      
      const date = new Date(entry.date);
      
      // Skip future dates and dates more than 1 year ago
      if (date > now || date < oneYearCutoff) {
        continue;
      }
      
      const price = parseFloat(entry.adjClose);
      
      if (!isNaN(price) && price > 0) {
        priceData.push(price);
        dateLabels.push(date);
        volumeData.push(parseInt(entry.volume) || 0);
      }
    }
    
    // Ensure we have enough valid data points
    if (priceData.length < 5) {
      throw new Error(`Not enough valid price data from backup API for ${symbol}: ${priceData.length} points`);
    }
    
    // Sort data chronologically
    const combined = dateLabels.map((date, i) => ({
      date,
      price: priceData[i],
      volume: volumeData[i]
    }));
    
    combined.sort((a, b) => a.date.getTime() - b.date.getTime());
    
    // Debug hash to verify uniqueness
    const uniqueDataHash = combined.reduce((hash, point, idx) => hash + (point.price * (idx + 1)), 0);
    console.log(`${symbol} Backup API data uniqueness hash: ${uniqueDataHash.toFixed(2)}`);
    
    // Rebuild arrays after sorting
    for (let i = 0; i < combined.length; i++) {
      dateLabels[i] = combined[i].date;
      priceData[i] = combined[i].price;
      volumeData[i] = combined[i].volume;
    }
    
    // Calculate min/max prices
    const minPrice = Math.min(...priceData);
    const maxPrice = Math.max(...priceData);
    
    console.log(`Backup API: Got ${priceData.length} valid data points for ${symbol}`);
    console.log(`${symbol} date range from Backup API: ${dateLabels[0].toLocaleDateString()} to ${dateLabels[dateLabels.length-1].toLocaleDateString()}`);
    console.log(`${symbol} price range from Backup API: $${minPrice.toFixed(2)} to $${maxPrice.toFixed(2)}`);
    
    // Check if the price data seems realistic
    const lastPrice = priceData[priceData.length - 1];
    const knownCurrentPrice = CURRENT_PRICES[symbol];
    
    if (knownCurrentPrice && (lastPrice > knownCurrentPrice * 1.5 || lastPrice < knownCurrentPrice * 0.5)) {
      console.warn(`Backup API last price for ${symbol} ($${lastPrice.toFixed(2)}) differs significantly from known price ($${knownCurrentPrice.toFixed(2)})`);
      // Continue with the data, but log the concern
    }
    
    const stockData = {
      symbol,
      priceHistory: priceData,
      dates: dateLabels,
      volumes: volumeData,
      lastPrice: priceData[priceData.length - 1].toFixed(2),
      minPrice: minPrice.toFixed(2),
      maxPrice: maxPrice.toFixed(2),
      dataPoints: priceData.length,
      timespan: '1Y'
    };
    
    // Cache the data for future requests
    dataCache.set(cacheKey, {
      timestamp: Date.now(),
      data: stockData
    });
    
    return stockData;
  } catch (error) {
    // Track API failure
    const currentFailure = apiFailures.get(failureKey) || { timestamp: Date.now(), count: 0 };
    apiFailures.set(failureKey, {
      timestamp: Date.now(),
      count: currentFailure.count + 1
    });
    
    console.error(`Error fetching from backup API for ${symbol}:`, error);
    throw error;
  }
}

/**
 * Fetch company profile and validate if a symbol exists
 */
async function checkSymbolValidity(symbol: string): Promise<boolean> {
  try {
    // Use Alpha Vantage's SYMBOL_SEARCH endpoint to validate
    const url = `${ALPHA_VANTAGE_URL}?function=SYMBOL_SEARCH&keywords=${symbol}&apikey=${ALPHA_VANTAGE_KEY}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      return false;
    }
    
    const data = await response.json();
    
    if (!data.bestMatches || !Array.isArray(data.bestMatches)) {
      return false;
    }
    
    // Find exact symbol match
    return data.bestMatches.some((match: any) => 
      match['1. symbol'].toUpperCase() === symbol.toUpperCase()
    );
  } catch (error) {
    console.error(`Error validating stock symbol ${symbol}:`, error);
    return false;
  }
}

/**
 * Generate fallback data if APIs fail but we still need to show something
 */
function generateFallbackData(symbol: string): StockData {
  console.log(`Generating fallback data for ${symbol} based on known current price`);
  
  // Use the current price or a reasonable estimate
  const currentPrice = CURRENT_PRICES[symbol] || 100;
  
  // Determine starting price 1 year ago based on typical market behavior
  // S&P 500 gained roughly 12-15% in the past 1 year, so we'll use that
  // as a general guideline for stock growth
  const startingPrice = currentPrice * 0.88; // 88% of current price (12% gain over 1 year)
  
  const priceData: number[] = [];
  const dateLabels: Date[] = [];
  const volumeData: number[] = [];
  
  // Get current date to ensure we don't generate future dates
  const now = new Date();
  
  // Set to first day of current month to match weekly data format
  const currentMonth = new Date(now);
  currentMonth.setDate(1);
  
  // Go back exactly 1 year (52 weeks)
  const startDate = new Date(currentMonth);
  startDate.setFullYear(startDate.getFullYear() - 1);
  
  // Log our date range for clarity
  console.log(`Generating fallback data for ${symbol} from ${startDate.toLocaleDateString()} to ${currentMonth.toLocaleDateString()}`);
  
  // Generate one data point per week - approximately 52 points for 1 year
  let currentDate = new Date(startDate);
  let weeksElapsed = 0;
  const totalWeeks = 52; // 1 year * 52 weeks
  
  while (currentDate <= currentMonth && weeksElapsed < totalWeeks) {
    dateLabels.push(new Date(currentDate));
    
    // Calculate progress through the 1-year period (0 to 1)
    const progressFactor = weeksElapsed / totalWeeks;
    
    // Base trend - move from starting price to current price
    let price = startingPrice + (currentPrice - startingPrice) * progressFactor;
    
    // Add realistic cyclical patterns 
    // 1. Small weekly variation
    const weeklyNoise = (Math.random() - 0.5) * 0.01 * price; // ±0.5% weekly noise
    
    // 2. Cyclical patterns (markets tend to have cycles)
    const cyclicalFactor = Math.sin(progressFactor * Math.PI * 3) * 0.05 * price; // 5% cyclical variation
    
    // 3. Add a dip in the middle (like March 2020 COVID crash if within date range)
    let covidCrash = 0;
    const covidDate = new Date('2020-03-15');
    if (currentDate >= covidDate && currentDate <= new Date('2020-05-01') && startDate <= covidDate) {
      // Only add COVID crash if it falls within our 1-year window
      const daysFromCovid = Math.abs(currentDate.getTime() - covidDate.getTime()) / (1000 * 60 * 60 * 24);
      if (daysFromCovid < 30) {
        covidCrash = -0.25 * price * Math.max(0, 1 - daysFromCovid/30); // 25% crash
      }
    }
    
    // 4. Add other events based on actual stock market history if within range
    // Add 2022 decline
    const decline2022Start = new Date('2022-01-01');
    const decline2022End = new Date('2022-10-15');
    if (currentDate >= decline2022Start && currentDate <= decline2022End && startDate <= decline2022Start) {
      const progressIn2022Decline = 
        (currentDate.getTime() - decline2022Start.getTime()) / 
        (decline2022End.getTime() - decline2022Start.getTime());
      
      // Sine wave pattern that goes down and then slightly up (typical of 2022)
      const decline2022Factor = Math.sin(progressIn2022Decline * Math.PI) * -0.15;
      price = price * (1 + decline2022Factor);
    }
    
    // Combine all factors
    price = price + weeklyNoise + cyclicalFactor + covidCrash;
    
    // Ensure price is positive
    price = Math.max(price, 0.1);
    
    priceData.push(price);
    
    // Generate realistic volume - higher on significant price moves
    const avgVolume = symbol in CURRENT_PRICES ? 10000000 : 5000000;
    const volumeVariation = 1 + Math.abs(weeklyNoise / price) * 10; // Higher volume on big moves
    volumeData.push(Math.floor(avgVolume * volumeVariation));
    
    // Move to next week
    currentDate.setDate(currentDate.getDate() + 7);
    weeksElapsed++;
  }
  
  // Debug hash to verify uniqueness
  const uniqueDataHash = priceData.reduce((hash, price, idx) => hash + (price * (idx + 1)), 0);
  console.log(`${symbol} Fallback data uniqueness hash: ${uniqueDataHash.toFixed(2)}`);
  
  // Calculate actual min/max from the generated data
  const minPrice = Math.min(...priceData);
  const maxPrice = Math.max(...priceData);
  
  console.log(`Generated fallback data for ${symbol}: ${priceData.length} weekly points`);
  console.log(`Fallback price range: $${minPrice.toFixed(2)} to $${maxPrice.toFixed(2)}`);
  console.log(`Last fallback price: $${priceData[priceData.length-1].toFixed(2)}`);
  
  // Mark this as fallback data so UI can indicate it's not real
  return {
    symbol,
    priceHistory: priceData,
    dates: dateLabels,
    volumes: volumeData,
    lastPrice: priceData[priceData.length - 1].toFixed(2),
    minPrice: minPrice.toFixed(2),
    maxPrice: maxPrice.toFixed(2),
    dataPoints: priceData.length,
    isFallback: true,
    timespan: '1Y'
  };
}

/**
 * Validate if a stock symbol exists
 * @returns Object with isValid property indicating if the symbol is valid
 */
export async function validateStockSymbol(symbol: string): Promise<{ isValid: boolean }> {
  // Check caches first
  if (validSymbolsCache.has(symbol)) {
    return { isValid: true };
  }
  
  if (invalidSymbolsCache.has(symbol)) {
    return { isValid: false };
  }
  
  // Basic format validation
  if (!isValidTickerFormat(symbol)) {
    invalidSymbolsCache.add(symbol);
    return { isValid: false };
  }
  
  try {
    // For common stocks, consider them valid to avoid API calls
    if (COMMON_STOCKS.includes(symbol)) {
      validSymbolsCache.add(symbol);
      return { isValid: true };
    }
    
    // Attempt to validate the symbol
    const isValid = await checkSymbolValidity(symbol);
    
    if (isValid) {
      validSymbolsCache.add(symbol);
      return { isValid: true };
    }
    
    invalidSymbolsCache.add(symbol);
    return { isValid: false };
  } catch (error) {
    console.error(`Error validating stock symbol ${symbol}:`, error);
    
    // Consider common stocks valid even if API check fails
    if (COMMON_STOCKS.includes(symbol)) {
      validSymbolsCache.add(symbol);
      return { isValid: true };
    }
    
    // Default to invalid in case of errors
    return { isValid: false };
  }
}

/**
 * Calculate Sharpe ratio and other metrics from historical data
 */
function calculateMetrics(historicalData: StockData) {
  const prices = historicalData.priceHistory;
  const dates = historicalData.dates;
  
  if (!prices || prices.length < 2) {
    return {
      returns: 0,
      volatility: 0,
      sharpeRatio: 0,
      percentChange: "0.00"
    };
  }
  
  // Calculate returns and volatility
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
  
  // Annualize volatility based on data frequency (daily, weekly, monthly)
  let periodsPerYear = 12; // Default to monthly
  if (dates.length > 1) {
    const avgDaysBetweenPeriods = timeDiffMs / (dates.length - 1) / (1000 * 60 * 60 * 24);
    if (avgDaysBetweenPeriods <= 3) {
      periodsPerYear = 252; // Daily data (trading days per year)
    } else if (avgDaysBetweenPeriods <= 14) {
      periodsPerYear = 52; // Weekly data
    }
  }
  
  const annualizedVolatility = periodVolatility * Math.sqrt(periodsPerYear);
  
  // Calculate Sharpe ratio (assuming risk-free rate of 0.02 or 2%)
  const riskFreeRate = 0.02;
  const sharpeRatio = annualizedVolatility > 0
    ? (annualizedReturn - riskFreeRate) / annualizedVolatility
    : 0;
  
  return {
    returns: annualizedReturn,
    volatility: annualizedVolatility,
    sharpeRatio: sharpeRatio,
    percentChange: (totalReturn * 100).toFixed(2),
  };
}

/**
 * Main function to fetch stock data and calculate metrics
 * This is the primary function called by components
 */
export async function fetchRealStockData(
  symbol: string,
  options?: { allowFallback?: boolean }
): Promise<StockData | { error: string; symbol: string }> {
  const normalizedSymbol = symbol.trim().toUpperCase();
  console.log(`Fetching data for ${normalizedSymbol}`);
  
  // Always generate fallback data for common stocks by default
  const shouldAllowFallback = options?.allowFallback !== false;
  
  // Check cache first
  const cacheKey = `stock_${normalizedSymbol}`;
  const cachedData = dataCache.get(cacheKey);
  if (cachedData && (Date.now() - cachedData.timestamp < CACHE_TTL)) {
    console.log(`Using cached stock data for ${normalizedSymbol}`);
    return cachedData.data;
  }
  
  // Validate the symbol against common stocks
  if (!COMMON_STOCKS.includes(normalizedSymbol) && !isValidTickerFormat(normalizedSymbol)) {
    console.warn(`Invalid stock symbol: ${normalizedSymbol}`);
    
    // For invalid symbols, return error but cache the result to avoid repeated validation
    const errorResult = { error: `Invalid stock symbol: ${normalizedSymbol}`, symbol: normalizedSymbol };
    dataCache.set(cacheKey, {
      timestamp: Date.now(),
      data: errorResult
    });
    
    return errorResult;
  }
  
  // For common stocks, always be ready with fallback data
  let fallbackData: StockData | null = null;
  if (COMMON_STOCKS.includes(normalizedSymbol)) {
    // Generate fallback data immediately for common stocks
    fallbackData = generateFallbackData(normalizedSymbol);
  }
  
  try {
    // First try primary Alpha Vantage API
    try {
      let historicalData = await fetchHistoricalStockData(normalizedSymbol);
      
      // Verify we got valid dates and price history
      if (historicalData && historicalData.dates && historicalData.dates.length > 0 && historicalData.priceHistory) {
        // Sort dates chronologically
        const combined = historicalData.dates.map((date, i) => ({
          date,
          price: historicalData.priceHistory[i],
          volume: historicalData.volumes?.[i] || 0
        }));
        
        combined.sort((a, b) => a.date.getTime() - b.date.getTime());
        
        // Debug hash to verify uniqueness
        const uniqueDataHash = combined.reduce((hash, point, idx) => hash + (point.price * (idx + 1)), 0);
        console.log(`${normalizedSymbol} Primary API data uniqueness hash: ${uniqueDataHash.toFixed(2)}`);
        
        // Get sorted arrays
        const dates = combined.map(item => item.date);
        const prices = combined.map(item => item.price);
        const volumes = combined.map(item => item.volume);
        
        // Check date range to ensure we've got enough history
        const firstDate = dates[0];
        const lastDate = dates[dates.length - 1];
        const yearDiff = lastDate.getFullYear() - firstDate.getFullYear();
        const monthDiff = lastDate.getMonth() - firstDate.getMonth();
        const totalMonthsDiff = (yearDiff * 12) + monthDiff;
        
        console.log(`${normalizedSymbol} years difference: ${yearDiff} years, ${monthDiff} months (${totalMonthsDiff} months total)`);
        console.log(`${normalizedSymbol} got ${dates.length} data points from ${firstDate.toLocaleDateString()} to ${lastDate.toLocaleDateString()}`);
        
        // We should have at least 10 months of data for a good display
        if (totalMonthsDiff >= 10 && prices.length >= 5) {
          // Calculate additional metrics
          const minPrice = Math.min(...prices);
          const maxPrice = Math.max(...prices);
          
          // Validate the last price against known current price
          const lastPrice = prices[prices.length - 1];
          
          // Create valid data to return
          const stockData = {
            symbol: normalizedSymbol,
            priceHistory: prices,
            dates,
            volumes,
            lastPrice: lastPrice.toFixed(2),
            minPrice: minPrice.toFixed(2),
            maxPrice: maxPrice.toFixed(2),
            dataPoints: prices.length,
            timespan: '1Y'
          };
          
          // Cache successful result
          dataCache.set(cacheKey, {
            timestamp: Date.now(),
            data: stockData
          });
          
          return stockData;
        } else {
          console.warn(`Insufficient data from Alpha Vantage for ${normalizedSymbol}, trying backup APIs`);
        }
      }
    } catch (alphaVantageError) {
      console.warn(`Alpha Vantage API failed for ${normalizedSymbol}:`, alphaVantageError);
    }
    
    // Try backup API if primary API fails
    try {
      console.log(`Attempting backup API for ${normalizedSymbol}...`);
      const backupData = await fetchFromBackupAPI(normalizedSymbol);
      
      // Cache successful result
      dataCache.set(cacheKey, {
        timestamp: Date.now(),
        data: backupData
      });
      
      return backupData;
    } catch (backupError) {
      console.warn(`Backup API failed for ${normalizedSymbol}:`, backupError);
      
      // Try Yahoo Finance API if both fail
      try {
        console.log(`Attempting Yahoo Finance API for ${normalizedSymbol}...`);
        const yahooData = await fetchFromYahooFinance(normalizedSymbol);
        
        // Cache successful result
        dataCache.set(cacheKey, {
          timestamp: Date.now(),
          data: yahooData
        });
        
        return yahooData;
      } catch (yahooError) {
        console.warn(`Yahoo Finance API failed for ${normalizedSymbol}:`, yahooError);
        
        // Fall back to generated data if allowed
        if (shouldAllowFallback && fallbackData) {
          console.log(`All APIs failed. Using generated fallback data for: ${normalizedSymbol}`);
          
          // Cache fallback result
          dataCache.set(cacheKey, {
            timestamp: Date.now(),
            data: fallbackData
          });
          
          return fallbackData;
        }
        
        // Use fallback data for common stocks even if not originally allowed
        if (COMMON_STOCKS.includes(normalizedSymbol)) {
          console.log(`All APIs failed for common stock. Forcing fallback for: ${normalizedSymbol}`);
          const forcedFallback = generateFallbackData(normalizedSymbol);
          
          // Cache fallback result but with shorter TTL
          dataCache.set(cacheKey, {
            timestamp: Date.now() - CACHE_TTL/2, // Make it expire sooner
            data: forcedFallback
          });
          
          return forcedFallback;
        }
        
        // No more fallbacks, return error
        const errorResult = {
          error: `Could not retrieve data for ${normalizedSymbol} from any source`,
          symbol: normalizedSymbol
        };
        
        // Cache the error briefly to prevent hammering APIs
        dataCache.set(cacheKey, {
          timestamp: Date.now() - CACHE_TTL/2, // Make it expire sooner
          data: errorResult
        });
        
        return errorResult;
      }
    }
  } catch (error: any) {
    console.error(`Critical error fetching data for ${normalizedSymbol}:`, error);
    
    // Use fallback data for common stocks
    if (shouldAllowFallback && fallbackData) {
      console.log(`Using fallback data after error for: ${normalizedSymbol}`);
      
      // Cache fallback result
      dataCache.set(cacheKey, {
        timestamp: Date.now(),
        data: fallbackData
      });
      
      return fallbackData;
    }
    
    // Use fallback data for common stocks even if not originally allowed
    if (COMMON_STOCKS.includes(normalizedSymbol)) {
      console.log(`Critical error for common stock. Forcing fallback for: ${normalizedSymbol}`);
      const forcedFallback = fallbackData || generateFallbackData(normalizedSymbol);
      
      // Cache fallback result
      dataCache.set(cacheKey, {
        timestamp: Date.now() - CACHE_TTL/2, // Make it expire sooner
        data: forcedFallback
      });
      
      return forcedFallback;
    }
    
    // Return error response
    const errorMessage = error?.message || 'Unknown error fetching stock data';
    const errorResponse = {
      error: errorMessage,
      symbol: normalizedSymbol
    };
    
    // Cache the error briefly
    dataCache.set(cacheKey, {
      timestamp: Date.now() - (CACHE_TTL * 0.75), // Make it expire sooner
      data: errorResponse
    });
    
    return errorResponse;
  }
} 