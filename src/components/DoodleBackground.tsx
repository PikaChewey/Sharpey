'use client';

import React from 'react';

/**
 * Background doodle elements for the application
 * These are scattered background illustrations that provide a notebook-like feel
 */
const DoodleBackground: React.FC = () => {
  return (
    <div className="w-full h-full pointer-events-none overflow-hidden opacity-50 dark:opacity-60 absolute inset-0 -z-10">
      {/* Additional doodles */}
      <div className="absolute top-[30%] right-[40%]">
        <svg width="70" height="70" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15,15 L55,55" stroke="#1A56DB" strokeWidth="2" />
          <path d="M15,55 L55,15" stroke="#1A56DB" strokeWidth="2" />
        </svg>
      </div>

      {/* Percentage symbol - moved far right and upwards */}
      <div className="absolute bottom-[40%] right-[5%]">
        <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="15" cy="15" r="8" stroke="#4B5563" strokeWidth="2" />
          <circle cx="35" cy="35" r="8" stroke="#4B5563" strokeWidth="2" />
          <path d="M10,40 L40,10" stroke="#4B5563" strokeWidth="2" />
        </svg>
      </div>

      {/* Approximately equal symbol - bottom half of the page */}
      <div className="absolute bottom-[15%] right-[20%]">
        <svg width="60" height="40" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10,15 C15,10 25,20 30,15 C35,10 45,20 50,15" stroke="#4B5563" strokeWidth="2" />
          <path d="M10,25 C15,20 25,30 30,25 C35,20 45,30 50,25" stroke="#4B5563" strokeWidth="2" />
        </svg>
      </div>

      {/* Square root symbol - moved far right */}
      <div className="absolute bottom-[25%] right-[5%]">
        <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10,20 L20,20 L30,40 L40,5" stroke="#1A56DB" strokeWidth="2" />
        </svg>
      </div>

      {/* Perpendicular symbol - bottom half of the page */}
      <div className="absolute bottom-[40%] left-[5%]">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5,30 L35,30" stroke="#4B5563" strokeWidth="2" />
          <path d="M20,30 L20,5" stroke="#4B5563" strokeWidth="2" />
        </svg>
      </div>
    </div>
  );
};

export default DoodleBackground; 