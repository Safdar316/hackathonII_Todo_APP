'use client';

import { motion } from 'framer-motion';
import { Priority } from '@/types/todo';

interface PrioritySelectorProps {
  value: Priority;
  onChange: (priority: Priority) => void;
  disabled?: boolean;
}

const priorities: { value: Priority; label: string; color: string; bgColor: string; activeColor: string }[] = [
  {
    value: 'low',
    label: 'Low',
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
    activeColor: 'bg-green-500 text-white border-green-500',
  },
  {
    value: 'medium',
    label: 'Medium',
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800',
    activeColor: 'bg-amber-500 text-white border-amber-500',
  },
  {
    value: 'high',
    label: 'High',
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
    activeColor: 'bg-red-500 text-white border-red-500',
  },
];

/**
 * Button group component for selecting todo priority level.
 */
export default function PrioritySelector({ value, onChange, disabled }: PrioritySelectorProps) {
  return (
    <div className="flex gap-2">
      {priorities.map((priority) => {
        const isActive = value === priority.value;
        return (
          <motion.button
            key={priority.value}
            type="button"
            onClick={() => onChange(priority.value)}
            disabled={disabled}
            className={`px-3 py-1.5 text-sm font-medium rounded-full border-2 transition-all duration-200 ${
              isActive
                ? priority.activeColor
                : `${priority.bgColor} ${priority.color} hover:opacity-80`
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            whileHover={{ scale: disabled ? 1 : 1.05 }}
            whileTap={{ scale: disabled ? 1 : 0.95 }}
          >
            {priority.label}
          </motion.button>
        );
      })}
    </div>
  );
}

/**
 * Get the color class for a priority level.
 */
export function getPriorityColor(priority: Priority): string {
  switch (priority) {
    case 'low':
      return 'text-green-600 dark:text-green-400';
    case 'medium':
      return 'text-amber-600 dark:text-amber-400';
    case 'high':
      return 'text-red-600 dark:text-red-400';
    default:
      return 'text-gray-600 dark:text-gray-400';
  }
}

/**
 * Get the background color class for a priority badge.
 */
export function getPriorityBgColor(priority: Priority): string {
  switch (priority) {
    case 'low':
      return 'bg-green-100 dark:bg-green-900/30';
    case 'medium':
      return 'bg-amber-100 dark:bg-amber-900/30';
    case 'high':
      return 'bg-red-100 dark:bg-red-900/30';
    default:
      return 'bg-gray-100 dark:bg-gray-900/30';
  }
}

/**
 * Get the border color class for a priority indicator.
 */
export function getPriorityBorderColor(priority: Priority): string {
  switch (priority) {
    case 'low':
      return 'border-green-300 dark:border-green-700';
    case 'medium':
      return 'border-amber-300 dark:border-amber-700';
    case 'high':
      return 'border-red-300 dark:border-red-700';
    default:
      return 'border-gray-300 dark:border-gray-700';
  }
}
