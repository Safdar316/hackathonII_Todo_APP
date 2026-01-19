# Research: Todo Phase II - Organization & Intelligence

**Branch**: `002-todo-phase-ii` | **Date**: 2026-01-16 | **Spec**: [spec.md](./spec.md)

## Research Summary

This document captures technical research and decisions made during the Phase 0 planning process. All unknowns from the Technical Context have been resolved with specific recommendations.

---

## 1. Tag Storage Architecture

### Decision: Normalized Approach (Separate Tag Table + Junction Table)

### Rationale
- **Query patterns**: Phase II requires filtering by tags, suggesting existing tags for autocomplete, and potentially displaying tag frequency. Normalized tables optimize these queries.
- **Data integrity**: Avoids duplicate tag names, ensures referential integrity.
- **Scalability**: Efficient indexing possible on tag name for autocomplete queries.
- **SQLModel compatibility**: SQLModel supports relationship definitions naturally.

### Alternatives Considered

| Approach | Pros | Cons |
|----------|------|------|
| JSON Array Column | Simpler model, no joins | No referential integrity, slower tag queries, harder to get unique tags |
| Normalized Tables | Query efficient, integrity, reusable tags | Additional complexity, joins required |
| Comma-separated String | Simplest storage | Parsing overhead, no integrity, poor query performance |

### Implementation

```python
# Tag model
class Tag(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    name: str = Field(max_length=50, unique=True, index=True)

# Junction table
class TodoTag(SQLModel, table=True):
    todo_id: int = Field(foreign_key="todo.id", primary_key=True)
    tag_id: int = Field(foreign_key="tag.id", primary_key=True)
```

---

## 2. Recurrence Rule Format

### Decision: Simple Enum with String Storage

### Rationale
- **Simplicity**: Phase II scope is limited to daily/weekly/monthly - no need for RFC 5545 (iCal) complexity.
- **Readability**: Enum values are self-documenting.
- **Extensibility**: Can migrate to iCal RRULE format in Phase III if needed for AI scheduling.

### Alternatives Considered

| Approach | Pros | Cons |
|----------|------|------|
| iCal RRULE (RFC 5545) | Standard format, very flexible | Overkill for current scope, complex parsing |
| Simple Enum (daily/weekly/monthly) | Easy to implement, clear semantics | Limited flexibility |
| JSON Object | Extensible structure | Requires parsing, not queryable |

### Implementation

```python
from enum import Enum

class RecurrenceRule(str, Enum):
    DAILY = "daily"
    WEEKLY = "weekly"
    MONTHLY = "monthly"

# On Todo model
recurrence_rule: Optional[RecurrenceRule] = None
```

### Next Due Date Calculation

```python
from datetime import timedelta
from dateutil.relativedelta import relativedelta

def calculate_next_due_date(current_due: datetime, rule: RecurrenceRule) -> datetime:
    if rule == RecurrenceRule.DAILY:
        return current_due + timedelta(days=1)
    elif rule == RecurrenceRule.WEEKLY:
        return current_due + timedelta(weeks=1)
    elif rule == RecurrenceRule.MONTHLY:
        return current_due + relativedelta(months=1)
```

---

## 3. Date/Time Picker Selection

### Decision: react-datepicker (Frontend)

### Rationale
- **Mature & maintained**: 77k+ GitHub stars, active development.
- **React 19 compatible**: Latest version supports React 19.
- **Tailwind integration**: Easy to style with Tailwind CSS.
- **Time support**: Built-in time picker for reminder functionality.
- **Accessibility**: ARIA-compliant out of the box.

### Alternatives Considered

| Library | Pros | Cons |
|---------|------|------|
| Browser native `<input type="datetime-local">` | Zero dependencies | Inconsistent styling, limited customization |
| react-datepicker | Feature-rich, well-maintained, accessible | Additional dependency (~25kb) |
| @shadcn/ui date-picker | Beautiful design, Tailwind-native | Requires Radix UI setup, more complex |
| react-day-picker | Lightweight | Requires additional time picker |

### Implementation

```bash
npm install react-datepicker
npm install -D @types/react-datepicker  # TypeScript types
```

---

## 4. Animation Library Confirmation

### Decision: Framer Motion (Already Installed)

### Rationale
- **Already in use**: Phase I frontend uses Framer Motion for hero animations.
- **Performance**: Hardware-accelerated, 60fps capable.
- **AnimatePresence**: Perfect for todo list enter/exit animations.
- **Layout animations**: Smooth reordering when filtering/sorting.

### Current Usage
- Hero section floating blobs
- Element entrance animations
- TodoList item animations

### Phase II Extensions
- Filter/sort transition animations
- Todo creation/deletion animations (enhance existing)
- Priority badge animations
- Tag chip animations

---

## 5. Reminder Notification Architecture

### Decision: Frontend-Scheduled Browser Notifications

### Rationale
- **No backend polling**: Avoids server load and latency.
- **Browser Notification API**: Native, works offline when tab open.
- **Service Worker optional**: Can work without for MVP, add later for background notifications.

### Implementation Strategy

1. **Backend**: Store `reminder_time` as UTC datetime, return in API response.
2. **Frontend**: On load, schedule notifications for todos with `reminder_time > now()`.
3. **Scheduling**: Use `setTimeout` with calculated delay (or `requestIdleCallback` for efficiency).
4. **Permission**: Request on first reminder set, show fallback UI if denied.

### Alternatives Considered

| Approach | Pros | Cons |
|----------|------|------|
| Backend polling (Server-Sent Events) | Works even when tab closed | Complex, requires SSE infrastructure |
| Web Push (Service Worker) | Background notifications | Requires push server, more complex |
| Frontend setTimeout | Simple, no backend changes | Only works when tab open |

### Phase II Scope

Frontend setTimeout approach - acceptable limitation that reminders only fire when app is open. Document as known limitation.

---

## 6. Search Implementation Strategy

### Decision: Backend PostgreSQL ILIKE Queries

### Rationale
- **Case-insensitive**: PostgreSQL ILIKE provides native case-insensitive search.
- **Performance**: With proper indexing, handles hundreds of todos efficiently.
- **Simplicity**: No additional search infrastructure needed.

### Implementation

```python
# Backend query
query = select(Todo).where(
    or_(
        Todo.title.ilike(f"%{search_term}%"),
        Todo.description.ilike(f"%{search_term}%")
    )
)
```

### Frontend: Debounced Input

```typescript
// Debounce search input (300ms)
const debouncedSearch = useMemo(
  () => debounce((term: string) => fetchTodos({ search: term }), 300),
  []
);
```

### Alternatives Considered

| Approach | Pros | Cons |
|----------|------|------|
| Frontend filtering | Instant results | Doesn't scale, requires loading all data |
| PostgreSQL ILIKE | Simple, good enough | Not fuzzy, no relevance ranking |
| Full-text search (tsvector) | Better relevance | More complex setup |
| External (Meilisearch/Algolia) | Best search quality | Infrastructure overhead |

---

## 7. Filter/Sort API Design

### Decision: Query Parameters on GET /todos Endpoint

### Rationale
- **RESTful**: Standard pattern for filtered list endpoints.
- **Cacheable**: GET with query params is cacheable.
- **Composable**: Multiple filters can be combined naturally.

### Query Parameters

| Parameter | Type | Example | Description |
|-----------|------|---------|-------------|
| `search` | string | `?search=meeting` | Case-insensitive title/description search |
| `completed` | boolean | `?completed=false` | Filter by completion status |
| `priority` | enum | `?priority=high` | Filter by priority level |
| `tags` | string[] | `?tags=work,urgent` | Filter by tags (comma-separated) |
| `due_from` | datetime | `?due_from=2026-01-16` | Due date range start |
| `due_to` | datetime | `?due_to=2026-01-31` | Due date range end |
| `sort_by` | enum | `?sort_by=due_date` | Sort field (due_date, priority, title, created_at) |
| `sort_order` | enum | `?sort_order=asc` | Sort direction (asc, desc) |

### Implementation

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
    sort_by: SortField = SortField.CREATED_AT,
    sort_order: SortOrder = SortOrder.DESC,
):
    # Build query with filters
    ...
```

---

## 8. Priority Sort Order

### Decision: High → Medium → Low (Descending Numeric)

### Rationale
- **Intuitive**: High priority tasks appear first by default.
- **Numeric mapping**: high=3, medium=2, low=1 for database sorting.

### Implementation

```python
class Priority(str, Enum):
    LOW = "low"      # Sort value: 1
    MEDIUM = "medium"  # Sort value: 2
    HIGH = "high"    # Sort value: 3

# Sorting in query
if sort_by == SortField.PRIORITY:
    # Use CASE expression for custom order
    priority_order = case(
        (Todo.priority == Priority.HIGH, 3),
        (Todo.priority == Priority.MEDIUM, 2),
        (Todo.priority == Priority.LOW, 1),
        else_=0
    )
    query = query.order_by(priority_order.desc() if sort_order == SortOrder.DESC else priority_order.asc())
```

---

## 9. Timezone Handling Strategy

### Decision: UTC Storage, Browser Timezone Display

### Rationale
- **Standard practice**: Store all datetimes as UTC in database.
- **Simplicity**: No backend timezone logic needed.
- **Correctness**: Avoids daylight saving time issues.

### Implementation

- **Backend**: All datetime fields stored as UTC (current behavior).
- **Frontend**: Use JavaScript `Date` object with `toLocaleString()` for display.
- **Date picker**: Convert local selection to UTC before sending to API.

```typescript
// Frontend: Local to UTC before API
const utcDate = new Date(localDate.toISOString());

// Frontend: UTC to local for display
const localDisplay = new Date(utcDateString).toLocaleString();
```

---

## 10. Database Migration Strategy

### Decision: Alembic Migrations

### Rationale
- **SQLModel/SQLAlchemy native**: Integrates naturally.
- **Version controlled**: Migration files tracked in git.
- **Reversible**: Downgrade capability for rollbacks.
- **Production safe**: Can run migrations in production without data loss.

### Migration Plan

1. Add Alembic to project: `alembic init migrations`
2. Create migration for new columns (priority, due_date, reminder_time, recurrence_rule)
3. Create migration for Tag table and TodoTag junction table
4. Set default values for new columns (existing todos get `priority=medium`, `due_date=null`)

### Alternatives Considered

| Approach | Pros | Cons |
|----------|------|------|
| Alembic | Standard, version controlled, reversible | Additional setup |
| SQLModel create_all | Simple | No version control, can't modify existing tables |
| Raw SQL scripts | Direct control | Manual version tracking, error-prone |

---

## Summary of Technical Decisions

| Area | Decision | Key Rationale |
|------|----------|---------------|
| Tag Storage | Normalized (Tag + TodoTag tables) | Query efficiency, referential integrity |
| Recurrence Rules | Simple enum (daily/weekly/monthly) | Meets Phase II scope, easy to extend |
| Date Picker | react-datepicker | Mature, accessible, time support |
| Animations | Framer Motion (existing) | Already integrated, performant |
| Reminders | Frontend setTimeout + Browser Notifications | Simple, no backend infrastructure |
| Search | PostgreSQL ILIKE | Good enough for scale, simple |
| Filters/Sort | Query parameters on GET /todos | RESTful, composable, cacheable |
| Priority Sort | High→Medium→Low (3,2,1) | Intuitive ordering |
| Timezones | UTC storage, local display | Standard practice, DST-safe |
| Migrations | Alembic | Version controlled, reversible |

---

## Dependencies to Add

### Backend
```
python-dateutil>=2.9.0  # For relativedelta (monthly recurrence)
alembic>=1.13.0         # Database migrations
```

### Frontend
```
react-datepicker@^7.0.0    # Date/time picker
@types/react-datepicker    # TypeScript types (dev)
```

---

## Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| Reminder notifications not firing when tab closed | Document limitation, consider Service Worker in Phase III |
| Tag autocomplete slow with many tags | Index on tag name, limit suggestions to 10 |
| Complex filter combinations slow | Add database indexes on priority, due_date, completed |
| Migration fails on production data | Test migrations on copy of production data first |
