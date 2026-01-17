'use client';

import { useEffect, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Todo, TodoCreate, TodoUpdate, TodoFilters } from '@/types/todo';
import { fetchTodos, createTodo, updateTodo, deleteTodo, completeTodo } from '@/lib/api';
import { useReminders } from '@/hooks/useReminders';
import TodoItem from './TodoItem';
import TodoForm from './TodoForm';
import EmptyState from './EmptyState';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import EditTodoModal from './EditTodoModal';
import FilterPanel from './FilterPanel';

// Stagger animation variants for page load
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

/**
 * TodoList component that manages todos with full CRUD operations and filtering.
 */
export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [filters, setFilters] = useState<TodoFilters>({
    sort_by: 'created_at',
    sort_order: 'desc',
  });

  // Initialize reminders hook
  const { permission, isSupported, requestPermission, scheduleReminder } = useReminders();

  // Schedule reminders for loaded todos
  useEffect(() => {
    if (permission === 'granted') {
      todos.forEach((todo) => {
        if (todo.reminder_time && !todo.completed) {
          scheduleReminder(todo);
        }
      });
    }
  }, [todos, permission, scheduleReminder]);

  const loadTodos = useCallback(async (currentFilters: TodoFilters) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchTodos(currentFilters);
      setTodos(data);
      setHasLoaded(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load todos. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTodos(filters);
  }, [filters, loadTodos]);

  const handleFilterChange = (newFilters: TodoFilters) => {
    setFilters(newFilters);
  };

  const handleCreateTodo = async (data: TodoCreate) => {
    try {
      const newTodo = await createTodo(data);
      // Refetch to ensure proper sorting/filtering
      loadTodos(filters);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create todo. Please try again.');
      throw err;
    }
  };

  const handleToggleTodo = async (id: number, completed: boolean) => {
    const todo = todos.find((t) => t.id === id);

    // For recurring tasks being completed, use completeTodo API
    if (completed && todo?.recurrence_rule) {
      try {
        const result = await completeTodo(id);
        // Refetch to get the new instance and updated list
        loadTodos(filters);
        // Show success message if a new instance was created
        if (result.next_instance) {
          // Optionally show a toast or notification here
          console.log('Recurring task completed, next instance created:', result.next_instance);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to complete recurring todo. Please try again.');
      }
      return;
    }

    // Optimistic update for non-recurring tasks
    const previousTodos = [...todos];
    setTodos((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, completed } : t
      )
    );

    try {
      await updateTodo(id, { completed });
      // Refetch if filtering by completed status to update list
      if (filters.completed !== undefined) {
        loadTodos(filters);
      }
    } catch (err) {
      // Rollback on error
      setTodos(previousTodos);
      setError(err instanceof Error ? err.message : 'Failed to update todo status. Please try again.');
    }
  };

  const handleDeleteTodo = async (id: number) => {
    // Optimistic removal
    const previousTodos = [...todos];
    setTodos((prev) => prev.filter((todo) => todo.id !== id));

    try {
      await deleteTodo(id);
    } catch (err) {
      // Rollback on error
      setTodos(previousTodos);
      setError(err instanceof Error ? err.message : 'Failed to delete todo. Please try again.');
      throw err;
    }
  };

  const handleOpenEditModal = (todo: Todo) => {
    setEditingTodo(todo);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingTodo(null);
  };

  const handleSaveEdit = async (id: number, data: TodoUpdate) => {
    try {
      const updatedTodo = await updateTodo(id, data);
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === id ? updatedTodo : todo
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save changes. Please try again.');
      throw err;
    }
  };

  const clearError = () => setError(null);

  const hasActiveFilters =
    filters.search ||
    filters.completed !== undefined ||
    filters.priority !== undefined ||
    (filters.tags && filters.tags.length > 0) ||
    filters.due_from ||
    filters.due_to;

  if (loading && !hasLoaded) {
    return (
      <>
        <TodoForm onSubmit={handleCreateTodo} />
        <FilterPanel filters={filters} onFilterChange={handleFilterChange} />
        <LoadingSpinner />
      </>
    );
  }

  return (
    <>
      <TodoForm onSubmit={handleCreateTodo} />

      {/* Notification permission banner */}
      {isSupported && permission === 'default' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔔</span>
              <div>
                <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                  Enable notifications
                </p>
                <p className="text-xs text-amber-600 dark:text-amber-400">
                  Get reminded about your tasks on time
                </p>
              </div>
            </div>
            <button
              onClick={requestPermission}
              className="px-4 py-2 text-sm font-medium bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors"
            >
              Enable
            </button>
          </div>
        </motion.div>
      )}

      <FilterPanel filters={filters} onFilterChange={handleFilterChange} />

      {error && (
        <ErrorMessage
          message={error}
          onRetry={() => {
            clearError();
            loadTodos(filters);
          }}
        />
      )}

      {todos.length === 0 ? (
        hasActiveFilters ? (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              No todos match your filters
            </p>
            <button
              onClick={() => setFilters({ sort_by: 'created_at', sort_order: 'desc' })}
              className="text-primary-500 hover:text-primary-600 font-medium"
            >
              Clear filters
            </button>
          </motion.div>
        ) : (
          <EmptyState />
        )
      ) : (
        <motion.div
          className="space-y-3"
          variants={!hasLoaded ? containerVariants : undefined}
          initial={!hasLoaded ? "hidden" : false}
          animate="visible"
        >
          <AnimatePresence mode="popLayout">
            {todos.map((todo, index) => (
              <motion.div
                key={todo.id}
                variants={!hasLoaded ? itemVariants : undefined}
                transition={{ duration: 0.2, delay: !hasLoaded ? index * 0.05 : 0 }}
              >
                <TodoItem
                  todo={todo}
                  onToggle={handleToggleTodo}
                  onDelete={handleDeleteTodo}
                  onEdit={handleOpenEditModal}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <EditTodoModal
        todo={editingTodo}
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSave={handleSaveEdit}
      />
    </>
  );
}
