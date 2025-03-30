'use client';

import React from 'react';
import { useTheme } from '@/components/ThemeProvider';

/**
 * NotebookDoodles renders decorative hand-drawn elements to enhance the notebook theme
 * All elements have been removed as requested
 */
export default function NotebookDoodles() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Empty container - all doodles removed */}
    </div>
  );
}

// Empty function - all doodles removed
function getRandomDoodle() {
  return null;
} 