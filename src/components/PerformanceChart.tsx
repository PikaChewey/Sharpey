'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Chart, registerables } from 'chart.js';
import { fetchRealStockData } from '@/utils/stockAPI';
import { StockData } from '@/utils/pythonPortfolioAPI';
import { formatCurrency } from '@/utils/formatters';

// Register Chart.js components
Chart.register(...registerables);

// Debug mode to see data details in console
const DEBUG = true;

/**
 * Log debug information if debug mode is enabled
 */
function logDebug(message: string, data?: any) {
  if (DEBUG) {
    if (data) {
      console.log(`[CHART] ${message}`, data);
    } else {
      console.log(`[CHART] ${message}`);
    }
  }
}

/**
 * Normalizes an array of prices to a base value (100)
 * This allows for easier comparison of percentage changes
 * IMPORTANT: This function is used ONLY for visualization and does not affect the data used for Sharpe ratio calculations
 */
function normalizeToBaseValue(prices: number[], baseValue = 100): number[] {
  if (!prices || prices.length === 0) return [];
  
  // Make a copy of the array to avoid modifying the original data
  const pricesCopy = [...prices];
  
  // Calculate normalization based on the first value
  const initialValue = pricesCopy[0];
  if (initialValue === 0) return pricesCopy; // Prevent division by zero
  
  // Return a new array with normalized values
  return pricesCopy.map(price => (price / initialValue) * baseValue);
}

/**
 * Format date for chart display
 */
function formatDate(date: Date): string {
  // Ensure date is valid
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return 'Invalid Date';
  }
  
  const month = date.toLocaleString('default', { month: 'short' });
  const year = date.getFullYear().toString();
  return `${month} ${year}`;
}

/**
 * Format date for tooltips
 */
function formatTooltipDate(date: Date): string {
  // Ensure date is valid
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return 'Invalid Date';
  }
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric'
  });
}

interface PerformanceChartProps {
  stockData1: StockData;
  stockData2: StockData;
  portfolioWeights: number[];
  showComparison?: boolean;
  isLoading?: boolean;
}

// Define interface for chart dataset to include borderDash property
interface ChartDataset {
  label: string;
  data: number[];
  borderColor: string;
  backgroundColor: string;
  borderWidth: number;
  pointRadius: number;
  pointHoverRadius: number;
  tension: number;
  borderDash?: number[];
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({
  stockData1,
  stockData2,
  portfolioWeights,
  showComparison = false,
  isLoading = false,
}) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  const marketComparisonData = useRef<any[]>([]);
  const [normalizeData, setNormalizeData] = useState<boolean>(true);
  const [dataError, setDataError] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<string>('real');

  // Helper function to create the chart instance
  const createChart = (dates: Date[], stock1Values: number[], stock2Values: number[], portfolioValues = stock1Values) => {
    if (!chartRef.current) return null;
    
    // Destroy existing chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    
    // Format dates for display
    const formattedDates = dates.map(date => formatDate(date));
    
    // Define the datasets array that we'll populate
    const datasets = [
      {
        label: stockData1.symbol,
        data: stock1Values,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        pointRadius: 1,
        pointHoverRadius: 5,
        tension: 0.2,
      },
      {
        label: stockData2.symbol,
        data: stock2Values,
        borderColor: 'rgb(139, 92, 246)',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        borderWidth: 2,
        pointRadius: 1,
        pointHoverRadius: 5,
        tension: 0.2,
      },
      {
        label: 'Portfolio',
        data: portfolioValues,
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 3,
        pointRadius: 0,
        pointHoverRadius: 5,
        tension: 0.2,
      }
    ];
    
    // Cast datasets as ChartDataset[] to solve the type issue
    const typedDatasets = datasets as ChartDataset[];
    
    // Add market indices if comparison is enabled and data available
    if (showComparison && marketComparisonData.current.length > 0) {
      // Define colors and labels for market indices
      const marketIndices = [
        { symbol: 'SPY', label: 'S&P 500', color: 'rgb(156, 163, 175)' },
        { symbol: 'QQQ', label: 'NASDAQ', color: 'rgb(251, 191, 36)' },
        { symbol: 'DIA', label: 'DOW JONES', color: 'rgb(239, 68, 68)' }
      ];
      
      // Add each market index to the datasets
      marketComparisonData.current.forEach((data, index) => {
        if (!data || !data.priceHistory || data.error) return;
        
        // Get the corresponding market index config
        const marketIndex = marketIndices[index];
        if (!marketIndex) return;
        
        // Process the price history data
        let priceHistory = [...data.priceHistory];
        if (normalizeData) {
          priceHistory = normalizeToBaseValue(priceHistory);
        }
        
        // Add the dataset
        typedDatasets.push({
          label: marketIndex.label,
          data: priceHistory,
          borderColor: marketIndex.color,
          backgroundColor: `${marketIndex.color}20`,
          borderWidth: 2,
          borderDash: [5, 5], // Add dashed line for market indices
          pointRadius: 0,
          pointHoverRadius: 5,
          tension: 0.2,
        });
      });
    }
    
    // Create new chart with all the datasets
    const newChart = new Chart(chartRef.current, {
      type: 'line',
      data: {
        labels: formattedDates,
        datasets: typedDatasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index', // Show all dataset values at the current index
          intersect: false // Show tooltip when hovering over any part of the chart, not just data points
        },
        plugins: {
          tooltip: {
            callbacks: {
              title: function(tooltipItems) {
                const index = tooltipItems[0].dataIndex;
                return formatTooltipDate(dates[index]);
              },
              label: function(context) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.parsed.y !== null) {
                  // Show dollar signs for actual values, percentage for normalized
                  if (normalizeData) {
                    label += context.parsed.y.toFixed(2);
                  } else {
                    label += '$' + context.parsed.y.toFixed(2);
                  }
                }
                return label;
              }
            }
          },
          legend: {
            position: 'bottom',
            labels: {
              boxWidth: 12,
              font: {
                family: 'Indie Flower, cursive',
                size: 12
              }
            }
          }
        },
        scales: {
          x: {
            ticks: {
              maxRotation: 0,
              maxTicksLimit: 6,
              font: {
                family: 'Indie Flower, cursive',
                size: 11
              }
            },
            grid: {
              display: true,
              color: 'rgba(200, 200, 200, 0.2)'
            }
          },
          y: {
            ticks: {
              font: {
                family: 'Indie Flower, cursive',
                size: 11
              }
            },
            grid: {
              display: true,
              color: 'rgba(200, 200, 200, 0.2)'
            }
          }
        }
      }
    });
    
    return newChart;
  };

  // Create/update chart with current data
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateChart = useCallback(() => {
    if (!chartRef.current || !stockData1 || !stockData2) return;
    
    // Extract data from stock objects
    const dates = [...stockData1.dates];
    
    // Determine if we should show normalized data or actual prices
    let stock1Values = [...stockData1.priceHistory];
    let stock2Values = [...stockData2.priceHistory];
    
    if (normalizeData) {
      stock1Values = normalizeToBaseValue(stock1Values);
      stock2Values = normalizeToBaseValue(stock2Values);
    }
    
    // Calculate portfolio values based on weighted average
    const weight1 = portfolioWeights[0] / 100;
    const weight2 = portfolioWeights[1] / 100;
    
    const portfolioDataset = stock1Values.map((val, i) => {
      return (val * weight1) + (stock2Values[i] * weight2);
    });
    
    // Create a chart with the processed data
    chartInstance.current = createChart(dates, stock1Values, stock2Values, portfolioDataset);
  }, [
    stockData1,
    stockData2,
    portfolioWeights,
    normalizeData,
    showComparison // Add showComparison as a dependency to update when it changes
  ]);

  // Create or update chart when data changes
  useEffect(() => {
    if (isLoading) return;
    
    // Check for data validity
    if (!stockData1 || !stockData2) {
      setDataError(null); // Not an error state, just no data yet
      return;
    }
    
    // Check for errors in stock data
    if (stockData1.error || stockData2.error) {
      setDataError(stockData1.error || stockData2.error || null);
      return;
    }
    
    // Reset errors
    setDataError(null);
    
    // Identify data source (real or fallback)
    if (stockData1.isFallback || stockData2.isFallback) {
      setDataSource('fallback');
    } else {
      setDataSource('real');
    }
    
    // Handle market comparison data
    if (showComparison) {
      // Fetch market comparison data for S&P 500, NASDAQ, and Dow Jones
      const fetchMarketData = async () => {
        try {
          logDebug('Fetching market comparison data...');
          const [spyData, qqqData, diaData] = await Promise.all([
            fetchRealStockData('SPY'),  // S&P 500 ETF
            fetchRealStockData('QQQ'),  // NASDAQ ETF
            fetchRealStockData('DIA'),  // Dow Jones ETF
          ]);
          
          logDebug('Market data fetched successfully', { spyData, qqqData, diaData });
          marketComparisonData.current = [spyData, qqqData, diaData];
          updateChart();
        } catch (error) {
          console.error('Failed to fetch market comparison data:', error);
          // Continue with chart update even if market data fails
          updateChart(); 
        }
      };
      
      fetchMarketData();
    } else {
      // If comparison is disabled, clear market data and update chart
      marketComparisonData.current = [];
      updateChart();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stockData1, stockData2, portfolioWeights, showComparison, normalizeData, isLoading, updateChart]);

  if (isLoading) {
    return (
      <div className="relative h-80 md:h-96 bg-notebook-paper dark:bg-notebook-dark-paper lined-background rounded flex items-center justify-center border border-notebook-line dark:border-notebook-dark-line">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-5 w-32 bg-notebook-line dark:bg-gray-700 rounded mb-3"></div>
          <div className="h-4 w-24 bg-notebook-line dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (!stockData1 || !stockData2) {
    return (
      <div className="relative h-80 md:h-96 bg-notebook-paper dark:bg-notebook-dark-paper lined-background rounded flex items-center justify-center border border-notebook-line dark:border-notebook-dark-line">
        <div className="text-center text-notebook-gray dark:text-gray-400 font-handwritten">
          <p className="text-lg font-medium mb-2">No Data Available</p>
          <p className="text-sm">Enter stock symbols and calculate results to see performance</p>
        </div>
      </div>
    );
  }
  
  if (dataError) {
    return (
      <div className="relative h-80 md:h-96 bg-notebook-paper dark:bg-notebook-dark-paper lined-background rounded flex items-center justify-center border border-notebook-line dark:border-notebook-dark-line">
        <div className="text-center text-notebook-red dark:text-red-400 font-handwritten">
          <p className="text-lg font-medium mb-2">Error Loading Chart</p>
          <p className="text-sm">{dataError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <div className="chart-container" style={{ height: '300px', position: 'relative' }}>
        <canvas ref={chartRef}></canvas>
        </div>
      
      {/* Display mode toggle */}
      <div className="flex items-center justify-center my-2">
          <button 
            onClick={() => setNormalizeData(!normalizeData)}
          className="px-2 py-1 text-xs font-handwritten bg-notebook-paper dark:bg-notebook-dark-paper border border-notebook-line dark:border-notebook-dark-line rounded-md flex items-center shadow-sm hover:shadow transition-all"
          style={{ filter: 'url(#pencil-filter)' }}
          >
          <span className="mr-1">
            {normalizeData ? 'Show Actual Values' : 'Show Normalized Values'}
          </span>
          </button>
      </div>
      
      {/* Legend */}
      <div className="flex items-center justify-center mt-3 space-x-4">
        <div className="text-right text-xs text-gray-500 dark:text-gray-400 mb-1">
          {stockData1?.dates && stockData1.dates.length > 0 ? (
            <span>
              {formatDate(stockData1.dates[0])} - {formatDate(stockData1.dates[stockData1.dates.length - 1])}
            </span>
          ) : (
            <span>Loading date range...</span>
          )}
        </div>
        
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
          <div className="flex flex-wrap items-center gap-4 justify-center">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
              <span className="font-handwritten">{stockData1.symbol || 'Stock 1'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-purple-500 rounded-full"></span>
              <span className="font-handwritten">{stockData2.symbol || 'Stock 2'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              <span className="font-handwritten">Portfolio</span>
            </div>
            {showComparison && (
              <>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-gray-400 rounded-full"></span>
                  <span className="font-handwritten">S&P 500</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                  <span className="font-handwritten">NASDAQ</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                  <span className="font-handwritten">DOW JONES</span>
                </div>
              </>
          )}
        </div>
      </div>
      </div>
      
      <div className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2 font-handwritten">
        {normalizeData ? 'Normalized view (starting from 100) helps compare relative performance' : 'Actual values show the real price history of each stock'}
      </div>
    </div>
  );
};

export default PerformanceChart; 