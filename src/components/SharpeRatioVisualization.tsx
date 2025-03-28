'use client';

import Image from 'next/image';

export default function SharpeRatioVisualization() {
  return (
    <div className="w-full flex justify-center items-center rounded-lg overflow-hidden bg-white dark:bg-gray-800 p-4 border-2 border-notebook-line dark:border-notebook-dark-line lined-background no-lines">
      <div className="relative w-full max-w-md aspect-[4/3] transform rotate-[-0.3deg]">
        <Image
          src="/images/sharperatio.png"
          alt="Sharpe Ratio Visualization"
          fill
          className="object-contain"
          priority
        />
        <div className="absolute bottom-0 w-full text-center py-2 text-sm font-handwritten">
          Sharpe Ratio = (Rp - Rf) / σp
        </div>
      </div>
    </div>
  );
} 