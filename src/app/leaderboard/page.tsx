'use client';

import { motion } from 'framer-motion';
import Leaderboard from '@/components/Leaderboard';
import Footer from '@/components/Footer';

export default function LeaderboardPage() {
  return (
    <main className="flex flex-col min-h-screen">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="section bg-white dark:bg-gray-900 pt-24 lined-background"
      >
        <Leaderboard />
      </motion.div>
      
      <Footer />
    </main>
  );
} 