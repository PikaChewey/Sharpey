export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <div className="h-12 w-12 border-t-2 border-b-2 border-notebook-blue dark:border-blue-400 rounded-full animate-spin"></div>
      <p className="mt-4 font-handwritten text-notebook-gray dark:text-gray-300">Loading...</p>
    </div>
  );
} 