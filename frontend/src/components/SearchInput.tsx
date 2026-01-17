'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
  disabled?: boolean;
}

/**
 * Debounced search input component.
 */
export default function SearchInput({
  value,
  onChange,
  placeholder = 'Search todos...',
  debounceMs = 300,
  disabled = false,
}: SearchInputProps) {
  const [localValue, setLocalValue] = useState(value);

  // Sync local value with external value
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Debounced onChange
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [localValue, debounceMs, onChange, value]);

  const handleClear = useCallback(() => {
    setLocalValue('');
    onChange('');
  }, [onChange]);

  return (
    <div className="relative flex-1 min-w-[200px]">
      {/* Search icon */}
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg
          className="h-5 w-5 text-gray-400 dark:text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* Input */}
      <input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full pl-10 pr-10 py-2.5 text-sm border-2 rounded-xl bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 border-gray-200 dark:border-slate-600 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 disabled:opacity-50"
      />

      {/* Clear button */}
      {localValue && (
        <motion.button
          type="button"
          onClick={handleClear}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
        >
          <svg
            className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </motion.button>
      )}
    </div>
  );
}
