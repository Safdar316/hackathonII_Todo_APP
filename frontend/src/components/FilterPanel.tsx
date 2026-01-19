'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TodoFilters, Priority } from '@/types/todo';
import SearchInput from './SearchInput';
import TagFilter from './TagFilter';
import DateRangeFilter from './DateRangeFilter';

interface FilterPanelProps {
  filters: TodoFilters;
  onFilterChange: (filters: TodoFilters) => void;
}

const statusOptions = [
  { value: undefined, label: 'All' },
  { value: false, label: 'Pending' },
  { value: true, label: 'Completed' },
];

const priorityOptions: { value: Priority | undefined; label: string }[] = [
  { value: undefined, label: 'All' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

const sortOptions = [
  { value: 'created_at', label: 'Created' },
  { value: 'due_date', label: 'Due Date' },
  { value: 'priority', label: 'Priority' },
  { value: 'title', label: 'Title' },
];

/**
 * Filter panel component for search, filters, and sorting.
 */
export default function FilterPanel({ filters, onFilterChange }: FilterPanelProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const hasActiveFilters =
    filters.search ||
    filters.completed !== undefined ||
    filters.priority !== undefined ||
    (filters.tags && filters.tags.length > 0) ||
    filters.due_from ||
    filters.due_to;

  const handleSearchChange = (search: string) => {
    onFilterChange({ ...filters, search: search || undefined });
  };

  const handleStatusChange = (completed: boolean | undefined) => {
    onFilterChange({ ...filters, completed });
  };

  const handlePriorityChange = (priority: Priority | undefined) => {
    onFilterChange({ ...filters, priority });
  };

  const handleSortChange = (sort_by: string) => {
    onFilterChange({ ...filters, sort_by: sort_by as TodoFilters['sort_by'] });
  };

  const handleSortOrderChange = () => {
    onFilterChange({
      ...filters,
      sort_order: filters.sort_order === 'asc' ? 'desc' : 'asc',
    });
  };

  const handleTagsChange = (tags: string[]) => {
    onFilterChange({ ...filters, tags: tags.length > 0 ? tags : undefined });
  };

  const handleDateRangeChange = (due_from: string | undefined, due_to: string | undefined) => {
    onFilterChange({ ...filters, due_from, due_to });
  };

  const handleClearFilters = () => {
    onFilterChange({
      sort_by: filters.sort_by,
      sort_order: filters.sort_order,
    });
  };

  return (
    <motion.div
      className="bg-white dark:bg-slate-800 rounded-xl shadow-md border border-gray-100 dark:border-slate-700 p-4 mb-6"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-wrap items-center gap-4">
        {/* Search */}
        <SearchInput
          value={filters.search || ''}
          onChange={handleSearchChange}
          placeholder="Search todos..."
        />

        {/* Status filter */}
        <div className="flex items-center gap-1">
          {statusOptions.map((option) => (
            <button
              key={option.label}
              onClick={() => handleStatusChange(option.value)}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                filters.completed === option.value
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Priority filter */}
        <select
          value={filters.priority || ''}
          onChange={(e) => handlePriorityChange(e.target.value as Priority | undefined || undefined)}
          className="px-3 py-2 text-sm border-2 rounded-lg bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-slate-600 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
        >
          {priorityOptions.map((option) => (
            <option key={option.label} value={option.value || ''}>
              {option.value ? `Priority: ${option.label}` : 'All Priorities'}
            </option>
          ))}
        </select>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <select
            value={filters.sort_by || 'created_at'}
            onChange={(e) => handleSortChange(e.target.value)}
            className="px-3 py-2 text-sm border-2 rounded-lg bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-slate-600 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                Sort: {option.label}
              </option>
            ))}
          </select>

          <button
            onClick={handleSortOrderChange}
            className="p-2 text-gray-500 hover:text-primary-500 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title={filters.sort_order === 'asc' ? 'Ascending' : 'Descending'}
          >
            {filters.sort_order === 'asc' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
              </svg>
            )}
          </button>
        </div>

        {/* Tags filter */}
        <TagFilter
          value={filters.tags || []}
          onChange={handleTagsChange}
        />

        {/* Advanced filter toggle */}
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
            showAdvanced
              ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
              : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          Advanced
          <svg className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Clear filters */}
        {hasActiveFilters && (
          <motion.button
            onClick={handleClearFilters}
            className="px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            Clear Filters
          </motion.button>
        )}
      </div>

      {/* Advanced filters panel */}
      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-4 mt-4 border-t border-gray-200 dark:border-slate-700">
              <div className="flex flex-wrap items-center gap-4">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Due Date Range:</span>
                <DateRangeFilter
                  dueFrom={filters.due_from}
                  dueTo={filters.due_to}
                  onChange={handleDateRangeChange}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
