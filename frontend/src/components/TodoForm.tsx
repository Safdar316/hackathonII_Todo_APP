'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { TodoCreate, Priority, RecurrenceRule } from '@/types/todo';
import PrioritySelector from './PrioritySelector';
import DateTimePicker, { formatDateForApi } from './DateTimePicker';
import TagInput from './TagInput';
import RecurrenceSelector from './RecurrenceSelector';

interface TodoFormProps {
  onSubmit: (data: TodoCreate) => Promise<void>;
}

/**
 * Animated form component for creating new todos with validation.
 */
export default function TodoForm({ onSubmit }: TodoFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [recurrence, setRecurrence] = useState<RecurrenceRule | null>(null);
  const [reminderTime, setReminderTime] = useState<Date | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({});
  const [isFocused, setIsFocused] = useState(false);

  const validate = (): boolean => {
    const newErrors: { title?: string; description?: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.length > 200) {
      newErrors.title = 'Title must be 200 characters or less';
    }

    if (description.length > 1000) {
      newErrors.description = 'Description must be 1000 characters or less';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || null,
        priority,
        due_date: formatDateForApi(dueDate),
        tags: tags.length > 0 ? tags : undefined,
        recurrence_rule: recurrence,
        reminder_time: formatDateForApi(reminderTime),
      });
      setTitle('');
      setDescription('');
      setPriority('medium');
      setDueDate(null);
      setTags([]);
      setRecurrence(null);
      setReminderTime(null);
      setErrors({});
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className={`relative bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-5 sm:p-6 mb-8 transition-shadow duration-300 ${
        isFocused ? 'shadow-xl shadow-primary-500/10' : ''
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Gradient border effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-500/20 via-accent-500/20 to-primary-500/20 opacity-0 transition-opacity duration-300 -z-10 blur-xl"
        style={{ opacity: isFocused ? 0.5 : 0 }}
      />

      <div className="space-y-4">
        {/* Title input */}
        <div>
          <label htmlFor="title" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            What needs to be done?
          </label>
          <motion.input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Enter your task..."
            className={`w-full px-4 py-3 text-base border-2 rounded-xl bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200 ${
              errors.title
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                : 'border-gray-200 dark:border-slate-600 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10'
            }`}
            disabled={isSubmitting}
            whileFocus={{ scale: 1.01 }}
          />
          {errors.title && (
            <motion.p
              className="mt-2 text-sm text-red-500"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {errors.title}
            </motion.p>
          )}
          <p className="mt-1.5 text-xs text-gray-400 dark:text-gray-500">
            {title.length}/200
          </p>
        </div>

        {/* Priority selector */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Priority
          </label>
          <PrioritySelector
            value={priority}
            onChange={setPriority}
            disabled={isSubmitting}
          />
        </div>

        {/* Due date picker */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Due Date <span className="font-normal text-gray-400">(optional)</span>
          </label>
          <DateTimePicker
            value={dueDate}
            onChange={(date) => {
              setDueDate(date);
              // Clear recurrence if due date is removed
              if (!date) {
                setRecurrence(null);
                setReminderTime(null);
              }
            }}
            placeholder="Select due date..."
            disabled={isSubmitting}
            minDate={new Date()}
          />
        </div>

        {/* Recurrence selector */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Repeat <span className="font-normal text-gray-400">(optional)</span>
          </label>
          <RecurrenceSelector
            value={recurrence}
            onChange={setRecurrence}
            disabled={isSubmitting}
            hasDueDate={!!dueDate}
          />
        </div>

        {/* Reminder time picker */}
        {dueDate && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Reminder <span className="font-normal text-gray-400">(optional)</span>
            </label>
            <DateTimePicker
              value={reminderTime}
              onChange={setReminderTime}
              placeholder="Set reminder..."
              disabled={isSubmitting}
              minDate={new Date()}
              maxDate={dueDate}
            />
            <p className="mt-1.5 text-xs text-gray-400 dark:text-gray-500">
              Reminder must be before or at the due date
            </p>
          </div>
        )}

        {/* Tags input */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Tags <span className="font-normal text-gray-400">(optional)</span>
          </label>
          <TagInput
            value={tags}
            onChange={setTags}
            disabled={isSubmitting}
            placeholder="Add tags..."
          />
        </div>

        {/* Description textarea */}
        <div>
          <label htmlFor="description" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Details <span className="font-normal text-gray-400">(optional)</span>
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Add more context..."
            rows={3}
            className={`w-full px-4 py-3 text-base border-2 rounded-xl bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 resize-none transition-all duration-200 ${
              errors.description
                ? 'border-red-500 focus:border-red-500'
                : 'border-gray-200 dark:border-slate-600 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10'
            }`}
            disabled={isSubmitting}
          />
          {errors.description && (
            <motion.p
              className="mt-2 text-sm text-red-500"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {errors.description}
            </motion.p>
          )}
          <p className="mt-1.5 text-xs text-gray-400 dark:text-gray-500">
            {description.length}/1000
          </p>
        </div>

        {/* Submit button */}
        <motion.button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto min-h-[48px] px-8 py-3 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isSubmitting ? (
            <>
              <motion.svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </motion.svg>
              Adding...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Task
            </>
          )}
        </motion.button>
      </div>
    </motion.form>
  );
}
