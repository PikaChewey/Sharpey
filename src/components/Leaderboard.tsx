'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaTrophy, FaChartLine, FaUser, FaCalendarAlt, FaCrown, FaMedal, FaAward, FaStar, FaRegStar } from 'react-icons/fa';
import { BsFillAwardFill } from 'react-icons/bs';
import { Portfolio, getSavedPortfolios, getPortfoliosTested } from '@/utils/localStorageUtils';

// Sample global leaderboard data - in a real app, this would come from a server
const GLOBAL_LEADERBOARD = [
  {
    id: '1',
    username: 'InvestorPro',
    stock1: 'AAPL',
    stock2: 'NVDA',
    weight: 60,
    sharpeRatio: 2.41,
    date: '2023-04-15T14:48:00.000Z',
  },
  {
    id: '2',
    username: 'MarketWizard',
    stock1: 'MSFT',
    stock2: 'GOOGL',
    weight: 50,
    sharpeRatio: 2.27,
    date: '2023-04-16T09:23:00.000Z',
  },
  {
    id: '3',
    username: 'TradingQueen',
    stock1: 'AMZN',
    stock2: 'TSLA',
    weight: 40,
    sharpeRatio: 2.18,
    date: '2023-04-14T11:05:00.000Z',
  },
  {
    id: '4',
    username: 'FinanceGuru',
    stock1: 'BRK.B',
    stock2: 'V',
    weight: 70,
    sharpeRatio: 1.98,
    date: '2023-04-13T16:30:00.000Z',
  },
  {
    id: '5',
    username: 'StockMaster',
    stock1: 'JPM',
    stock2: 'DIS',
    weight: 55,
    sharpeRatio: 1.89,
    date: '2023-04-12T10:15:00.000Z',
  },
];

// Doodle elements for the leaderboard section
const LeaderboardDoodleElements = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {/* All elements positioned absolutely within their container - no fixed positioning */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Trophy */}
        <svg className="absolute top-[5%] right-[10%] w-24 h-24 text-amber-500 dark:text-amber-400 opacity-25 dark:opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M8,21 L16,21 M12,21 L12,17 M6,17 C4,17 3,16 3,13 L3,6 C3,5.5 3.5,5 4,5 L20,5 C20.5,5 21,5.5 21,6 L21,13 C21,16 20,17 18,17 L6,17 Z" className="animate-draw" style={{ animationDelay: '0.2s' }} />
          <path d="M8,5 L8,3 L16,3 L16,5" className="animate-draw" style={{ animationDelay: '0.4s' }} />
          <path d="M5,9 L3,9 L3,13 L5,13" className="animate-draw" style={{ animationDelay: '0.6s' }} />
          <path d="M19,9 L21,9 L21,13 L19,13" className="animate-draw" style={{ animationDelay: '0.8s' }} />
        </svg>
        
        {/* Medal */}
        <svg className="absolute top-[40%] left-[8%] w-20 h-20 text-blue-500 dark:text-blue-400 opacity-25 dark:opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="15" r="6" className="animate-draw" style={{ animationDelay: '1.0s' }} />
          <path d="M7,6 L17,6 M9,3 L15,3 M12,9 L12,3" className="animate-draw" style={{ animationDelay: '1.2s' }} />
          <path d="M10,15 L14,15 M12,13 L12,17" className="animate-draw" style={{ animationDelay: '1.4s' }} />
        </svg>
        
        {/* Star rating */}
        <svg className="absolute bottom-[15%] right-[15%] w-32 h-12 text-amber-500 dark:text-amber-400 opacity-25 dark:opacity-40" viewBox="0 0 120 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12,2 L15,8 L22,9 L17,14 L18,21 L12,18 L6,21 L7,14 L2,9 L9,8 Z" className="animate-draw" style={{ animationDelay: '0.3s' }} transform="translate(0,0)" />
          <path d="M12,2 L15,8 L22,9 L17,14 L18,21 L12,18 L6,21 L7,14 L2,9 L9,8 Z" className="animate-draw" style={{ animationDelay: '0.5s' }} transform="translate(25,0)" />
          <path d="M12,2 L15,8 L22,9 L17,14 L18,21 L12,18 L6,21 L7,14 L2,9 L9,8 Z" className="animate-draw" style={{ animationDelay: '0.7s' }} transform="translate(50,0)" />
          <path d="M12,2 L15,8 L22,9 L17,14 L18,21 L12,18 L6,21 L7,14 L2,9 L9,8 Z" className="animate-draw" style={{ animationDelay: '0.9s' }} transform="translate(75,0)" />
          <path d="M12,2 L15,8 L22,9 L17,14 L18,21 L12,18 L6,21 L7,14 L2,9 L9,8 Z" className="animate-draw" style={{ animationDelay: '1.1s' }} transform="translate(100,0)" />
        </svg>
      </div>
    </div>
  );
};

export default function Leaderboard() {
  const [localPortfolios, setLocalPortfolios] = useState<Portfolio[]>([]);
  const [globalLeaderboard, setGlobalLeaderboard] = useState(GLOBAL_LEADERBOARD);
  const [activeTab, setActiveTab] = useState<'local' | 'global'>('local');
  const portfoliosTested = getPortfoliosTested();

  useEffect(() => {
    const savedPortfolios = getSavedPortfolios();
    // Sort by Sharpe ratio (highest first)
    setLocalPortfolios(savedPortfolios.sort((a, b) => b.sharpeRatio - a.sharpeRatio));
  }, []);

  const getTop3Icon = (index: number) => {
    switch (index) {
      case 0:
        return <FaTrophy className="text-yellow-500" />;
      case 1:
        return <FaMedal className="text-gray-400" />;
      case 2:
        return <FaMedal className="text-amber-700" />;
      default:
        return <FaCrown className="text-notebook-blue dark:text-blue-400" />;
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <section id="leaderboard" className="relative py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="relative">
          {/* Add the doodle elements as background */}
          <LeaderboardDoodleElements />
          
          <div className="text-center mb-10 relative z-10">
            <h2 className="text-4xl font-handwritten mb-3">Leaderboard</h2>
            <p className="text-lg max-w-2xl mx-auto font-handwritten text-gray-700 dark:text-gray-300">
              See how your portfolio compares with others! The highest Sharpe Ratio wins.
            </p>
          </div>

          <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-300 dark:border-gray-700 relative z-10">
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <button
                className={`py-3 px-5 font-handwritten text-lg ${
                  activeTab === 'local'
                    ? 'border-b-2 border-notebook-blue dark:border-blue-400 text-notebook-blue dark:text-blue-400 font-medium'
                    : 'text-gray-600 dark:text-gray-400 hover:text-notebook-blue dark:hover:text-blue-300'
                }`}
                onClick={() => setActiveTab('local')}
              >
                My Portfolios ({localPortfolios.length})
              </button>
              <button
                className={`py-3 px-5 font-handwritten text-lg ${
                  activeTab === 'global'
                    ? 'border-b-2 border-notebook-blue dark:border-blue-400 text-notebook-blue dark:text-blue-400 font-medium'
                    : 'text-gray-600 dark:text-gray-400 hover:text-notebook-blue dark:hover:text-blue-300'
                }`}
                onClick={() => setActiveTab('global')}
              >
                Global Rankings
              </button>
            </div>

            <div className="p-4">
              {activeTab === 'local' && (
                <div>
                  <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-900 rounded font-handwritten flex justify-between items-center">
                    <div>
                      <span className="font-medium">Your Stats</span>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center">
                        <FaChartLine className="mr-2 text-notebook-blue dark:text-blue-400" />
                        <span>Portfolios Tested: {portfoliosTested}</span>
                      </div>
                      <div className="flex items-center">
                        <FaStar className="mr-2 text-amber-500" />
                        <span>Saved Portfolios: {localPortfolios.length}</span>
                      </div>
                    </div>
                  </div>

                  {localPortfolios.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="text-left border-b border-gray-200 dark:border-gray-700">
                            <th className="py-3 px-4 font-handwritten">#</th>
                            <th className="py-3 px-4 font-handwritten">Portfolio</th>
                            <th className="py-3 px-4 font-handwritten">
                              Sharpe Ratio
                            </th>
                            <th className="py-3 px-4 font-handwritten">Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                          {localPortfolios.map((portfolio, index) => (
                            <motion.tr 
                              key={portfolio.id} 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="hover:bg-gray-50 dark:hover:bg-gray-900"
                            >
                              <td className="py-3 px-4 font-handwritten flex items-center">
                                {index < 3 ? getTop3Icon(index) : <span className="ml-1">{index + 1}</span>}
                              </td>
                              <td className="py-3 px-4 font-handwritten">
                                <div>
                                  <span className="font-medium">{portfolio.username || 'Anonymous'}</span>
                                  <div className="text-sm text-gray-600 dark:text-gray-400">
                                    {portfolio.stock1} ({(portfolio.weight * 100).toFixed(0)}%) + {portfolio.stock2} ({((1 - portfolio.weight) * 100).toFixed(0)}%)
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-4 font-handwritten font-medium text-notebook-blue dark:text-blue-400">
                                {portfolio.sharpeRatio.toFixed(2)}
                              </td>
                              <td className="py-3 px-4 font-handwritten text-gray-600 dark:text-gray-400">
                                {formatDate(portfolio.date)}
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-lg font-handwritten text-gray-600 dark:text-gray-400">
                        You haven't saved any portfolios yet. 
                        Test and save your first portfolio to see it here!
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'global' && (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left border-b border-gray-200 dark:border-gray-700">
                        <th className="py-3 px-4 font-handwritten">#</th>
                        <th className="py-3 px-4 font-handwritten">User</th>
                        <th className="py-3 px-4 font-handwritten">Portfolio</th>
                        <th className="py-3 px-4 font-handwritten">Sharpe Ratio</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {globalLeaderboard.map((entry, index) => (
                        <motion.tr 
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="hover:bg-gray-50 dark:hover:bg-gray-900"
                        >
                          <td className="py-3 px-4 font-handwritten flex items-center">
                            {index < 3 ? getTop3Icon(index) : <span className="ml-1">{index + 1}</span>}
                          </td>
                          <td className="py-3 px-4 font-handwritten">
                            <div className="flex items-center">
                              <div className="bg-notebook-blue dark:bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3">
                                <FaUser />
                              </div>
                              <span>{entry.username}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 font-handwritten">
                            <div className="text-sm">
                              {entry.stock1} ({(entry.weight * 100).toFixed(0)}%) + {entry.stock2} ({((1 - entry.weight) * 100).toFixed(0)}%)
                            </div>
                          </td>
                          <td className="py-3 px-4 font-handwritten font-medium text-notebook-blue dark:text-blue-400">
                            {entry.sharpeRatio.toFixed(2)}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 