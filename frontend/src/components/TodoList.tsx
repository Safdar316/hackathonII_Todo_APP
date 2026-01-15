'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Todo, TodoCreate, TodoUpdate } from '@/types/todo';
import { fetchTodos, createTodo, updateTodo, deleteTodo } from '@/lib/api';
import TodoItem from './TodoItem';
import TodoForm from './TodoForm';
import EmptyState from './EmptyState';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import EditTodoModal from './EditTodoModal';

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
 * TodoList component that manages todos with full CRUD operations and page load animation.
 */
export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  const loadTodos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchTodos();
      setTodos(data);
      setHasLoaded(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load todos. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const handleCreateTodo = async (data: TodoCreate) => {
    try {
      const newTodo = await createTodo(data);
      setTodos((prev) => [newTodo, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create todo. Please try again.');
      throw err;
    }
  };

  const handleToggleTodo = async (id: number, completed: boolean) => {
    // Optimistic update
    const previousTodos = [...todos];
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed } : todo
      )
    );

    try {
      await updateTodo(id, { completed });
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

  if (loading) {
    return (
      <>
        <TodoForm onSubmit={handleCreateTodo} />
        <LoadingSpinner />
      </>
    );
  }

  return (
    <>
      <TodoForm onSubmit={handleCreateTodo} />

      {error && (
        <ErrorMessage
          message={error}
          onRetry={() => {
            clearError();
            loadTodos();
          }}
        />
      )}

      {todos.length === 0 ? (
        <EmptyState />
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
