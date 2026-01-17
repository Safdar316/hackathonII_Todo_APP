'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tag } from '@/types/todo';
import { fetchTags } from '@/lib/api';

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  disabled?: boolean;
  placeholder?: string;
}

/**
 * Tag input component with autocomplete and chip display.
 */
export default function TagInput({
  value,
  onChange,
  disabled = false,
  placeholder = 'Add tags...',
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch suggestions with debounce
  useEffect(() => {
    if (!inputValue.trim()) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const tags = await fetchTags(inputValue, 5);
        // Filter out already selected tags
        const filtered = tags.filter((tag) => !value.includes(tag.name));
        setSuggestions(filtered);
        setShowSuggestions(true);
      } catch {
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [inputValue, value]);

  // Close suggestions on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const addTag = useCallback(
    (tagName: string) => {
      const trimmed = tagName.trim().toLowerCase();
      if (trimmed && !value.includes(trimmed)) {
        onChange([...value, trimmed]);
      }
      setInputValue('');
      setSuggestions([]);
      setShowSuggestions(false);
      setSelectedIndex(-1);
      inputRef.current?.focus();
    },
    [value, onChange]
  );

  const removeTag = useCallback(
    (tagToRemove: string) => {
      onChange(value.filter((tag) => tag !== tagToRemove));
    },
    [value, onChange]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        addTag(suggestions[selectedIndex].name);
      } else if (inputValue.trim()) {
        addTag(inputValue);
      }
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      removeTag(value[value.length - 1]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <div
        className={`flex flex-wrap gap-2 px-3 py-2.5 border-2 rounded-xl bg-gray-50 dark:bg-slate-900 transition-all duration-200 ${
          disabled
            ? 'opacity-50 cursor-not-allowed'
            : 'border-gray-200 dark:border-slate-600 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/20'
        }`}
      >
        {/* Tag chips */}
        <AnimatePresence mode="popLayout">
          {value.map((tag) => (
            <motion.span
              key={tag}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-lg text-sm font-medium"
            >
              #{tag}
              {!disabled && (
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="hover:text-primary-900 dark:hover:text-primary-100 transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </motion.span>
          ))}
        </AnimatePresence>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => inputValue && setShowSuggestions(true)}
          placeholder={value.length === 0 ? placeholder : ''}
          disabled={disabled}
          className="flex-1 min-w-[100px] bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 outline-none text-sm"
        />

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex items-center">
            <svg className="animate-spin h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        )}
      </div>

      {/* Autocomplete suggestions */}
      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg shadow-lg overflow-hidden"
          >
            {suggestions.map((tag, index) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => addTag(tag.name)}
                className={`w-full px-3 py-2 text-left text-sm transition-colors ${
                  index === selectedIndex
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'
                }`}
              >
                #{tag.name}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Helper text */}
      <p className="mt-1.5 text-xs text-gray-400 dark:text-gray-500">
        Press Enter to add a tag
      </p>
    </div>
  );
}
