# Data Model: Full-Stack Todo Web Application (Phase II)

**Feature Branch**: `001-fullstack-todo-webapp`
**Created**: 2026-01-14
**Status**: Complete

## Overview

This document defines the data model for the Phase II Todo application with PostgreSQL persistence.

---

## Entity: Todo

The Todo entity represents a task to be tracked by the user.

### Schema Definition

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY, AUTO-INCREMENT | Unique identifier |
| `title` | VARCHAR(200) | NOT NULL, MIN 1 char | Task title (required) |
| `description` | VARCHAR(1000) | NULLABLE | Optional task details |
| `completed` | BOOLEAN | NOT NULL, DEFAULT FALSE | Completion status |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Creation timestamp |

### SQLModel Definition (Backend)

```python
from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional

class Todo(SQLModel, table=True):
    """Todo entity for database persistence."""
    __tablename__ = "todos"

    id: Optional[int] = Field(default=None, primary_key=True)
    title: str = Field(max_length=200, min_length=1)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
```

### TypeScript Definition (Frontend)

```typescript
// types/todo.ts
export interface Todo {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  created_at: string; // ISO 8601 format
}

export interface TodoCreate {
  title: string;
  description?: string;
}

export interface TodoUpdate {
  title?: string;
  description?: string;
  completed?: boolean;
}
```

---

## Validation Rules

### Title
- **Required**: Must not be empty
- **Length**: 1-200 characters
- **Whitespace**: Leading/trailing whitespace should be trimmed
- **Empty Check**: Cannot be only whitespace

### Description
- **Optional**: Can be null or omitted
- **Length**: Maximum 1000 characters when provided

### Completed
- **Default**: False when created
- **Toggle**: Can be flipped between true/false

### Created At
- **Auto-generated**: Set to current UTC timestamp on creation
- **Immutable**: Cannot be modified after creation

---

## State Transitions

```
┌─────────────┐
│   CREATE    │
│  (new todo) │
└──────┬──────┘
       │
       ▼
┌─────────────┐     ┌─────────────┐
│  INCOMPLETE │◄───►│  COMPLETED  │
│ completed=F │     │ completed=T │
└──────┬──────┘     └──────┬──────┘
       │                   │
       ▼                   ▼
┌─────────────────────────────┐
│           DELETE            │
│    (removes from system)    │
└─────────────────────────────┘
```

### Allowed Transitions
- **Create → Incomplete**: Default state for new todos
- **Incomplete ↔ Completed**: Toggle via update
- **Any State → Delete**: Remove todo permanently

---

## Database Considerations

### Indexing Strategy
- **Primary Key**: `id` (auto-indexed)
- **Optional**: Index on `created_at` for sorted retrieval (newest first)

### PostgreSQL DDL

```sql
CREATE TABLE IF NOT EXISTS todos (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL CHECK (char_length(title) >= 1),
    description VARCHAR(1000),
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Optional: Index for sorting by creation date
CREATE INDEX IF NOT EXISTS idx_todos_created_at ON todos(created_at DESC);
```

---

## API Request/Response Models

### Create Todo Request
```json
{
  "title": "string (required, 1-200 chars)",
  "description": "string (optional, max 1000 chars)"
}
```

### Update Todo Request
```json
{
  "title": "string (optional, 1-200 chars)",
  "description": "string (optional, max 1000 chars)",
  "completed": "boolean (optional)"
}
```

### Todo Response
```json
{
  "id": 1,
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "completed": false,
  "created_at": "2026-01-14T10:30:00Z"
}
```

---

## Migration from Phase I

### Changes from In-Memory Model
| Aspect | Phase I | Phase II |
|--------|---------|----------|
| Storage | In-memory dict | PostgreSQL table |
| ID Generation | Counter increment | Database SERIAL |
| Persistence | Lost on restart | Permanent |
| Concurrency | Single instance | Connection pooling |

### Data Migration
- No data migration needed (Phase I has no persistent data)
- Fresh database schema created on first deployment

---

## Relationships

### Current Phase (II)
- **Standalone Entity**: Todo has no relationships to other entities
- **Shared Access**: All todos visible to all users (no auth)

### Future Phase (III) Considerations
- May add `user_id` foreign key for multi-user support
- May add `category_id` for todo categorization
- AI agent context may require conversation history linking
