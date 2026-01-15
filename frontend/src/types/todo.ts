/**
 * TypeScript interfaces for Todo entities.
 */

/** Todo entity returned from the API */
export interface Todo {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  created_at: string;
}

/** Request body for creating a new todo */
export interface TodoCreate {
  title: string;
  description?: string | null;
}

/** Request body for updating an existing todo */
export interface TodoUpdate {
  title?: string;
  description?: string | null;
  completed?: boolean;
}
