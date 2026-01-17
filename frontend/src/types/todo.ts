/**
 * TypeScript interfaces for Todo entities.
 */

/** Priority levels for todos */
export type Priority = 'low' | 'medium' | 'high';

/** Recurrence patterns for recurring todos */
export type RecurrenceRule = 'daily' | 'weekly' | 'monthly';

/** Tag entity */
export interface Tag {
  id: number;
  name: string;
}

/** Todo entity returned from the API */
export interface Todo {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  created_at: string;
  priority: Priority;
  due_date: string | null;
  recurrence_rule: RecurrenceRule | null;
  reminder_time: string | null;
  tags: Tag[];
  is_overdue: boolean;
}

/** Request body for creating a new todo */
export interface TodoCreate {
  title: string;
  description?: string | null;
  priority?: Priority;
  due_date?: string | null;
  recurrence_rule?: RecurrenceRule | null;
  reminder_time?: string | null;
  tags?: string[];
}

/** Request body for updating an existing todo */
export interface TodoUpdate {
  title?: string;
  description?: string | null;
  completed?: boolean;
  priority?: Priority;
  due_date?: string | null;
  recurrence_rule?: RecurrenceRule | null;
  reminder_time?: string | null;
  tags?: string[];
}

/** Filter parameters for fetching todos */
export interface TodoFilters {
  search?: string;
  completed?: boolean;
  priority?: Priority;
  tags?: string[];
  due_from?: string;
  due_to?: string;
  sort_by?: 'created_at' | 'due_date' | 'priority' | 'title';
  sort_order?: 'asc' | 'desc';
}
