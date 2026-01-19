# Data Model: Todo Phase II - Organization & Intelligence

**Branch**: `002-todo-phase-ii` | **Date**: 2026-01-16 | **Spec**: [spec.md](./spec.md)

## Overview

This document defines the extended data model for Phase II features. The model builds on the existing Phase I Todo entity, adding priority, tags, due dates, recurrence, and reminders while maintaining backward compatibility.

---

## Entity Relationship Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                          Todo                                 │
├──────────────────────────────────────────────────────────────┤
│ id: INTEGER (PK)                                             │
│ title: VARCHAR(200) NOT NULL                                 │
│ description: VARCHAR(1000) NULL                              │
│ completed: BOOLEAN DEFAULT FALSE                             │
│ created_at: TIMESTAMP DEFAULT NOW()                          │
│ ─────────────── NEW FIELDS ───────────────                   │
│ priority: ENUM('low','medium','high') DEFAULT 'medium'       │
│ due_date: TIMESTAMP NULL                                     │
│ recurrence_rule: ENUM('daily','weekly','monthly') NULL       │
│ reminder_time: TIMESTAMP NULL                                │
└──────────────────────────────────────────────────────────────┘
                              │
                              │ Many-to-Many
                              │
┌─────────────────────────────┴─────────────────────────────────┐
│                       TodoTag (Junction)                       │
├───────────────────────────────────────────────────────────────┤
│ todo_id: INTEGER (PK, FK → Todo.id)                           │
│ tag_id: INTEGER (PK, FK → Tag.id)                             │
└───────────────────────────────────────────────────────────────┘
                              │
                              │
┌─────────────────────────────┴─────────────────────────────────┐
│                          Tag                                   │
├───────────────────────────────────────────────────────────────┤
│ id: INTEGER (PK)                                              │
│ name: VARCHAR(50) NOT NULL UNIQUE                             │
└───────────────────────────────────────────────────────────────┘
```

---

## Entity Definitions

### 1. Todo (Extended)

The core task entity, extended with Phase II fields.

#### Schema Definition

| Field | Type | Constraints | Default | Description |
|-------|------|-------------|---------|-------------|
| `id` | INTEGER | PRIMARY KEY, AUTO-INCREMENT | - | Unique identifier |
| `title` | VARCHAR(200) | NOT NULL, MIN 1 | - | Task title |
| `description` | VARCHAR(1000) | NULLABLE | NULL | Optional detailed description |
| `completed` | BOOLEAN | NOT NULL | FALSE | Completion status |
| `created_at` | TIMESTAMP | NOT NULL | NOW() (UTC) | Creation timestamp |
| `priority` | ENUM | NOT NULL | 'medium' | Priority level: low, medium, high |
| `due_date` | TIMESTAMP | NULLABLE | NULL | Optional deadline (UTC) |
| `recurrence_rule` | ENUM | NULLABLE | NULL | Repeat pattern: daily, weekly, monthly |
| `reminder_time` | TIMESTAMP | NULLABLE | NULL | When to send reminder (UTC) |

#### SQLModel Definition

```python
from datetime import datetime
from enum import Enum
from typing import Optional
from sqlmodel import SQLModel, Field, Relationship

class Priority(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"

class RecurrenceRule(str, Enum):
    DAILY = "daily"
    WEEKLY = "weekly"
    MONTHLY = "monthly"

class Todo(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str = Field(max_length=200, min_length=1)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False)
    created_at: datetime = Field(default_factory=lambda: datetime.utcnow())

    # Phase II fields
    priority: Priority = Field(default=Priority.MEDIUM)
    due_date: Optional[datetime] = Field(default=None)
    recurrence_rule: Optional[RecurrenceRule] = Field(default=None)
    reminder_time: Optional[datetime] = Field(default=None)

    # Relationship to tags
    tags: list["Tag"] = Relationship(back_populates="todos", link_model=TodoTag)
```

#### Validation Rules

1. **title**: Required, 1-200 characters, whitespace trimmed
2. **description**: Optional, max 1000 characters
3. **priority**: Must be one of: low, medium, high
4. **due_date**: If provided, must be valid datetime (past dates allowed with visual warning)
5. **recurrence_rule**: If set, `due_date` MUST also be set (enforced at service layer)
6. **reminder_time**: If set, `due_date` MUST also be set; must be before or equal to `due_date`

#### State Transitions

```
                    ┌─────────────────┐
                    │    PENDING      │
                    │ (completed=F)   │
                    └────────┬────────┘
                             │
                             │ Mark Complete
                             ▼
                    ┌─────────────────┐
                    │   COMPLETED     │
                    │ (completed=T)   │
                    └────────┬────────┘
                             │
        ┌────────────────────┴────────────────────┐
        │                                         │
        ▼                                         ▼
┌───────────────┐                        ┌───────────────┐
│  Non-Recurring │                        │   Recurring   │
│   (End State)  │                        │ (Create Next) │
└───────────────┘                        └───────────────┘
```

---

### 2. Tag

Reusable labels for categorizing todos.

#### Schema Definition

| Field | Type | Constraints | Default | Description |
|-------|------|-------------|---------|-------------|
| `id` | INTEGER | PRIMARY KEY, AUTO-INCREMENT | - | Unique identifier |
| `name` | VARCHAR(50) | NOT NULL, UNIQUE, INDEX | - | Tag display name |

#### SQLModel Definition

```python
class Tag(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(max_length=50, unique=True, index=True)

    # Relationship to todos
    todos: list["Todo"] = Relationship(back_populates="tags", link_model=TodoTag)
```

#### Validation Rules

1. **name**: Required, 1-50 characters, unique, case-preserved but case-insensitive uniqueness
2. Tag names normalized: trimmed, no leading/trailing whitespace

---

### 3. TodoTag (Junction Table)

Links todos to tags (many-to-many relationship).

#### Schema Definition

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `todo_id` | INTEGER | PK, FK → Todo.id, ON DELETE CASCADE | Reference to todo |
| `tag_id` | INTEGER | PK, FK → Tag.id, ON DELETE CASCADE | Reference to tag |

#### SQLModel Definition

```python
class TodoTag(SQLModel, table=True):
    todo_id: int = Field(foreign_key="todo.id", primary_key=True, ondelete="CASCADE")
    tag_id: int = Field(foreign_key="tag.id", primary_key=True, ondelete="CASCADE")
```

---

## API Schema Models

### Request Models

#### TodoCreate (Extended)

```python
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class TodoCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)
    priority: Priority = Field(default=Priority.MEDIUM)
    due_date: Optional[datetime] = None
    recurrence_rule: Optional[RecurrenceRule] = None
    reminder_time: Optional[datetime] = None
    tags: list[str] = Field(default_factory=list)  # Tag names
```

#### TodoUpdate (Extended)

```python
class TodoUpdate(BaseModel):
    title: Optional[str] = Field(default=None, min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: Optional[bool] = None
    priority: Optional[Priority] = None
    due_date: Optional[datetime] = None
    recurrence_rule: Optional[RecurrenceRule] = None
    reminder_time: Optional[datetime] = None
    tags: Optional[list[str]] = None  # Tag names (replaces all tags if provided)
```

### Response Models

#### TagResponse

```python
class TagResponse(BaseModel):
    id: int
    name: str

    model_config = ConfigDict(from_attributes=True)
```

#### TodoResponse (Extended)

```python
class TodoResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    completed: bool
    created_at: datetime
    priority: Priority
    due_date: Optional[datetime]
    recurrence_rule: Optional[RecurrenceRule]
    reminder_time: Optional[datetime]
    tags: list[TagResponse]
    is_overdue: bool  # Computed field

    model_config = ConfigDict(from_attributes=True)

    @computed_field
    @property
    def is_overdue(self) -> bool:
        if self.due_date and not self.completed:
            return datetime.utcnow() > self.due_date
        return False
```

---

## Database Indexes

### Required Indexes

```sql
-- Existing
CREATE INDEX idx_todo_created_at ON todo(created_at DESC);

-- New for Phase II
CREATE INDEX idx_todo_priority ON todo(priority);
CREATE INDEX idx_todo_due_date ON todo(due_date);
CREATE INDEX idx_todo_completed ON todo(completed);
CREATE INDEX idx_tag_name ON tag(name);  -- Already unique, but add for case-insensitive lookup
CREATE INDEX idx_todo_tag_todo_id ON todo_tag(todo_id);
CREATE INDEX idx_todo_tag_tag_id ON todo_tag(tag_id);
```

---

## Migration Plan

### Migration 001: Add Phase II Columns to Todo

```python
# alembic/versions/001_add_phase2_columns.py
def upgrade():
    # Add new columns with defaults for existing data
    op.add_column('todo', sa.Column('priority', sa.String(10), nullable=False, server_default='medium'))
    op.add_column('todo', sa.Column('due_date', sa.DateTime(timezone=True), nullable=True))
    op.add_column('todo', sa.Column('recurrence_rule', sa.String(10), nullable=True))
    op.add_column('todo', sa.Column('reminder_time', sa.DateTime(timezone=True), nullable=True))

    # Add indexes
    op.create_index('idx_todo_priority', 'todo', ['priority'])
    op.create_index('idx_todo_due_date', 'todo', ['due_date'])

def downgrade():
    op.drop_index('idx_todo_due_date', 'todo')
    op.drop_index('idx_todo_priority', 'todo')
    op.drop_column('todo', 'reminder_time')
    op.drop_column('todo', 'recurrence_rule')
    op.drop_column('todo', 'due_date')
    op.drop_column('todo', 'priority')
```

### Migration 002: Create Tag and TodoTag Tables

```python
# alembic/versions/002_create_tag_tables.py
def upgrade():
    # Create tag table
    op.create_table(
        'tag',
        sa.Column('id', sa.Integer, primary_key=True, autoincrement=True),
        sa.Column('name', sa.String(50), nullable=False, unique=True)
    )
    op.create_index('idx_tag_name', 'tag', ['name'])

    # Create junction table
    op.create_table(
        'todo_tag',
        sa.Column('todo_id', sa.Integer, sa.ForeignKey('todo.id', ondelete='CASCADE'), primary_key=True),
        sa.Column('tag_id', sa.Integer, sa.ForeignKey('tag.id', ondelete='CASCADE'), primary_key=True)
    )
    op.create_index('idx_todo_tag_todo_id', 'todo_tag', ['todo_id'])
    op.create_index('idx_todo_tag_tag_id', 'todo_tag', ['tag_id'])

def downgrade():
    op.drop_table('todo_tag')
    op.drop_table('tag')
```

---

## TypeScript Types (Frontend)

```typescript
// types/todo.ts

export type Priority = 'low' | 'medium' | 'high';
export type RecurrenceRule = 'daily' | 'weekly' | 'monthly';

export interface Tag {
  id: number;
  name: string;
}

export interface Todo {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  created_at: string;  // ISO 8601
  priority: Priority;
  due_date: string | null;  // ISO 8601
  recurrence_rule: RecurrenceRule | null;
  reminder_time: string | null;  // ISO 8601
  tags: Tag[];
  is_overdue: boolean;
}

export interface TodoCreate {
  title: string;
  description?: string | null;
  priority?: Priority;
  due_date?: string | null;
  recurrence_rule?: RecurrenceRule | null;
  reminder_time?: string | null;
  tags?: string[];  // Tag names
}

export interface TodoUpdate {
  title?: string;
  description?: string | null;
  completed?: boolean;
  priority?: Priority;
  due_date?: string | null;
  recurrence_rule?: RecurrenceRule | null;
  reminder_time?: string | null;
  tags?: string[];  // Tag names (replaces all)
}
```

---

## Backward Compatibility

### Existing Data Handling

1. **Existing todos** receive default values on migration:
   - `priority` = 'medium'
   - `due_date` = NULL
   - `recurrence_rule` = NULL
   - `reminder_time` = NULL
   - `tags` = [] (empty)

2. **Existing API clients** continue to work:
   - All new fields have defaults or are optional
   - Response includes new fields (non-breaking addition)
   - Create/Update requests work without new fields

### API Version Strategy

No explicit versioning needed - all changes are additive.
