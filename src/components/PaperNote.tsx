import React, { ReactNode } from 'react';

interface PaperNoteProps {
  children: ReactNode;
  color?: 'yellow' | 'blue' | 'green' | 'pink' | 'white';
  rotate?: number;
  className?: string;
  shadow?: boolean;
  pin?: boolean;
}

const PaperNote: React.FC<PaperNoteProps> = ({
  children,
  color = 'yellow',
  rotate = Math.random() * 6 - 3, // Random rotation between -3 and 3 degrees
  className = '',
  shadow = true,
  pin = false,
}) => {
  // Color styles based on the note color
  const colorStyles = {
    yellow: 'bg-amber-100 dark:bg-amber-900/40 border-amber-200 dark:border-amber-800',
    blue: 'bg-blue-100 dark:bg-blue-900/40 border-blue-200 dark:border-blue-800',
    green: 'bg-green-100 dark:bg-green-900/40 border-green-200 dark:border-green-800',
    pink: 'bg-pink-100 dark:bg-pink-900/40 border-pink-200 dark:border-pink-800',
    white: 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
  };

  // Shadow styles for the paper effect
  const shadowClass = shadow 
    ? 'shadow-[2px_2px_5px_rgba(0,0,0,0.15)]' 
    : '';

  return (
    <div className="relative inline-block">
      {pin && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
          <div className="w-3 h-10 bg-red-500 rounded-full transform rotate-12 shadow-md"></div>
          <div className="w-5 h-5 rounded-full bg-red-600 absolute -top-1 left-1/2 transform -translate-x-1/2 shadow-sm"></div>
        </div>
      )}
      
      <div
        className={`
          relative
          border
          font-handwritten
          p-4 
          ${colorStyles[color]} 
          ${shadowClass}
          ${className}
        `}
        style={{
          transform: `rotate(${rotate}deg)`,
          borderWidth: '1px',
          borderRadius: '2px',
        }}
      >
        {/* Paper texture overlay */}
        <div 
          className="absolute inset-0 opacity-30 pointer-events-none" 
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100%25\' height=\'100%25\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cdefs%3E%3Cpattern id=\'smallGrid\' width=\'8\' height=\'8\' patternUnits=\'userSpaceOnUse\'%3E%3Cpath d=\'M 8 0 L 0 0 0 8\' fill=\'none\' stroke=\'%23AAA\' stroke-width=\'0.5\' opacity=\'0.1\'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width=\'100%25\' height=\'100%25\' fill=\'url(%23smallGrid)\'/%3E%3C/svg%3E")',
          }}
        />
        
        {/* Paper tear effect at the top */}
        <div 
          className="absolute top-0 left-0 right-0 h-[3px] opacity-40" 
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100%25\' height=\'100%25\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0,0.5 Q2,2 4,0.5 Q6,2 8,0.5 Q10,2 12,0.5 Q14,2 16,0.5 Q18,2 20,0.5 Q22,2 24,0.5 Q26,2 28,0.5 Q30,2 32,0.5 Q34,2 36,0.5 Q38,2 40,0.5 Q42,2 44,0.5 Q46,2 48,0.5 Q50,2 52,0.5 Q54,2 56,0.5 Q58,2 60,0.5 Q62,2 64,0.5 Q66,2 68,0.5 Q70,2 72,0.5 Q74,2 76,0.5 Q78,2 80,0.5 Q82,2 84,0.5 Q86,2 88,0.5 Q90,2 92,0.5 Q94,2 96,0.5 Q98,2 100,0.5\' stroke=\'%23000\' fill=\'none\' opacity=\'0.2\' /%3E%3C/svg%3E")',
            backgroundSize: '100px 3px',
            backgroundRepeat: 'repeat-x',
          }}
        />
        
        <div className="relative z-0">{children}</div>
      </div>
    </div>
  );
};

export default PaperNote; 