import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <h2 className="text-2xl font-handwritten text-notebook-blue mb-4">Page Not Found</h2>
      <p className="mb-6 text-notebook-gray dark:text-gray-300 font-handwritten">
        We couldn&apos;t find the page you were looking for. It might have been moved or deleted.
      </p>
      <Link href="/" className="btn-notebook py-2 px-4 font-handwritten">
        Go back home
      </Link>
    </div>
  );
} 