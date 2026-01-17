'use client';

import { useEffect, useCallback, useState, useRef } from 'react';
import { Todo } from '@/types/todo';
import { fetchPendingReminders } from '@/lib/api';
import {
  isNotificationSupported,
  getNotificationPermission,
  requestNotificationPermission,
  scheduleNotification,
  cancelNotification,
  cancelAllNotifications,
  NotificationPermission,
} from '@/lib/notifications';

interface UseRemindersOptions {
  /** How often to poll for new reminders (in ms). Default: 60000 (1 minute) */
  pollInterval?: number;
  /** Whether the hook is enabled. Default: true */
  enabled?: boolean;
}

interface UseRemindersReturn {
  /** Current notification permission status */
  permission: NotificationPermission;
  /** Whether notifications are supported in the browser */
  isSupported: boolean;
  /** Request notification permission from user */
  requestPermission: () => Promise<NotificationPermission>;
  /** Schedule a reminder for a specific todo */
  scheduleReminder: (todo: Todo) => boolean;
  /** Cancel a reminder for a specific todo */
  cancelReminder: (todoId: number) => void;
  /** Number of active scheduled reminders */
  activeRemindersCount: number;
}

/**
 * Hook for managing todo reminders and browser notifications.
 */
export function useReminders(options: UseRemindersOptions = {}): UseRemindersReturn {
  const { pollInterval = 60000, enabled = true } = options;

  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [activeRemindersCount, setActiveRemindersCount] = useState(0);
  const scheduledIds = useRef<Set<number>>(new Set());

  const isSupported = isNotificationSupported();

  // Update permission state on mount
  useEffect(() => {
    if (isSupported) {
      setPermission(getNotificationPermission());
    }
  }, [isSupported]);

  // Request notification permission
  const requestPermission = useCallback(async () => {
    const result = await requestNotificationPermission();
    setPermission(result);
    return result;
  }, []);

  // Schedule a reminder for a todo
  const scheduleReminder = useCallback((todo: Todo): boolean => {
    if (!todo.reminder_time || todo.completed) {
      return false;
    }

    const reminderTime = new Date(todo.reminder_time);
    const now = new Date();

    // Don't schedule if reminder time is in the past
    if (reminderTime <= now) {
      return false;
    }

    const success = scheduleNotification(
      todo.id,
      `Reminder: ${todo.title}`,
      todo.description || undefined,
      reminderTime
    );

    if (success) {
      scheduledIds.current.add(todo.id);
      setActiveRemindersCount(scheduledIds.current.size);
    }

    return success;
  }, []);

  // Cancel a reminder
  const cancelReminder = useCallback((todoId: number) => {
    cancelNotification(todoId);
    scheduledIds.current.delete(todoId);
    setActiveRemindersCount(scheduledIds.current.size);
  }, []);

  // Poll for pending reminders and schedule them
  useEffect(() => {
    if (!enabled || !isSupported || permission !== 'granted') {
      return;
    }

    const loadAndScheduleReminders = async () => {
      try {
        const todos = await fetchPendingReminders();

        // Schedule reminders for todos that aren't already scheduled
        todos.forEach((todo) => {
          if (!scheduledIds.current.has(todo.id) && todo.reminder_time) {
            scheduleReminder(todo);
          }
        });

        // Remove scheduled reminders for todos no longer in pending list
        const pendingIds = new Set(todos.map((t) => t.id));
        scheduledIds.current.forEach((id) => {
          if (!pendingIds.has(id)) {
            cancelReminder(id);
          }
        });
      } catch (error) {
        console.error('Failed to load pending reminders:', error);
      }
    };

    // Initial load
    loadAndScheduleReminders();

    // Set up polling interval
    const intervalId = setInterval(loadAndScheduleReminders, pollInterval);

    return () => {
      clearInterval(intervalId);
    };
  }, [enabled, isSupported, permission, pollInterval, scheduleReminder, cancelReminder]);

  // Clean up all notifications on unmount
  useEffect(() => {
    return () => {
      cancelAllNotifications();
    };
  }, []);

  return {
    permission,
    isSupported,
    requestPermission,
    scheduleReminder,
    cancelReminder,
    activeRemindersCount,
  };
}
