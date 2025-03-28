'use client';

import { useState, useEffect } from 'react';

interface PortfolioSliderProps {
  value: number;
  onChange: (value: number) => void;
  stock1: string;
  stock2: string;
}

export default function PortfolioSlider({
  value,
  onChange,
  stock1,
  stock2,
}: PortfolioSliderProps) {
  // State to track editing mode for manual input
  const [isEditingStock1, setIsEditingStock1] = useState(false);
  const [isEditingStock2, setIsEditingStock2] = useState(false);
  const [stock1InputValue, setStock1InputValue] = useState(value.toString());
  const [stock2InputValue, setStock2InputValue] = useState((100 - value).toString());
  
  // Update input values when the main value changes
  useEffect(() => {
    setStock1InputValue(value.toString());
    setStock2InputValue((100 - value).toString());
  }, [value]);

  // Handle manual input submission for stock 1
  const handleStock1InputSubmit = () => {
    let newValue = parseInt(stock1InputValue, 10);
    
    // Validate input
    if (isNaN(newValue)) {
      newValue = value; // Revert to current value if invalid
    } else {
      // Ensure value is between 0 and 100
      newValue = Math.max(0, Math.min(100, newValue));
    }
    
    // Update the values
    onChange(newValue);
    setStock1InputValue(newValue.toString());
    setStock2InputValue((100 - newValue).toString());
    
    // Exit edit mode
    setIsEditingStock1(false);
  };

  // Handle manual input submission for stock 2
  const handleStock2InputSubmit = () => {
    let newValue = parseInt(stock2InputValue, 10);
    
    // Validate input
    if (isNaN(newValue)) {
      newValue = 100 - value; // Revert to current value if invalid
    } else {
      // Ensure value is between 0 and 100
      newValue = Math.max(0, Math.min(100, newValue));
    }
    
    // Convert to stock1 value (since that's what the parent component tracks)
    const stock1Value = 100 - newValue;
    
    // Update the values
    onChange(stock1Value);
    setStock1InputValue(stock1Value.toString());
    setStock2InputValue(newValue.toString());
    
    // Exit edit mode
    setIsEditingStock2(false);
  };

  return (
    <div className="space-y-3">
      <label
        htmlFor="portfolio-slider"
        className="block text-sm font-medium text-gray-700 dark:text-gray-100 font-handwritten"
      >
        Portfolio Weight
      </label>
      
      <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-300 mb-1 font-medium">
        <span className="text-notebook-blue dark:text-blue-300 font-handwritten">{stock1}</span>
        <span className="text-notebook-red dark:text-red-300 font-handwritten">{stock2}</span>
      </div>
      
      <div className="relative py-2">
        {/* Hand-drawn track */}
        <div 
          className="absolute h-2 rounded-full w-full pointer-events-none"
          style={{
            background: 'var(--notebook-line)',
            borderRadius: '4px',
            opacity: 0.8
          }}
        />
        
        {/* Hand-drawn progress */}
        <div 
          className="absolute h-2 rounded-full pointer-events-none"
          style={{
            width: `${value}%`,
            background: 'var(--notebook-blue)',
            borderRadius: '4px',
            transition: 'width 0.2s ease',
            opacity: 0.9
          }}
        />
        
        <input
          id="portfolio-slider"
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={(e) => {
            const parsedValue = parseInt(e.target.value, 10);
            if (!isNaN(parsedValue)) {
              onChange(parsedValue);
            }
          }}
          className="modern-slider w-full opacity-0 absolute z-10 cursor-pointer"
          style={{ height: '20px', top: '-3px' }}
        />
        
        {/* Hand-drawn thumb */}
        <div 
          className="absolute top-0 transform -translate-y-1/2 rounded-full border-2 pointer-events-none"
          style={{
            left: `calc(${value}% - 8px)`,
            width: '20px',
            height: '20px',
            background: 'white',
            borderColor: 'var(--notebook-blue)',
            boxShadow: '1px 1px 3px rgba(0,0,0,0.2)',
            transition: 'left 0.2s ease',
            transform: 'rotate(-2deg)',
            filter: 'url(#pencil-filter)'
          }}
        >
          {/* Add slight sketch effect to thumb */}
          <div 
            className="absolute inset-0 rounded-full opacity-20"
            style={{
              border: '1px solid currentColor',
              transform: 'scale(1.1) rotate(15deg)',
            }}
          ></div>
        </div>
      </div>
      
      <div className="flex items-center justify-between text-sm font-semibold">
        {/* Stock 1 percentage - clickable for editing */}
        {isEditingStock1 ? (
          <div className="bg-white/80 dark:bg-gray-800/80 px-2 py-1 rounded-md transition-all border border-notebook-blue dark:border-blue-500">
            <input
              type="number"
              min="0"
              max="100"
              className="w-16 text-notebook-blue dark:text-blue-300 bg-transparent font-handwritten text-center outline-none"
              value={stock1InputValue}
              onChange={(e) => setStock1InputValue(e.target.value)}
              onBlur={handleStock1InputSubmit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleStock1InputSubmit();
                } else if (e.key === 'Escape') {
                  setIsEditingStock1(false);
                  setStock1InputValue(value.toString());
                }
              }}
              autoFocus
            />
            <span className="text-notebook-blue dark:text-blue-300 font-handwritten">%</span>
          </div>
        ) : (
          <span 
            className="bg-white/80 dark:bg-gray-800/80 text-notebook-blue dark:text-blue-300 px-2 py-1 rounded-md transition-all border border-notebook-blue dark:border-blue-500 font-handwritten cursor-pointer hover:bg-white dark:hover:bg-gray-700"
            onClick={() => {
              setIsEditingStock1(true);
            }}
            title="Click to edit"
          >
            {value}%
          </span>
        )}
        
        {/* Stock 2 percentage - clickable for editing */}
        {isEditingStock2 ? (
          <div className="bg-white/80 dark:bg-gray-800/80 px-2 py-1 rounded-md transition-all border border-notebook-red dark:border-red-500">
            <input
              type="number"
              min="0"
              max="100"
              className="w-16 text-notebook-red dark:text-red-300 bg-transparent font-handwritten text-center outline-none"
              value={stock2InputValue}
              onChange={(e) => setStock2InputValue(e.target.value)}
              onBlur={handleStock2InputSubmit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleStock2InputSubmit();
                } else if (e.key === 'Escape') {
                  setIsEditingStock2(false);
                  setStock2InputValue((100 - value).toString());
                }
              }}
              autoFocus
            />
            <span className="text-notebook-red dark:text-red-300 font-handwritten">%</span>
          </div>
        ) : (
          <span 
            className="bg-white/80 dark:bg-gray-800/80 text-notebook-red dark:text-red-300 px-2 py-1 rounded-md transition-all border border-notebook-red dark:border-red-500 font-handwritten cursor-pointer hover:bg-white dark:hover:bg-gray-700"
            onClick={() => {
              setIsEditingStock2(true);
            }}
            title="Click to edit"
          >
            {100 - value}%
          </span>
        )}
      </div>
    </div>
  );
} 