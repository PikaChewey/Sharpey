'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaArrowRight, FaArrowLeft, FaChartLine, FaBalanceScale, FaCalculator, FaProjectDiagram } from 'react-icons/fa';

// Doodle elements for the tutorial
const TutorialDoodleElements = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {/* All elements positioned absolutely within their container - no fixed positioning */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Formula elements */}
        <svg className="absolute top-[10%] right-[15%] w-28 h-16 text-notebook-blue dark:text-blue-400 opacity-20 dark:opacity-60" viewBox="0 0 100 60" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M10,30 L90,30" className="animate-draw" style={{ animationDelay: '0.2s' }} />
          <path d="M20,10 L40,10 M30,10 L30,30" className="animate-draw" style={{ animationDelay: '0.4s' }} />
          <path d="M50,10 L70,10 M50,20 L70,20" className="animate-draw" style={{ animationDelay: '0.6s' }} />
          <path d="M20,40 L80,40 M40,50 L60,50" className="animate-draw" style={{ animationDelay: '0.8s' }} />
        </svg>
        
        {/* Brain/education symbol */}
        <svg className="absolute top-[40%] left-[8%] w-20 h-20 text-purple-500 dark:text-purple-400 opacity-25 dark:opacity-60" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M50,10 C25,10 20,30 20,45 C20,70 40,80 50,90 C60,80 80,70 80,45 C80,30 75,10 50,10 Z" className="animate-draw" style={{ animationDelay: '1.0s' }} />
          <path d="M50,10 C60,25 60,45 50,50 C40,45 40,25 50,10 Z" className="animate-draw" style={{ animationDelay: '1.2s' }} />
          <path d="M35,30 Q50,40 65,30" className="animate-draw" style={{ animationDelay: '1.4s' }} />
          <circle cx="40" cy="67" r="4" className="animate-draw" style={{ animationDelay: '1.6s' }} />
          <circle cx="60" cy="67" r="4" className="animate-draw" style={{ animationDelay: '1.8s' }} />
        </svg>
        
        {/* Graduation hat */}
        <svg className="absolute bottom-[15%] right-[12%] w-16 h-16 text-notebook-blue dark:text-blue-400 opacity-25 dark:opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M2,10 L12,5 L22,10 L12,15 L2,10 Z" className="animate-draw" style={{ animationDelay: '0.5s' }} />
          <path d="M19,10 L19,16" className="animate-draw" style={{ animationDelay: '0.7s' }} />
          <path d="M12,15 L12,20" className="animate-draw" style={{ animationDelay: '0.9s' }} />
          <path d="M8,12 L8,17 C8,17 10,19 12,19 C14,19 16,17 16,17 V12" className="animate-draw" style={{ animationDelay: '1.1s' }} />
        </svg>
      </div>
    </div>
  );
};

interface TutorialProps {
  onPlayNowClick: () => void;
}

export default function Tutorial({ onPlayNowClick }: TutorialProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "What is the Sharpe Ratio?",
      icon: <FaChartLine className="w-8 h-8" />,
      content: (
        <>
          <p className="mb-4">
            The Sharpe Ratio is a measure developed by Nobel laureate William F. Sharpe to help investors understand the return of an investment compared to its risk.
          </p>
          <p className="mb-4">
            It is calculated by subtracting the risk-free rate from the expected return, then dividing by the standard deviation of the portfolio&apos;s excess return.
          </p>
          
          <div className="my-6 p-5 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 no-lines">
            <p className="text-center font-medium">
              The Sharpe Ratio provides a way to compare different investments on a risk-adjusted basis.
              Higher ratios indicate better risk-adjusted performance.
            </p>
          </div>
          
          <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg no-lines">
            <code className="text-center block">
              Sharpe Ratio = (Rp - Rf) / σp
            </code>
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Where:
              <ul className="list-disc pl-5 mt-1">
                <li>Rp = Expected portfolio return</li>
                <li>Rf = Risk-free rate</li>
                <li>σp = Portfolio standard deviation</li>
              </ul>
            </div>
          </div>
        </>
      ),
    },
    {
      title: "Why is it Important?",
      icon: <FaBalanceScale className="w-8 h-8" />,
      content: (
        <>
          <p className="mb-4">
            The Sharpe Ratio helps investors determine how much additional return they&apos;re receiving for the extra volatility they endure for holding a riskier asset.
          </p>
          <p className="mb-4">
            A higher Sharpe Ratio indicates better risk-adjusted performance:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><span className="font-medium text-red-600 dark:text-red-400">Negative Sharpe Ratio</span>: Underperforming the risk-free rate</li>
            <li><span className="font-medium text-orange-600 dark:text-orange-400">0 to 0.5</span>: Below average risk-adjusted returns</li>
            <li><span className="font-medium text-yellow-600 dark:text-yellow-400">0.5 to 1.0</span>: Average performance</li>
            <li><span className="font-medium text-green-600 dark:text-green-400">1.0 to 2.0</span>: Good risk-adjusted performance</li>
            <li><span className="font-medium text-emerald-600 dark:text-emerald-400">&gt; 2.0</span>: Excellent performance</li>
          </ul>
          <p className="mt-4">
            The average hedge fund has a Sharpe Ratio between 0.5 and 1.0, while the S&P 500 historically has had a Sharpe Ratio around 0.4.
          </p>
        </>
      ),
    },
    {
      title: "Portfolio Diversification",
      icon: <FaProjectDiagram className="w-8 h-8" />,
      content: (
        <>
          <p className="mb-4">
            Diversification is a risk management strategy that involves spreading investments across various financial instruments, industries, and asset classes.
          </p>
          <p className="mb-4">
            Key benefits of portfolio diversification:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><span className="font-medium">Reduces unsystematic risk</span>: Minimizes the impact of poor performance from any single investment</li>
            <li><span className="font-medium">Preserves capital</span>: Helps protect your overall portfolio value</li>
            <li><span className="font-medium">Provides more consistent returns</span>: Smooths out the ups and downs over time</li>
            <li><span className="font-medium">Can improve Sharpe Ratio</span>: Potentially increases returns while reducing volatility</li>
          </ul>
          <p className="mt-4">
            In our game, you&apos;ll experiment with different portfolio allocations between two assets to find the optimal mix that maximizes your Sharpe Ratio.
          </p>
        </>
      ),
    },
    {
      title: "Understanding Risk Metrics",
      icon: <FaChartLine className="w-8 h-8" />,
      content: (
        <>
          <p className="mb-4">
            Beyond the Sharpe Ratio, our game shows additional risk metrics to help you evaluate your portfolio:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <span className="font-medium">Sortino Ratio</span>: Similar to Sharpe Ratio but only considers &quot;downside&quot; deviation. 
              It focuses on harmful volatility rather than total volatility.
            </li>
            <li>
              <span className="font-medium">Beta</span>: Measures how volatile your portfolio is compared to the broader market (S&P 500). 
              A beta of 1 means your portfolio moves in line with the market; higher means more volatile.
            </li>
            <li>
              <span className="font-medium">Standard Deviation</span>: Quantifies the amount of variation or dispersion in returns. 
              Higher standard deviation means more volatility and potentially higher risk.
            </li>
          </ul>
          <p className="mt-4">
            Advanced investors consider all these metrics together when making investment decisions.
          </p>
        </>
      ),
    },
    {
      title: "How to Play the Game",
      icon: <FaCalculator className="w-8 h-8" />,
      content: (
        <>
          <p className="mb-4">
            In our Sharpes game, you&apos;ll build a portfolio and test its Sharpe Ratio:
          </p>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Enter two stock ticker symbols (e.g., MSFT, AAPL)</li>
            <li>Adjust the weighting slider to allocate your investment</li>
            <li>The game will calculate the 1-year trailing Sharpe Ratio</li>
            <li>View performance graphs and compare to market indices</li>
            <li>Try different combinations to achieve the highest ratio</li>
            <li>Save your best portfolios to the leaderboard</li>
          </ol>
          <p className="mt-4">
            The goal is to create a portfolio with the highest possible Sharpe Ratio. Can you beat the market and other players?
          </p>
        </>
      ),
    },
  ];

  return (
    <section id="learn" className="relative">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="relative">
          {/* Add the doodle elements as background */}
          <TutorialDoodleElements />
          
          <h2 className="text-4xl font-handwritten mb-8 text-center relative z-10 bg-white dark:bg-gray-900 py-2 px-4 rounded inline-block mx-auto no-lines">Learn About the Sharpe Ratio</h2>
          <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-300 dark:border-gray-700 relative z-10 no-lines">
            {/* Rest of tutorial component */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                {slides[currentSlide].icon}
                <h3 className="text-2xl font-handwritten">{slides[currentSlide].title}</h3>
              </div>
              <div className="prose dark:prose-invert max-w-none">
                {slides[currentSlide].content}
              </div>
            </div>

            <div className="flex justify-between items-center">
              <button
                onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))}
                disabled={currentSlide === 0}
                className={`px-4 py-2 rounded-md flex items-center font-handwritten ${
                  currentSlide === 0 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-notebook-blue dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                }`}
              >
                <FaArrowLeft className="mr-2" /> Previous
              </button>
              
              <div className="flex space-x-1">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2.5 h-2.5 rounded-full transition-colors ${
                      currentSlide === index
                        ? 'bg-notebook-blue dark:bg-blue-500'
                        : 'bg-gray-300 dark:bg-gray-700'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
              
              {currentSlide === slides.length - 1 ? (
                <button
                  onClick={onPlayNowClick}
                  className="px-4 py-2 bg-notebook-blue dark:bg-blue-600 text-white rounded-md flex items-center font-handwritten hover:bg-blue-700 dark:hover:bg-blue-700 transition-colors"
                >
                  Play Now <FaArrowRight className="ml-2" />
                </button>
              ) : (
                <button
                  onClick={() => setCurrentSlide(prev => Math.min(slides.length - 1, prev + 1))}
                  className="px-4 py-2 text-notebook-blue dark:text-blue-400 rounded-md flex items-center font-handwritten hover:bg-blue-50 dark:hover:bg-blue-900/20"
                >
                  Next <FaArrowRight className="ml-2" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 