'use client';

import { useMemo } from 'react';

interface SharpeRatioCardProps {
  title: string;
  sharpeRatio: number | null;
  isLoading: boolean;
  isHighlighted?: boolean;
  returns?: number;
  volatility?: number;
  badge?: string;
  weightDetails?: string;
  sortinoRatio?: number | null;
  showAdvanced?: boolean;
}

export default function SharpeRatioCard({
  title,
  sharpeRatio,
  isLoading,
  isHighlighted = false,
  returns,
  volatility,
  badge,
  weightDetails,
  sortinoRatio,
  showAdvanced = false,
}: SharpeRatioCardProps) {
  // Function to determine color based on Sharpe Ratio value
  const getRatioColor = (ratio: number) => {
    if (ratio < 0) return 'text-red-600 dark:text-red-300';
    if (ratio < 0.5) return 'text-orange-600 dark:text-orange-300';
    if (ratio < 1) return 'text-yellow-600 dark:text-yellow-300';
    if (ratio < 2) return 'text-green-600 dark:text-green-300';
    return 'text-emerald-600 dark:text-emerald-300';
  };

  // Function to get description based on Sharpe Ratio value
  const getRatioDescription = (ratio: number) => {
    if (ratio < 0) return 'Poor';
    if (ratio < 0.5) return 'Below Average';
    if (ratio < 1) return 'Average';
    if (ratio < 2) return 'Good';
    return 'Excellent';
  };

  // Function to get informative tooltip content based on Sharpe Ratio value
  const getSharpeRatioTooltip = (ratio: number) => {
    if (ratio < 0) {
      return "A negative Sharpe ratio indicates performance worse than the risk-free rate. This investment doesn't justify the risk taken.";
    }
    if (ratio < 0.5) {
      return "A Sharpe ratio below 0.5 indicates a poor risk-adjusted return. Consider reallocating assets or choosing different investments.";
    }
    if (ratio < 1) {
      return "A Sharpe ratio between 0.5 and 1.0 is acceptable but not ideal. There's room for improvement in either reducing risk or increasing returns.";
    }
    if (ratio < 2) {
      return "A Sharpe ratio between 1.0 and 2.0 is considered good. This investment offers solid risk-adjusted returns.";
    }
    return "A Sharpe ratio above 2.0 is excellent, indicating very good risk-adjusted performance. This is considered professional-grade performance.";
  };

  // Calculate a small random rotation for the hand-drawn effect
  const cardRotation = useMemo(() => {
    // Create a deterministic rotation based on the title
    const hash = title.split('').reduce((acc, char, i) => acc + char.charCodeAt(0) * (i + 1), 0);
    return ((hash % 5) - 2) * 0.2; // Between -0.4 and 0.4 degrees
  }, [title]);

  return (
    <div 
      className={`card p-4 bg-notebook-paper dark:bg-notebook-dark-paper ${
        isHighlighted 
          ? 'border-2 border-primary-500 dark:border-primary-400'
          : 'border border-notebook-line dark:border-notebook-dark-line'
      }`}
      style={{ 
        transform: `rotate(${cardRotation}deg)`, 
        filter: 'url(#pencil-filter)', 
        boxShadow: isHighlighted 
          ? '3px 3px 0 rgba(14, 165, 233, 0.3)' 
          : '2px 2px 0 rgba(0, 0, 0, 0.1)'
      }}
    >
      <div className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center font-handwritten">
        {title}
      </div>

      {badge && (
        <div className="mt-1 mb-1 px-2 py-1 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs rounded inline-block font-handwritten">
          {badge}
        </div>
      )}
      
      {weightDetails && (
        <div className="text-xs text-gray-600 dark:text-gray-400 font-handwritten">
          {weightDetails}
        </div>
      )}

      {isLoading ? (
        <div className="animate-pulse mt-2">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mt-2"></div>
        </div>
      ) : sharpeRatio !== null ? (
        <>
          <div className={`sharpe-analysis-value mt-1 ${getRatioColor(sharpeRatio)}`}>
            {sharpeRatio.toFixed(2)}
          </div>
          <div className="text-xs mt-1 text-gray-600 dark:text-gray-400 flex items-center sharpe-analysis-label">
            <span>{getRatioDescription(sharpeRatio)}</span>
          </div>
          
          {showAdvanced && (
            <div className="mt-3 pt-3 border-t border-notebook-line dark:border-notebook-dark-line sharpe-analysis-text">
              {returns !== undefined && (
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500 dark:text-gray-400">Return:</span>
                  <span className="font-medium">{(returns * 100).toFixed(2)}%</span>
                </div>
              )}
              
              {volatility !== undefined && (
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500 dark:text-gray-400">Volatility:</span>
                  <span className="font-medium">{(volatility * 100).toFixed(2)}%</span>
                </div>
              )}
              
              {sortinoRatio !== undefined && sortinoRatio !== null && (
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 dark:text-gray-400">Sortino Ratio:</span>
                  <span className="font-medium">{sortinoRatio.toFixed(2)}</span>
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="text-2xl font-bold mt-1 text-gray-400 dark:text-gray-600 sharpe-analysis-value">
          --
        </div>
      )}
    </div>
  );
} 