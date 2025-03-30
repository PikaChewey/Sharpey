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
    <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
      {/* All elements positioned absolutely within their container - no fixed positioning */}
      <div className="w-full h-full relative">
        {/* Math symbols doodle */}
        <svg className="absolute top-[5%] right-[8%] w-24 h-24 text-notebook-blue dark:text-blue-400 opacity-20 dark:opacity-60" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20,50 L80,50" className="animate-draw" style={{ animationDelay: '0.2s' }} />
          <path d="M50,20 L50,80" className="animate-draw" style={{ animationDelay: '0.4s' }} />
          <circle cx="50" cy="50" r="30" className="animate-draw" style={{ animationDelay: '0.6s' }} />
        </svg>
        
        {/* Dollar sign - with longer vertical line */}
        <svg className="absolute top-[25%] left-[5%] w-16 h-16 text-notebook-blue dark:text-blue-400 opacity-25 dark:opacity-60" viewBox="0 0 24 28" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12,1 L12,24 M17,5 C15,3 9,3 7,5 C5,7 5,11 7,13 C9,15 15,15 17,17 C19,19 19,23 17,25 C15,27 9,27 7,25" className="animate-draw" style={{ animationDelay: '1s' }} />
        </svg>

        {/* Sigma symbol - moved to middle-top */}
        <svg className="absolute top-[15%] left-[50%] transform -translate-x-1/2 w-20 h-20 text-teal-600 dark:text-teal-400 opacity-25 dark:opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5,4 L19,4 M5,20 L19,20 M5,4 L12,12 L5,20" className="animate-draw" style={{ animationDelay: '0.5s' }} />
        </svg>

        {/* Pi symbol - moved more right */}
        <svg className="absolute bottom-[15%] left-[35%] w-16 h-16 text-amber-600 dark:text-amber-400 opacity-25 dark:opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5,8 L19,8 M8,8 L8,20 M16,8 L16,20" className="animate-draw" style={{ animationDelay: '0.7s' }} />
        </svg>

        {/* Arrow - moved to WAY FAR DOWN */}
        <svg className="absolute bottom-[3%] left-[5%] w-28 h-16 text-red-600 dark:text-red-400 opacity-25 dark:opacity-60" viewBox="0 0 40 20" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M2,10 L35,10 M28,3 L35,10 L28,17" className="animate-draw" style={{ animationDelay: '0.9s' }} />
        </svg>

        {/* Asterisk symbol */}
        <svg className="absolute bottom-[35%] right-[7%] w-16 h-16 text-blue-600 dark:text-blue-400 opacity-25 dark:opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12,4 L12,20 M6,8 L18,16 M6,16 L18,8" className="animate-draw" style={{ animationDelay: '1.3s' }} />
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

      <div className="container-custom relative z-20">
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
                src="/images/sharpey.png"
                alt="Sharpey Logo"
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