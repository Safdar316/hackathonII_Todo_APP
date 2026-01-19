'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tag } from '@/types/todo';
import { fetchTags } from '@/lib/api';

interface TagFilterProps {
  value: string[];
  onChange: (tags: string[]) => void;
  disabled?: boolean;
}

/**
 * Tag filter component for filtering todos by tags.
 */
export default function TagFilter({
  value,
  onChange,
  disabled = false,
}: TagFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch all tags on mount and when search changes
  useEffect(() => {
    const loadTags = async () => {
      setIsLoading(true);
      try {
        const tags = await fetchTags(searchTerm, 20);
        setAvailableTags(tags);
      } catch {
        setAvailableTags([]);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(loadTags, 200);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTag = (tagName: string) => {
    if (value.includes(tagName)) {
      onChange(value.filter((t) => t !== tagName));
    } else {
      onChange([...value, tagName]);
    }
  };

  const clearAll = () => {
    onChange([]);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`flex items-center gap-2 px-3 py-2 text-sm border-2 rounded-lg transition-all duration-200 ${
          disabled
            ? 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-slate-800'
            : value.length > 0
            ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-300 dark:border-primary-700 text-primary-700 dark:text-primary-300'
            : 'bg-gray-50 dark:bg-slate-900 border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-slate-500'
        }`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
        <span>Tags</span>
        {value.length > 0 && (
          <span className="px-1.5 py-0.5 bg-primary-500 text-white text-xs rounded-full">
            {value.length}
          </span>
        )}
        <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute z-20 mt-1 w-64 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg shadow-xl overflow-hidden"
          >
            {/* Search input */}
            <div className="p-2 border-b border-gray-200 dark:border-slate-700">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search tags..."
                className="w-full px-3 py-1.5 text-sm border rounded-md bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-slate-600 focus:border-primary-500 focus:outline-none"
              />
            </div>

            {/* Tag list */}
            <div className="max-h-48 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-4">
                  <svg className="animate-spin h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                </div>
              ) : availableTags.length === 0 ? (
                <div className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  No tags found
                </div>
              ) : (
                availableTags.map((tag) => {
                  const isSelected = value.includes(tag.name);
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => toggleTag(tag.name)}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors ${
                        isSelected
                          ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'
                      }`}
                    >
                      <span className={`w-4 h-4 rounded border flex items-center justify-center ${
                        isSelected
                          ? 'bg-primary-500 border-primary-500'
                          : 'border-gray-300 dark:border-slate-500'
                      }`}>
                        {isSelected && (
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </span>
                      <span>#{tag.name}</span>
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer with clear button */}
            {value.length > 0 && (
              <div className="p-2 border-t border-gray-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={clearAll}
                  className="w-full px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                >
                  Clear all tags
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected tags display */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {value.map((tag) => (
            <motion.span
              key={tag}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded text-xs"
            >
              #{tag}
              <button
                type="button"
                onClick={() => toggleTag(tag)}
                className="hover:text-primary-900 dark:hover:text-primary-100"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.span>
          ))}
        </div>
      )}
    </div>
  );
}
