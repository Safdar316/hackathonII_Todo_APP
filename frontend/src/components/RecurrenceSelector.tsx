'use client';

import { motion } from 'framer-motion';
import { RecurrenceRule } from '@/types/todo';

interface RecurrenceSelectorProps {
  value: RecurrenceRule | null;
  onChange: (value: RecurrenceRule | null) => void;
  disabled?: boolean;
  requiresDueDate?: boolean;
  hasDueDate?: boolean;
}

const recurrenceOptions: { value: RecurrenceRule | null; label: string; icon: string }[] = [
  { value: null, label: 'None', icon: '○' },
  { value: 'daily', label: 'Daily', icon: '📅' },
  { value: 'weekly', label: 'Weekly', icon: '📆' },
  { value: 'monthly', label: 'Monthly', icon: '🗓️' },
];

/**
 * Recurrence pattern selector component.
 */
export default function RecurrenceSelector({
  value,
  onChange,
  disabled = false,
  requiresDueDate = true,
  hasDueDate = false,
}: RecurrenceSelectorProps) {
  const isDisabledDueToDate = requiresDueDate && !hasDueDate;
  const effectiveDisabled = disabled || isDisabledDueToDate;

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {recurrenceOptions.map((option) => {
          const isSelected = value === option.value;
          return (
            <motion.button
              key={option.label}
              type="button"
              onClick={() => !effectiveDisabled && onChange(option.value)}
              disabled={effectiveDisabled}
              className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                effectiveDisabled
                  ? 'opacity-50 cursor-not-allowed'
                  : 'cursor-pointer'
              } ${
                isSelected
                  ? 'bg-primary-500 text-white shadow-md shadow-primary-500/25'
                  : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
              }`}
              whileHover={!effectiveDisabled ? { scale: 1.02 } : undefined}
              whileTap={!effectiveDisabled ? { scale: 0.98 } : undefined}
            >
              <span className="flex items-center gap-1.5">
                <span>{option.icon}</span>
                <span>{option.label}</span>
              </span>
              {isSelected && (
                <motion.div
                  layoutId="recurrence-indicator"
                  className="absolute inset-0 rounded-lg border-2 border-primary-400"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Warning when due date is required but not set */}
      {isDisabledDueToDate && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Set a due date to enable recurring tasks
        </motion.p>
      )}

      {/* Info about selected recurrence */}
      {value && hasDueDate && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-gray-500 dark:text-gray-400"
        >
          This task will repeat {value} after completion
        </motion.p>
      )}
    </div>
  );
}
