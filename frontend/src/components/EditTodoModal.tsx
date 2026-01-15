'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Todo, TodoUpdate } from '@/types/todo';

interface EditTodoModalProps {
  todo: Todo | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: number, data: TodoUpdate) => Promise<void>;
}

/**
 * Responsive modal component for editing todo title and description.
 * Full-screen on mobile, centered modal on desktop.
 */
export default function EditTodoModal({ todo, isOpen, onClose, onSave }: EditTodoModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({});

  // Sync form state with todo when modal opens
  useEffect(() => {
    if (todo && isOpen) {
      setTitle(todo.title);
      setDescription(todo.description || '');
      setErrors({});
    }
  }, [todo, isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

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

    if (!todo || !validate()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave(todo.id, {
        title: title.trim(),
        description: description.trim() || null,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 sm:p-4"
          onClick={handleBackdropClick}
        >
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="bg-white dark:bg-slate-800 w-full sm:w-auto sm:min-w-[400px] sm:max-w-md sm:rounded-lg shadow-xl overflow-hidden rounded-t-2xl sm:rounded-lg max-h-[90vh] sm:max-h-none flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-slate-700">
              <h2 className="text-lg sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
                Edit Todo
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="p-2 min-w-[44px] min-h-[44px] sm:min-w-[36px] sm:min-h-[36px] flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-md transition-colors"
                aria-label="Close modal"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
              {/* Title input */}
              <div>
                <label htmlFor="edit-title" className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="edit-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-2 text-base border rounded-md bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 ${
                    errors.title
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-gray-300 dark:border-slate-600'
                  }`}
                  disabled={isSubmitting}
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-500">{errors.title}</p>
                )}
                <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                  {title.length}/200 characters
                </p>
              </div>

              {/* Description textarea */}
              <div>
                <label htmlFor="edit-description" className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Description
                </label>
                <textarea
                  id="edit-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-2 text-base border rounded-md bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 resize-none ${
                    errors.description
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-gray-300 dark:border-slate-600'
                  }`}
                  disabled={isSubmitting}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-500">{errors.description}</p>
                )}
                <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                  {description.length}/1000 characters
                </p>
              </div>

              {/* Actions - stacked on mobile, side-by-side on desktop */}
              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto min-h-[44px] px-4 py-2.5 text-sm sm:text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-md transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto min-h-[44px] px-4 py-2.5 text-sm sm:text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 rounded-md transition-colors flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
