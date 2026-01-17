'use client';

import { forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface DateTimePickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  disabled?: boolean;
  showTimeSelect?: boolean;
  minDate?: Date;
  maxDate?: Date;
  isClearable?: boolean;
  className?: string;
}

/**
 * Wrapper component for react-datepicker with consistent styling.
 */
export default function DateTimePicker({
  value,
  onChange,
  placeholder = 'Select date...',
  disabled = false,
  showTimeSelect = true,
  minDate,
  maxDate,
  isClearable = true,
  className = '',
}: DateTimePickerProps) {
  // Custom input component for styling consistency
  const CustomInput = forwardRef<HTMLButtonElement, { value?: string; onClick?: () => void }>(
    ({ value, onClick }, ref) => (
      <button
        type="button"
        onClick={onClick}
        ref={ref}
        disabled={disabled}
        className={`w-full px-3 py-2 text-left text-sm border-2 rounded-lg bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-slate-600 hover:border-primary-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      >
        {value || <span className="text-gray-400 dark:text-gray-500">{placeholder}</span>}
      </button>
    )
  );
  CustomInput.displayName = 'CustomInput';

  return (
    <div className="relative">
      <DatePicker
        selected={value}
        onChange={onChange}
        showTimeSelect={showTimeSelect}
        timeFormat="HH:mm"
        timeIntervals={15}
        dateFormat={showTimeSelect ? "MMM d, yyyy h:mm aa" : "MMM d, yyyy"}
        minDate={minDate}
        maxDate={maxDate}
        isClearable={isClearable}
        disabled={disabled}
        customInput={<CustomInput />}
        popperClassName="react-datepicker-popper"
        calendarClassName="!bg-white dark:!bg-slate-800 !border-gray-200 dark:!border-slate-700 !rounded-lg !shadow-lg"
        dayClassName={(date) =>
          "!rounded-md hover:!bg-primary-100 dark:hover:!bg-primary-900/30"
        }
      />
    </div>
  );
}

/**
 * Parse ISO date string to Date object.
 */
export function parseDate(dateString: string | null): Date | null {
  if (!dateString) return null;
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date;
}

/**
 * Format Date object to ISO string for API.
 */
export function formatDateForApi(date: Date | null): string | null {
  if (!date) return null;
  return date.toISOString();
}
