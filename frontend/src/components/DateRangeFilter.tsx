'use client';

import { motion } from 'framer-motion';
import DateTimePicker, { formatDateForApi, parseDate } from './DateTimePicker';

interface DateRangeFilterProps {
  dueFrom: string | undefined;
  dueTo: string | undefined;
  onChange: (dueFrom: string | undefined, dueTo: string | undefined) => void;
  disabled?: boolean;
}

/**
 * Date range filter component with two date pickers.
 */
export default function DateRangeFilter({
  dueFrom,
  dueTo,
  onChange,
  disabled = false,
}: DateRangeFilterProps) {
  const handleFromChange = (date: Date | null) => {
    const formatted = formatDateForApi(date);
    onChange(formatted ?? undefined, dueTo);
  };

  const handleToChange = (date: Date | null) => {
    const formatted = formatDateForApi(date);
    onChange(dueFrom, formatted ?? undefined);
  };

  const handleClear = () => {
    onChange(undefined, undefined);
  };

  const hasRange = dueFrom || dueTo;

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">From:</span>
          <div className="w-[140px]">
            <DateTimePicker
              value={parseDate(dueFrom ?? null)}
              onChange={handleFromChange}
              placeholder="Start date"
              disabled={disabled}
              showTimeSelect={false}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">To:</span>
          <div className="w-[140px]">
            <DateTimePicker
              value={parseDate(dueTo ?? null)}
              onChange={handleToChange}
              placeholder="End date"
              disabled={disabled}
              showTimeSelect={false}
              minDate={dueFrom ? parseDate(dueFrom) ?? undefined : undefined}
            />
          </div>
        </div>

        {hasRange && (
          <motion.button
            type="button"
            onClick={handleClear}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
            title="Clear date range"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </motion.button>
        )}
      </div>
    </div>
  );
}
