'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Todo } from '@/types/todo';
import { getPriorityColor, getPriorityBgColor } from './PrioritySelector';

interface TodoItemProps {
  todo: Todo;
  onToggle?: (id: number, completed: boolean) => void;
  onDelete?: (id: number) => Promise<void>;
  onEdit?: (todo: Todo) => void;
}

/**
 * Beautifully animated todo item component with full CRUD functionality.
 */
export default function TodoItem({ todo, onToggle, onDelete, onEdit }: TodoItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleToggle = () => {
    onToggle?.(todo.id, !todo.completed);
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    setIsDeleting(true);
    try {
      await onDelete(todo.id);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = () => {
    onEdit?.(todo);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: -100, scale: 0.95 }}
      transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 25 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`relative bg-white dark:bg-slate-800 rounded-xl shadow-md border border-gray-100 dark:border-slate-700 p-4 sm:p-5 transition-all duration-300 ${
        todo.completed ? 'opacity-70' : ''
      } ${isHovered ? 'shadow-lg shadow-primary-500/5' : ''}`}
    >
      {/* Subtle gradient overlay on hover */}
      <motion.div
        className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-500/5 to-accent-500/5"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      />

      <div className="relative flex items-start gap-4">
        {/* Animated checkbox */}
        <motion.button
          type="button"
          onClick={handleToggle}
          className={`mt-0.5 w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all duration-300 ${
            todo.completed
              ? 'bg-gradient-to-r from-primary-500 to-accent-500 border-transparent'
              : 'border-gray-300 dark:border-slate-600 hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20'
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
        >
          <motion.svg
            className="w-3.5 h-3.5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            initial={false}
            animate={{
              scale: todo.completed ? 1 : 0,
              opacity: todo.completed ? 1 : 0,
            }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </motion.svg>
        </motion.button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <motion.h3
            className={`text-base sm:text-lg font-medium transition-all duration-300 ${
              todo.completed
                ? 'line-through text-gray-400 dark:text-gray-500'
                : 'text-gray-900 dark:text-gray-100'
            }`}
            animate={{ opacity: todo.completed ? 0.6 : 1 }}
          >
            {todo.title}
          </motion.h3>

          {todo.description && (
            <motion.p
              className={`mt-1.5 text-sm transition-all duration-300 ${
                todo.completed
                  ? 'line-through text-gray-400 dark:text-gray-500'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
              animate={{ opacity: todo.completed ? 0.5 : 1 }}
            >
              {todo.description}
            </motion.p>
          )}

          <div className="flex items-center flex-wrap gap-2 mt-3">
            {/* Priority badge */}
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getPriorityBgColor(todo.priority)} ${getPriorityColor(todo.priority)}`}>
              {todo.priority === 'high' && '!'} {todo.priority}
            </span>

            {/* Status badge */}
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
              todo.completed
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                : 'bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400'
            }`}>
              {todo.completed ? '✓ Done' : '○ Pending'}
            </span>

            {/* Due date with overdue indicator */}
            {todo.due_date && (
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                todo.is_overdue
                  ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                  : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
              }`}>
                {todo.is_overdue && '! '}
                {new Date(todo.due_date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </span>
            )}

            {/* Recurrence indicator */}
            {todo.recurrence_rule && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400">
                🔄 {todo.recurrence_rule}
              </span>
            )}

            {/* Reminder indicator */}
            {todo.reminder_time && !todo.completed && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
                🔔 {new Date(todo.reminder_time).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </span>
            )}

            {/* Tags */}
            {todo.tags && todo.tags.length > 0 && todo.tags.map((tag) => (
              <span
                key={tag.id}
                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400"
              >
                #{tag.name}
              </span>
            ))}

            {/* Created date */}
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {new Date(todo.created_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <motion.div
          className="flex items-center gap-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0.5 }}
          transition={{ duration: 0.2 }}
        >
          {/* Edit button */}
          <motion.button
            type="button"
            onClick={handleEdit}
            className="p-2.5 text-gray-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Edit todo"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </motion.button>

          {/* Delete button */}
          <motion.button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Delete todo"
          >
            {isDeleting ? (
              <motion.svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </motion.svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            )}
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}
