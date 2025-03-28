'use client';

import React from 'react';
import { useTheme } from '@/components/ThemeProvider';
import NotebookDoodles from '@/components/NotebookDoodles';
import HandDrawnFilter from '@/components/HandDrawnFilter';

/**
 * ClientComponentWrapper
 * 
 * This component safely wraps all client-side components that need access to
 * the theme context. It helps prevent server/client hydration mismatches.
 */
export default function ClientComponentWrapper() {
  const { isMounted } = useTheme();
  
  // Don't render anything until client-side hydration is complete
  if (!isMounted) {
    return null;
  }
  
  return (
    <>
      <HandDrawnFilter />
      <NotebookDoodles />
    </>
  );
} 