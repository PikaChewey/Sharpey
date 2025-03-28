'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Hero from '@/components/Hero';
import GameSection from '@/components/GameSection';
import Footer from '@/components/Footer';

export default function Home() {
  const gameRef = useRef<HTMLDivElement>(null);

  // Smooth scroll function for the game section
  const scrollToGame = () => {
    if (gameRef.current) {
      gameRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main className="flex flex-col min-h-screen">
      <Hero onGetStartedClick={scrollToGame} />
      
      <motion.div 
        id="game"
        ref={gameRef}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="section bg-notebook-paper dark:bg-notebook-dark-paper border-t border-b border-notebook-line dark:border-notebook-dark-line lined-background"
      >
        <GameSection />
      </motion.div>
      
      <Footer />
    </main>
  );
} 