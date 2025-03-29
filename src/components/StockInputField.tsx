'use client';

import { useState, useEffect } from 'react';
import { FaSearch, FaExclamationTriangle, FaTimes } from 'react-icons/fa';

// Basic validation function for ticker format
const isValidTickerFormat = (symbol: string): boolean => {
  if (!symbol) return true; // Empty is valid (will be caught elsewhere)
  // Allow 1-5 uppercase letters, optionally followed by a dot and more uppercase letters
  const result = /^[A-Z]{1,5}(\.[A-Z]+)?$/.test(symbol);
  
  // Log special information for tickers with periods to help with debugging
  if (symbol.includes('.')) {
    console.log(`Validating ticker with period in StockInputField: ${symbol}, result: ${result}`);
  }
  
  return result;
};

interface StockInputFieldProps {
  label?: string;
  index?: number;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  error?: string;
  setError?: (error: string) => void;
}

export default function StockInputField({
  label,
  index = 0,
  value,
  onChange,
  placeholder,
  error,
  setError
}: StockInputFieldProps) {
  const [isFocused, setIsFocused] = useState(false);

  // Display the error message from props
  const errorMessage = error;

  // Use index for label if no label provided
  const displayLabel = label || `Stock ${index + 1}`;

  // Generate a slight rotation for hand-drawn effect based on the index
  const rotation = (index % 3 - 1) * 0.3; // Between -0.3 and 0.3 degrees

  const handleClear = () => {
    onChange('');
    if (setError) setError('');
  };

  // Validate the ticker format when the input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.toUpperCase();
    onChange(newValue);
    
    // Clear error when input changes
    if (setError && error) {
      setError('');
    }
  };

  // Validate when the field loses focus
  const handleBlur = () => {
    setIsFocused(false);
    
    // Only validate if there's a value
    if (value && !isValidTickerFormat(value) && setError) {
      setError(`Invalid ticker format: ${value}`);
    }
  };

  return (
    <div className="mb-4" style={{ transform: `rotate(${rotation}deg)` }}>
      <label 
        htmlFor={`stock-${index}`}
        className="block text-lg font-handwritten text-gray-800 dark:text-gray-300 mb-2"
      >
        {displayLabel}
      </label>
      
      <div className={`relative ${errorMessage ? 'mb-1' : ''}`}>
        <div 
          className={`
            flex items-center border-2 bg-white dark:bg-gray-800 rounded-md
            relative overflow-hidden
            ${isFocused ? 'border-notebook-blue dark:border-blue-400' : 'border-gray-400 dark:border-gray-600'}
            ${errorMessage ? 'border-red-500 dark:border-red-400' : ''}
            transition-all duration-200
          `}
          style={{
            boxShadow: isFocused ? '2px 2px 4px rgba(0,0,0,0.1)' : 'none',
          }}
        >
          <input
            type="text"
            id={`stock-${index}`}
            value={value}
            onChange={handleInputChange}
            placeholder={placeholder}
            onFocus={() => setIsFocused(true)}
            onBlur={handleBlur}
            className="
              w-full py-2 pl-3 pr-10 z-10
              bg-transparent font-handwritten text-lg
              text-gray-900 dark:text-gray-100
              placeholder-gray-500 dark:placeholder-gray-400
              focus:outline-none
            "
          />
          
          <div className="absolute right-0 top-0 bottom-0 flex items-center pr-2 z-10">
            {value ? (
              <button 
                type="button" 
                onClick={handleClear}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 p-1"
                aria-label="Clear"
              >
                <FaTimes />
              </button>
            ) : (
              <FaSearch className="text-gray-400 dark:text-gray-500 mr-2" />
            )}
          </div>
        </div>
        
        {errorMessage && (
          <p className="mt-1 text-red-600 dark:text-red-400 font-handwritten text-sm flex items-center">
            <FaExclamationTriangle className="mr-1 h-3 w-3 flex-shrink-0" />
            <span>{errorMessage}</span>
          </p>
        )}
      </div>
    </div>
  );
} 