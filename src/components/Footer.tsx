'use client';

import Link from 'next/link';
import { FaBook, FaTwitter, FaGithub, FaEnvelope } from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="relative bg-notebook-paper dark:bg-notebook-dark-paper border-t border-notebook-line dark:border-notebook-dark-line lined-background">
      <div className="container-custom py-12 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Logo and Description */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <FaBook className="h-6 w-6 text-notebook-blue dark:text-blue-300" />
              <span className="text-xl font-handwritten font-bold text-notebook-blue dark:text-blue-300">Sharpey</span>
            </div>
            <p className="text-notebook-gray dark:text-gray-100 mb-4 max-w-md font-handwritten">
              An interactive tool to calculate and compare Sharpe Ratios for different 
              stock portfolios. Optimize your investments and understand risk-adjusted returns.
            </p>
            <div className="flex space-x-4">
              <a href="mailto:zhou-stanley@outlook.com,bryan.yao205@gmail.com" className="text-notebook-gray dark:text-gray-100 hover:text-notebook-blue dark:hover:text-blue-300 transition-colors transform hover:scale-110">
                <FaEnvelope className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Resources */}
          <div>
            <h3 className="text-lg font-handwritten font-bold mb-4 text-notebook-gray dark:text-gray-100">Resources</h3>
            <ul className="space-y-2 font-handwritten">
              <li className="flex items-center">
                <a 
                  href="https://www.youtube.com/watch?v=9HD6xo2iO1g&ab_channel=WallStreetQuants" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-notebook-gray dark:text-gray-100 hover:text-notebook-blue dark:hover:text-blue-300 transition-colors"
                >
                  What is Sharpe Ratio?
                </a>
              </li>
              <li className="flex items-center">
                <a 
                  href="https://www.investopedia.com/articles/basics/11/3-s-simple-investing.asp" 
                  className="text-notebook-gray dark:text-gray-100 hover:text-notebook-blue dark:hover:text-blue-300 transition-colors"
                >
                  Investment Strategies
                </a>
              </li>
              <li className="flex items-center">
                <a 
                  href="https://www.investopedia.com/terms/m/modernportfoliotheory.asp" 
                  className="text-notebook-gray dark:text-gray-100 hover:text-notebook-blue dark:hover:text-blue-300 transition-colors"
                >
                  Modern Portfolio Theory
                </a>
              </li>
              <li className="flex items-center">
                <a 
                  href=" https://www.investopedia.com/terms/r/riskmanagement.asp" 
                  className="text-notebook-gray dark:text-gray-100 hover:text-notebook-blue dark:hover:text-blue-300 transition-colors"
                >
                  Risk Management
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-notebook-line dark:border-notebook-dark-line flex justify-center items-center">
          <div className="text-notebook-gray dark:text-gray-100 text-sm font-handwritten">
            Made by Bryan Yao and Stanley Zhou {currentYear}
          </div>
        </div>
      </div>
    </footer>
  );
} 