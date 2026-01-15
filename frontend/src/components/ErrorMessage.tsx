'use client';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

/**
 * Error display component with optional retry button.
 */
export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 my-4">
      <div className="flex items-center gap-3">
        <svg
          className="w-5 h-5 text-red-500 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-red-700 dark:text-red-300 text-sm flex-1">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-3 px-4 py-2 text-sm font-medium text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 rounded-md transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
