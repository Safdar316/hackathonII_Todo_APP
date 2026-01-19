# Quickstart: Todo Phase II Implementation

**Branch**: `002-todo-phase-ii` | **Date**: 2026-01-16

This guide provides step-by-step instructions for implementing Phase II features on top of the existing Phase I application.

---

## Prerequisites

Ensure Phase I is working:

```bash
# Backend
cd backend
uv sync
uv run uvicorn src.main:app --reload

# Frontend (separate terminal)
cd frontend
npm install
npm run dev
```

Verify at:
- Backend: http://localhost:8000/docs
- Frontend: http://localhost:3000

---

## Implementation Order

Follow this sequence for smooth development:

1. **Database Schema Extension** (Backend)
2. **Model Updates** (Backend)
3. **Service Layer Updates** (Backend)
4. **API Route Updates** (Backend)
5. **Frontend Type Updates**
6. **Form Components** (Frontend)
7. **Search/Filter/Sort UI** (Frontend)
8. **Animations Polish** (Frontend)
9. **Reminder Notifications** (Frontend)

---

## Step 1: Database Schema Extension

### Install Alembic

```bash
cd backend
uv add alembic python-dateutil
```

### Initialize Alembic

```bash
uv run alembic init migrations
```

### Configure Alembic

Edit `alembic.ini`:
```ini
sqlalchemy.url = %(DATABASE_URL)s
```

Edit `migrations/env.py`:
```python
from src.database import engine
from src.models.todo import Todo, Tag, TodoTag

target_metadata = SQLModel.metadata

def run_migrations_online():
    connectable = engine
    # ... rest of configuration
```

### Create Migration 1: Add Phase II Columns

```bash
uv run alembic revision -m "add_phase2_columns"
```

Edit the generated file:
```python
def upgrade():
    op.add_column('todo', sa.Column('priority', sa.String(10), nullable=False, server_default='medium'))
    op.add_column('todo', sa.Column('due_date', sa.DateTime(timezone=True), nullable=True))
    op.add_column('todo', sa.Column('recurrence_rule', sa.String(10), nullable=True))
    op.add_column('todo', sa.Column('reminder_time', sa.DateTime(timezone=True), nullable=True))
    op.create_index('idx_todo_priority', 'todo', ['priority'])
    op.create_index('idx_todo_due_date', 'todo', ['due_date'])
```

### Create Migration 2: Add Tag Tables

```bash
uv run alembic revision -m "create_tag_tables"
```

```python
def upgrade():
    op.create_table('tag',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('name', sa.String(50), nullable=False, unique=True)
    )
    op.create_table('todo_tag',
        sa.Column('todo_id', sa.Integer, sa.ForeignKey('todo.id', ondelete='CASCADE'), primary_key=True),
        sa.Column('tag_id', sa.Integer, sa.ForeignKey('tag.id', ondelete='CASCADE'), primary_key=True)
    )
```

### Run Migrations

```bash
uv run alembic upgrade head
```

---

## Step 2: Model Updates

### Update `backend/src/models/todo.py`

Add enums and extended fields:

```python
from enum import Enum
from typing import Optional
from datetime import datetime
from sqlmodel import SQLModel, Field, Relationship

class Priority(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"

class RecurrenceRule(str, Enum):
    DAILY = "daily"
    WEEKLY = "weekly"
    MONTHLY = "monthly"

class Tag(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(max_length=50, unique=True, index=True)
    todos: list["Todo"] = Relationship(back_populates="tags", link_model="TodoTag")

class TodoTag(SQLModel, table=True):
    todo_id: int = Field(foreign_key="todo.id", primary_key=True)
    tag_id: int = Field(foreign_key="tag.id", primary_key=True)

class Todo(SQLModel, table=True):
    # ... existing fields ...
    priority: Priority = Field(default=Priority.MEDIUM)
    due_date: Optional[datetime] = Field(default=None)
    recurrence_rule: Optional[RecurrenceRule] = Field(default=None)
    reminder_time: Optional[datetime] = Field(default=None)
    tags: list[Tag] = Relationship(back_populates="todos", link_model=TodoTag)
```

---

## Step 3: Service Layer Updates

### Create `backend/src/services/tag_service.py`

```python
from sqlmodel import Session, select
from src.models.todo import Tag

def get_or_create_tags(session: Session, tag_names: list[str]) -> list[Tag]:
    tags = []
    for name in tag_names:
        name = name.strip().lower()
        tag = session.exec(select(Tag).where(Tag.name == name)).first()
        if not tag:
            tag = Tag(name=name)
            session.add(tag)
            session.flush()
        tags.append(tag)
    return tags

def get_tags_by_prefix(session: Session, prefix: str, limit: int = 10) -> list[Tag]:
    return session.exec(
        select(Tag).where(Tag.name.ilike(f"{prefix}%")).limit(limit)
    ).all()
```

### Update `backend/src/services/todo_service.py`

Add filtering, sorting, and recurrence logic:

```python
from datetime import timedelta
from dateutil.relativedelta import relativedelta

def get_todos_filtered(
    session: Session,
    search: Optional[str] = None,
    completed: Optional[bool] = None,
    priority: Optional[Priority] = None,
    tags: Optional[list[str]] = None,
    due_from: Optional[datetime] = None,
    due_to: Optional[datetime] = None,
    sort_by: str = "created_at",
    sort_order: str = "desc"
) -> list[Todo]:
    query = select(Todo)

    if search:
        query = query.where(
            or_(Todo.title.ilike(f"%{search}%"), Todo.description.ilike(f"%{search}%"))
        )
    # ... add other filters ...

    return session.exec(query).all()

def complete_recurring_todo(session: Session, todo: Todo) -> Optional[Todo]:
    if not todo.recurrence_rule or not todo.due_date:
        return None

    next_due = calculate_next_due_date(todo.due_date, todo.recurrence_rule)
    new_todo = Todo(
        title=todo.title,
        description=todo.description,
        priority=todo.priority,
        due_date=next_due,
        recurrence_rule=todo.recurrence_rule,
        reminder_time=calculate_reminder_offset(todo, next_due) if todo.reminder_time else None,
        tags=todo.tags
    )
    session.add(new_todo)
    return new_todo
```

---

## Step 4: API Route Updates

### Update `backend/src/routes/todos.py`

Add query parameters and new endpoints:

```python
@router.get("/todos", response_model=list[TodoResponse])
async def list_todos(
    session: Session = Depends(get_session),
    search: Optional[str] = None,
    completed: Optional[bool] = None,
    priority: Optional[Priority] = None,
    tags: Optional[str] = None,  # comma-separated
    due_from: Optional[datetime] = None,
    due_to: Optional[datetime] = None,
    sort_by: str = "created_at",
    sort_order: str = "desc"
):
    tag_list = tags.split(",") if tags else None
    return todo_service.get_todos_filtered(
        session, search, completed, priority, tag_list, due_from, due_to, sort_by, sort_order
    )

@router.post("/todos/{todo_id}/complete")
async def complete_todo(todo_id: int, session: Session = Depends(get_session)):
    todo = todo_service.get_todo_by_id(session, todo_id)
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")

    todo.completed = True
    next_instance = todo_service.complete_recurring_todo(session, todo)
    session.commit()

    return {
        "completed_todo": todo,
        "next_instance": next_instance
    }
```

### Create `backend/src/routes/tags.py`

```python
from fastapi import APIRouter, Depends
from sqlmodel import Session
from src.database import get_session
from src.services import tag_service

router = APIRouter(prefix="/tags", tags=["tags"])

@router.get("/", response_model=list[TagResponse])
async def list_tags(
    session: Session = Depends(get_session),
    search: Optional[str] = None,
    limit: int = 10
):
    if search:
        return tag_service.get_tags_by_prefix(session, search, limit)
    return tag_service.get_all_tags(session, limit)
```

---

## Step 5: Frontend Type Updates

### Update `frontend/src/types/todo.ts`

```typescript
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
  created_at: string;
  priority: Priority;
  due_date: string | null;
  recurrence_rule: RecurrenceRule | null;
  reminder_time: string | null;
  tags: Tag[];
  is_overdue: boolean;
}
```

---

## Step 6: Frontend Components

### Install Dependencies

```bash
cd frontend
npm install react-datepicker
npm install -D @types/react-datepicker
```

### Create Priority Selector Component

```tsx
// frontend/src/components/PrioritySelector.tsx
interface PrioritySelectorProps {
  value: Priority;
  onChange: (priority: Priority) => void;
}

export function PrioritySelector({ value, onChange }: PrioritySelectorProps) {
  return (
    <div className="flex gap-2">
      {(['low', 'medium', 'high'] as Priority[]).map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`px-3 py-1 rounded-full ${
            value === p ? getPriorityColor(p) : 'bg-gray-200'
          }`}
        >
          {p}
        </button>
      ))}
    </div>
  );
}
```

### Create Tag Input Component

```tsx
// frontend/src/components/TagInput.tsx
export function TagInput({ tags, onChange }: TagInputProps) {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Debounced fetch suggestions
  // Add/remove tag handlers
  // Render tag chips
}
```

---

## Step 7: Search/Filter/Sort UI

### Create Filter Panel Component

```tsx
// frontend/src/components/FilterPanel.tsx
export function FilterPanel({ filters, onFilterChange }: FilterPanelProps) {
  return (
    <div className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-lg">
      <SearchInput value={filters.search} onChange={...} />
      <StatusFilter value={filters.completed} onChange={...} />
      <PriorityFilter value={filters.priority} onChange={...} />
      <TagFilter value={filters.tags} onChange={...} />
      <DateRangeFilter from={filters.due_from} to={filters.due_to} onChange={...} />
      <SortSelect sortBy={filters.sort_by} sortOrder={filters.sort_order} onChange={...} />
      {hasActiveFilters && <ClearFiltersButton onClick={...} />}
    </div>
  );
}
```

---

## Step 8: Reminder Notifications

### Create Reminder Service

```typescript
// frontend/src/lib/notifications.ts
export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false;
  const result = await Notification.requestPermission();
  return result === 'granted';
}

export function scheduleReminder(todo: Todo): number | null {
  if (!todo.reminder_time || Notification.permission !== 'granted') return null;

  const reminderTime = new Date(todo.reminder_time).getTime();
  const delay = reminderTime - Date.now();

  if (delay <= 0) return null;

  return window.setTimeout(() => {
    new Notification(`Reminder: ${todo.title}`, {
      body: todo.description || 'Task due soon',
      icon: '/icon.png'
    });
  }, delay);
}
```

---

## Testing

### Backend Tests

```bash
cd backend
uv run pytest tests/
```

### Frontend Tests

```bash
cd frontend
npm test
```

### Manual Testing Checklist

- [ ] Create todo with all new fields
- [ ] Update priority and verify visual indicator
- [ ] Add/remove tags and filter by tag
- [ ] Search by title and description
- [ ] Apply multiple filters simultaneously
- [ ] Sort by due date, priority, title
- [ ] Complete recurring todo and verify new instance
- [ ] Set reminder and verify notification

---

## Troubleshooting

### Migration Fails

```bash
# Check current state
uv run alembic current

# Stamp to specific revision if needed
uv run alembic stamp <revision>

# Generate new migration
uv run alembic revision --autogenerate -m "fix_schema"
```

### Notification Permission Issues

Check browser settings and ensure site is served over HTTPS in production.

### Tag Autocomplete Slow

Add index: `CREATE INDEX idx_tag_name_pattern ON tag(name varchar_pattern_ops);`
