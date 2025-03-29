'use client';

import { motion } from 'framer-motion';
import Tutorial from '@/components/Tutorial';
import Footer from '@/components/Footer';

export default function TutorialPage() {
  return (
    <main className="flex flex-col min-h-screen">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="section bg-white dark:bg-gray-900 pt-32 lined-background"
      >
        <Tutorial onPlayNowClick={() => window.location.href = '/#game'} />
      </motion.div>
      
      <Footer />
    </main>
  );
} 