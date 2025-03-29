import './globals.css';
import type { Metadata } from 'next';

// Font imports
import { 
  Inter, 
  Roboto_Mono, 
  Architects_Daughter, 
  Indie_Flower, 
  Shadows_Into_Light,
  Gochi_Hand
} from 'next/font/google';
 
// Component imports
import Navbar from '@/components/Navbar';
import { ThemeProvider } from '@/components/ThemeProvider';
import ClientComponentWrapper from '@/components/ClientComponentWrapper';
import DoodleBackground from '@/components/DoodleBackground';
import { Analytics } from '@vercel/analytics/react';

// Font configurations
const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter', 
  display: 'swap'
});

const mono = Roboto_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap'
});

const architects = Architects_Daughter({
  weight: ['400'],
  variable: '--font-architects',
  subsets: ['latin'],
  display: 'swap'
});

const indie = Indie_Flower({
  weight: ['400'],
  variable: '--font-indie',
  subsets: ['latin'],
  display: 'swap'
});

const shadows = Shadows_Into_Light({
  weight: ['400'],
  variable: '--font-shadows',
  subsets: ['latin'],
  display: 'swap'
});

const gochi = Gochi_Hand({
  weight: ['400'],
  variable: '--font-gochi',
  subsets: ['latin'],
  display: 'swap'
});

// Metadata for SEO
export const metadata: Metadata = {
  title: 'Sharpe Calculator - Interactive Notebook for Investment Analysis',
  description: 'Calculate Sharpe ratios with an interactive notebook-themed calculator for evaluating investment risks and returns.',
  keywords: 'Sharpe ratio, investment calculator, finance, portfolio analysis, risk-adjusted return',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${mono.variable} ${architects.variable} ${indie.variable} ${shadows.variable} ${gochi.variable} font-sans bg-notebook-paper dark:bg-notebook-dark-paper min-h-screen lined-background`}>
        <ThemeProvider>
          <Navbar />
          <div className="relative min-h-screen">
            <ClientComponentWrapper />
            <DoodleBackground />
            <main className="container mx-auto px-4 py-4 mt-2 relative z-10">
              {children}
            </main>
          </div>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
} 