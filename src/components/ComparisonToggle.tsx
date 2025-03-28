'use client';

import { FaChartLine } from 'react-icons/fa';

interface ComparisonToggleProps {
  showComparison: boolean;
  onChange: () => void;
  label?: string;
}

export default function ComparisonToggle({
  showComparison,
  onChange,
  label = "Compare to indices"
}: ComparisonToggleProps) {
  return (
    <div className="flex items-center space-x-2">
      <FaChartLine className="w-3 h-3 text-gray-600 dark:text-gray-300" />
      <label htmlFor="comparison-toggle" className="text-sm cursor-pointer text-gray-700 dark:text-gray-100 font-handwritten">
        {label}
      </label>
      <button
        id="comparison-toggle"
        onClick={onChange}
        aria-checked={showComparison}
        role="switch"
        className={`relative inline-flex items-center h-6 rounded-full w-10 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 ${
          showComparison ? 'bg-primary-600 dark:bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'
        }`}
        style={{ 
          filter: 'url(#pencil-filter)',
          transform: 'rotate(-0.5deg)'
        }}
      >
        {/* Track border for hand-drawn effect */}
        <span 
          className="absolute inset-0 pointer-events-none rounded-full" 
          style={{
            border: '1px solid currentColor',
            opacity: 0.2,
            transform: 'scale(1.05) rotate(0.8deg)'
          }}
        ></span>
        
        {/* Toggle knob */}
        <span
          className={`inline-block w-5 h-5 transform rounded-full bg-white transition-transform ${
            showComparison ? 'translate-x-5' : 'translate-x-1'
          }`}
          style={{
            boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
          }}
        >
          {/* Inner knob detail for hand-drawn effect */}
          <span 
            className="absolute inset-0 pointer-events-none rounded-full" 
            style={{
              border: '1px solid currentColor',
              opacity: 0.15,
              transform: 'scale(0.8) rotate(15deg)'
            }}
          ></span>
        </span>
      </button>
    </div>
  );
} 