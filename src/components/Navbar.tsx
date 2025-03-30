'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaChartLine, FaPencilAlt } from 'react-icons/fa';
import { ThemeSwitcher } from './ThemeProvider';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 lined-background ${
        isScrolled
          ? 'bg-notebook-paper/95 dark:bg-notebook-dark-paper/95 backdrop-blur-md shadow-md'
          : 'bg-notebook-paper/80 dark:bg-notebook-dark-paper/80 backdrop-blur-sm'
      }`}
      style={{ position: 'fixed', width: '100%' }}
    >
      <div className="container-custom flex items-center justify-between h-14 md:h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="relative h-8 w-8 flex-shrink-0">
            <Image 
              src="/images/sharpey.png" 
              alt="Sharpey" 
              width={32} 
              height={32} 
              className="object-contain"
            />
          </div>
          <span className="text-lg md:text-xl font-handwritten font-bold text-notebook-blue">
            Sharpey
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-5">
          <Link
            href="/tutorial"
            className={`text-sm text-notebook-gray dark:text-gray-100 hover:text-notebook-blue dark:hover:text-notebook-blue font-handwritten ${
              pathname === '/tutorial' ? 'text-notebook-blue dark:text-blue-300 relative hover:no-underline after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-notebook-blue' : ''
            }`}
          >
            Tutorial
          </Link>
          <Link
            href="/leaderboard"
            className={`text-sm text-notebook-gray dark:text-gray-100 hover:text-notebook-blue dark:hover:text-notebook-blue font-handwritten ${
              pathname === '/leaderboard' ? 'text-notebook-blue dark:text-blue-300 relative hover:no-underline after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-notebook-blue' : ''
            }`}
          >
            Leaderboard
          </Link>
          
          {/* Theme Switcher */}
          <div className="ml-2">
            <ThemeSwitcher />
          </div>
          
          <Link
            href="/#game"
            className="btn-notebook py-1.5 px-3 text-xs md:text-sm font-handwritten flex items-center"
          >
            <FaPencilAlt className="mr-1 h-3 w-3" /> Get Started
          </Link>
        </div>

        {/* Mobile Controls */}
        <div className="md:hidden flex items-center space-x-2">
          {/* Theme Switcher for Mobile */}
          <ThemeSwitcher />
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1.5 rounded-md text-notebook-gray dark:text-gray-200"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              style={{ filter: 'url(#pencil-effect)' }}
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="md:hidden bg-notebook-paper dark:bg-notebook-dark-paper lined-background shadow-lg border-b-2 border-notebook-line dark:border-notebook-dark-line"
        >
          <div className="container-custom py-3 space-y-2">
            <Link
              href="/tutorial"
              className={`block w-full text-left py-1.5 text-notebook-gray dark:text-gray-100 hover:text-notebook-blue dark:hover:text-notebook-blue font-handwritten ${
                pathname === '/tutorial' ? 'text-notebook-blue dark:text-blue-300' : ''
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Tutorial
            </Link>
            <Link
              href="/leaderboard"
              className={`block w-full text-left py-1.5 text-notebook-gray dark:text-gray-100 hover:text-notebook-blue dark:hover:text-notebook-blue font-handwritten ${
                pathname === '/leaderboard' ? 'text-notebook-blue dark:text-blue-300' : ''
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Leaderboard
            </Link>
            <Link
              href="/#game"
              className="w-full btn-notebook py-1.5 px-3 text-xs font-handwritten flex items-center justify-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <FaPencilAlt className="mr-1 h-3 w-3" /> Get Started
            </Link>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}