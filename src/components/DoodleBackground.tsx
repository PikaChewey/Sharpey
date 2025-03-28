'use client';

import React, { useEffect, useState } from 'react';

const DoodleBackground: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="relative w-full h-full pointer-events-none overflow-hidden z-0">
      {/* Top left doodles */}
      <div className="absolute top-[120px] left-[5%] opacity-40 dark:opacity-60">
        <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20,50 C20,50 35,20 50,50 C65,80 80,50 80,50" stroke="#DC2626" strokeWidth="2" />
          <path d="M30,30 L70,70" stroke="#1A56DB" strokeWidth="2" />
          <path d="M30,70 L70,30" stroke="#1A56DB" strokeWidth="2" />
        </svg>
      </div>

      {/* Top right math symbols */}
      <div className="absolute top-[180px] right-[8%] opacity-40 dark:opacity-60">
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M40,60 L80,60" stroke="#16A34A" strokeWidth="2" />
          <path d="M60,40 L60,80" stroke="#16A34A" strokeWidth="2" />
          <circle cx="60" cy="60" r="30" stroke="#16A34A" strokeWidth="2" strokeDasharray="5,5" />
          <path d="M35,35 Q45,25 60,35 T85,35" stroke="#EAB308" strokeWidth="2" />
        </svg>
      </div>

      {/* Middle left Pi symbol */}
      <div className="absolute top-[35%] left-[12%] opacity-40 dark:opacity-60">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20,30 L60,30" stroke="#1A56DB" strokeWidth="3" />
          <path d="M30,30 L30,60" stroke="#1A56DB" strokeWidth="3" />
          <path d="M50,30 L45,60" stroke="#1A56DB" strokeWidth="3" />
        </svg>
      </div>

      {/* Middle right squiggly line */}
      <div className="absolute top-[55%] right-[10%] opacity-40 dark:opacity-60">
        <svg width="150" height="40" viewBox="0 0 150 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10,20 Q25,5 40,20 T70,20 T100,20 T130,20" stroke="#DC2626" strokeWidth="2" />
        </svg>
      </div>

      {/* Bottom left star */}
      <div className="absolute top-[70%] left-[20%] opacity-40 dark:opacity-60">
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M30,10 L33,23 L47,23 L36,30 L40,44 L30,36 L20,44 L24,30 L13,23 L27,23 Z" stroke="#EAB308" strokeWidth="2" />
        </svg>
      </div>

      {/* Bottom right sigma */}
      <div className="absolute top-[85%] right-[25%] opacity-40 dark:opacity-60">
        <svg width="70" height="70" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20,20 L50,20 L20,50 L50,50" stroke="#4B5563" strokeWidth="2.5" />
        </svg>
      </div>

      {/* Extra mathematical symbols scattered around */}
      <div className="absolute top-[65%] left-[40%] opacity-40 dark:opacity-60">
        <svg width="90" height="90" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M30,45 A15,15 0 1,1 60,45 A15,15 0 1,1 30,45 Z" stroke="#16A34A" strokeWidth="2" />
          <path d="M45,20 L45,70" stroke="#16A34A" strokeWidth="2" />
          <path d="M20,45 L70,45" stroke="#16A34A" strokeWidth="2" />
        </svg>
      </div>

      {/* Checkmark */}
      <div className="absolute top-[75%] right-[35%] opacity-40 dark:opacity-60">
        <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15,25 L25,35 L40,15" stroke="#DC2626" strokeWidth="3" />
        </svg>
      </div>
      
      {/* Additional doodles */}
      <div className="absolute top-[45%] right-[45%] opacity-40 dark:opacity-60">
        <svg width="70" height="70" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15,15 L55,55" stroke="#1A56DB" strokeWidth="2" />
          <path d="M15,55 L55,15" stroke="#1A56DB" strokeWidth="2" />
          <circle cx="35" cy="35" r="20" stroke="#DC2626" strokeWidth="2" strokeDasharray="4,4" />
        </svg>
      </div>
    </div>
  );
};

export default DoodleBackground; 