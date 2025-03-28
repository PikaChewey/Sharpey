'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FaPencilAlt, FaBook, FaTrophy, FaArrowRight, FaCalculator, FaChartLine, FaArrowDown } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';

interface HeroProps {
  onGetStartedClick: () => void;
}

// Doodle elements for the hero
const DoodleElements = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* All elements positioned absolutely within their container - no fixed positioning */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Math symbols doodle */}
        <svg className="absolute top-[5%] right-[8%] w-24 h-24 text-notebook-blue dark:text-blue-400 opacity-20 dark:opacity-60" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20,50 L80,50" className="animate-draw" style={{ animationDelay: '0.2s' }} />
          <path d="M50,20 L50,80" className="animate-draw" style={{ animationDelay: '0.4s' }} />
          <circle cx="50" cy="50" r="30" className="animate-draw" style={{ animationDelay: '0.6s' }} />
        </svg>
        
        {/* Squiggle line */}
        <svg className="absolute bottom-[20%] left-[10%] w-40 h-10 text-notebook-red dark:text-red-400 opacity-30 dark:opacity-60" viewBox="0 0 100 20" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M0,10 Q10,20 20,10 T40,10 T60,10 T80,10 T100,10" className="animate-draw" style={{ animationDelay: '0.8s' }} />
        </svg>
        
        {/* Dollar sign */}
        <svg className="absolute top-[25%] left-[5%] w-16 h-16 text-notebook-blue dark:text-blue-400 opacity-25 dark:opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12,2 L12,22 M17,5 C15,3 9,3 7,5 C5,7 5,11 7,13 C9,15 15,15 17,17 C19,19 19,23 17,25 C15,27 9,27 7,25" className="animate-draw" style={{ animationDelay: '1s' }} />
        </svg>
        
        {/* Sigma symbol */}
        <svg className="absolute bottom-[30%] right-[12%] w-20 h-20 text-notebook-gray dark:text-gray-400 opacity-25 dark:opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5,5 H19 L5,19 H19" className="animate-draw" style={{ animationDelay: '1.2s' }} />
        </svg>
        
        {/* Chart line */}
        <svg className="absolute top-[40%] right-[5%] w-24 h-16 text-green-600 dark:text-green-400 opacity-25 dark:opacity-60" viewBox="0 0 100 50" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M0,40 L20,35 L40,20 L60,25 L80,10 L100,5" className="animate-draw" style={{ animationDelay: '1.4s' }} />
        </svg>
        
        {/* Circle star */}
        <svg className="absolute top-[60%] left-[15%] w-20 h-20 text-orange-500 dark:text-orange-400 opacity-25 dark:opacity-60" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="50" cy="50" r="40" className="animate-draw" style={{ animationDelay: '1.6s' }} />
          <path d="M50,10 L50,90 M10,50 L90,50 M25,25 L75,75 M25,75 L75,25" className="animate-draw" style={{ animationDelay: '1.8s' }} />
        </svg>
        
        {/* Arrow */}
        <svg className="absolute bottom-[15%] right-[25%] w-16 h-16 text-purple-500 dark:text-purple-400 opacity-25 dark:opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5,12 H19 M13,6 L19,12 L13,18" className="animate-draw" style={{ animationDelay: '2.0s' }} />
        </svg>
      </div>
    </div>
  );
};

export default function Hero({ onGetStartedClick }: HeroProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="relative overflow-hidden lined-background">
      {/* Background pattern elements removed since we're using the new lined-background class */}
      
      {/* Add doodle elements */}
      <DoodleElements />

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-center pb-8">
          {/* Text content - 3 columns on large screens */}
          <div className="lg:col-span-3 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="max-w-2xl"
            >
              {/* Highlight badge */}
              <span className="inline-block px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 font-handwritten text-sm mb-4">
                Financial Education Simplified
              </span>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-handwritten font-bold text-notebook-blue dark:text-[#72baed] mb-6 leading-tight">
                Learn the Sharpe Ratio Through Play
              </h1>

              <p className="text-lg md:text-xl text-notebook-gray dark:text-gray-100 font-handwritten mb-2">
                Master one of finance&apos;s most important risk-measurement tools by building your own stock portfolio.
              </p>
              
              <p className="text-base md:text-lg text-notebook-gray dark:text-gray-100 font-handwritten mb-8">
                Understand risk-adjusted returns in a fun, interactive environment with no real money at stake.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                <Link
                  href="#game"
                  className="btn-notebook-primary py-3 px-6 text-base font-handwritten flex items-center text-white"
                >
                  <FaPencilAlt className="mr-2" /> Play the game
                </Link>
                
                <Link
                  href="/tutorial"
                  className="btn-notebook-secondary py-3 px-6 text-base font-handwritten flex items-center"
                >
                  <FaChartLine className="mr-2" /> Learn the basics
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Image content - 2 columns on large screens */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 0.9 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="lg:col-span-2 flex justify-center"
          >
            <div className="relative min-h-[300px] md:min-h-[400px] w-full max-w-md">
              <Image
                src="/images/sharpe-ratio-hero.svg"
                alt="Sharpe Ratio Visualization"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-contain"
                priority
              />
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="flex justify-center mt-8">
          <Link
            href="#game"
            className="p-2 text-notebook-gray dark:text-gray-100 font-handwritten flex flex-col items-center"
          >
            <p className="text-lg text-notebook-gray dark:text-gray-100 font-handwritten mb-2">
              Start exploring
            </p>
            <FaArrowDown className="h-6 w-6" />
          </Link>
        </div>
      </div>
    </div>
  );
} 