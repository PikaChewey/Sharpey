'use client';

import React from 'react';
import { useTheme } from '@/components/ThemeProvider';

/**
 * NotebookDoodles renders decorative hand-drawn elements to enhance the notebook theme
 */
export default function NotebookDoodles() {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  
  // Reduce number of doodles to improve performance
  const doodlesCount = 10;
  
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-30 dark:opacity-50">
      {/* Doodles layer */}
      <div className="absolute inset-0">
        {Array.from({ length: doodlesCount }).map((_, i) => {
          // Deterministic positioning based on index to avoid hydration issues
          const top = ((i * 17) % 100);
          const left = ((i * 23) % 100);
          const rotation = ((i * 11) % 360);
          const opacity = 0.5 + ((i * 7) % 50) / 100;
          
          return (
            <div
              key={i}
              className="absolute"
              style={{
                top: `${top}%`,
                left: `${left}%`,
                transform: `rotate(${rotation}deg)`,
                opacity,
              }}
            >
              {getRandomDoodle(isDarkMode, i)}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function getRandomDoodle(isDarkMode = false, index = 0) {
  const doodles = [
    // Stars
    <svg key="star" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" className={isDarkMode ? "text-blue-400" : "text-blue-700"}>
      <path d="M12 2L15 8L21 9L17 14L18 20L12 17L6 20L7 14L3 9L9 8L12 2Z" strokeWidth="1" />
    </svg>,
    
    // Arrow
    <svg key="arrow" width="40" height="20" viewBox="0 0 40 20" fill="none" stroke="currentColor" className={isDarkMode ? "text-red-400" : "text-red-700"}>
      <path d="M2 10H35M35 10L25 2M35 10L25 18" strokeWidth="1.5" strokeLinecap="round" />
    </svg>,
    
    // Circle
    <svg key="circle" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" className={isDarkMode ? "text-green-400" : "text-green-700"}>
      <circle cx="12" cy="12" r="8" strokeWidth="1.5" />
    </svg>,
    
    // Check mark
    <svg key="check" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" className={isDarkMode ? "text-indigo-400" : "text-indigo-700"}>
      <path d="M5 12L10 17L19 8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>,
    
    // Math symbols
    <div key="math" className={isDarkMode ? "text-purple-400 font-mono text-xl" : "text-purple-700 font-mono text-xl"}>∑</div>,
    <div key="math2" className={isDarkMode ? "text-amber-400 font-mono text-xl" : "text-amber-700 font-mono text-xl"}>π</div>,
    <div key="math3" className={isDarkMode ? "text-teal-400 font-mono text-xl" : "text-teal-700 font-mono text-xl"}>≈</div>,
    
    // Squiggle
    <svg key="squiggle" width="50" height="20" viewBox="0 0 50 20" fill="none" stroke="currentColor" className={isDarkMode ? "text-pink-400" : "text-pink-700"}>
      <path d="M2 10C6 5 14 15 18 10C22 5 28 15 32 10C36 5 44 15 48 10" strokeWidth="1.5" />
    </svg>,
  ];

  // Use a deterministic selection based on index
  return doodles[index % doodles.length];
} 