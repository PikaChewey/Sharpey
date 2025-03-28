'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global error occurred:', error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 bg-notebook-paper dark:bg-notebook-dark-paper">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Critical Error</h2>
          <p className="mb-6 text-gray-700 dark:text-gray-300">
            We&apos;re sorry, but something has gone critically wrong.
          </p>
          <button
            onClick={() => reset()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
} 