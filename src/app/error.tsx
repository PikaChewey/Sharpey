'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Error occurred:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <h2 className="text-2xl font-handwritten text-notebook-red mb-4">Something went wrong!</h2>
      <p className="mb-6 text-notebook-gray dark:text-gray-300 font-handwritten">
        We&apos;re sorry, but an unexpected error occurred.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => reset()}
          className="btn-notebook py-2 px-4 font-handwritten"
        >
          Try again
        </button>
        <Link href="/" className="btn-notebook py-2 px-4 font-handwritten">
          Go back home
        </Link>
      </div>
    </div>
  );
} 