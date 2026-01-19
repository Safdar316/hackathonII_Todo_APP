# Implementation Plan: Todo Phase II - Organization & Intelligence

**Branch**: `002-todo-phase-ii` | **Date**: 2026-01-16 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-todo-phase-ii/spec.md`

## Summary

Phase II extends the existing Full-Stack Todo Application with advanced organizational and usability features. The implementation adds priority management, tags/categories, search functionality, filtering, sorting, recurring tasks, and browser-based reminders. All features build on the existing FastAPI + Next.js architecture while maintaining backward compatibility with existing todos.

**Key Technical Decisions** (from [research.md](./research.md)):
- Normalized tag storage (Tag + TodoTag junction tables) for query efficiency
- Simple recurrence enum (daily/weekly/monthly) with dateutil for date calculation
- react-datepicker for frontend date/time selection
- PostgreSQL ILIKE for case-insensitive search
- Frontend setTimeout + Browser Notification API for reminders
- Alembic for database migrations

## Technical Context

**Language/Version**: Python 3.13 (Backend), TypeScript 5.x (Frontend)
**Primary Dependencies**: FastAPI, SQLModel, Next.js 16, Tailwind CSS v4, Framer Motion
**Storage**: PostgreSQL (Neon DB) via SQLModel ORM
**Testing**: pytest (backend), manual testing (frontend - no automated tests in Phase I)
**Target Platform**: Web browser (modern Chrome, Firefox, Safari, Edge)
**Project Type**: Web application (frontend + backend)
**Performance Goals**: <1s filter/sort operations, <500ms tag suggestions, <5s search results
**Constraints**: No authentication, browser notifications only when tab open, single timezone (browser)
**Scale/Scope**: Hundreds of todos per user, ~10 components to modify/add

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Pre-Design Check (PASSED)

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Correctness | ✅ | Spec includes acceptance criteria for all features |
| II. Clarity | ✅ | API contracts documented in OpenAPI format |
| III. Reproducibility | ✅ | Migration strategy defined, env templates exist |
| IV. Modularity | ✅ | Service layer separation maintained |
| V. AI-Native Design | ✅ | Domain logic structured for Phase III AI integration |
| VI. Security-First | ✅ | Input validation at API level, no auth in scope |

### Post-Design Check (PASSED)

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Correctness | ✅ | Data model includes validation rules, API contracts defined |
| II. Clarity | ✅ | OpenAPI spec, data model doc, quickstart guide created |
| III. Reproducibility | ✅ | Alembic migrations versioned, dependencies explicit |
| IV. Modularity | ✅ | Tag service separate, recurring logic in service layer |
| V. AI-Native Design | ✅ | Clean entity boundaries, structured for tool calls |
| VI. Security-First | ✅ | Tag names sanitized, SQL injection prevented via ORM |

## Project Structure

### Documentation (this feature)

```text
specs/002-todo-phase-ii/
├── plan.md              # This file
├── research.md          # Technical decisions and rationale
├── data-model.md        # Entity definitions and migrations
├── quickstart.md        # Step-by-step implementation guide
├── contracts/
│   └── openapi.yaml     # API specification
├── checklists/
│   └── requirements.md  # Spec quality validation
└── tasks.md             # [To be created via /sp.tasks]
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── main.py              # FastAPI app entry (add tags router)
│   ├── database.py          # DB connection (unchanged)
│   ├── models/
│   │   ├── __init__.py
│   │   └── todo.py          # Extended: Priority, RecurrenceRule enums; Tag, TodoTag models
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── todos.py         # Extended: query params for filter/sort, complete endpoint
│   │   └── tags.py          # NEW: tag listing, autocomplete
│   └── services/
│       ├── __init__.py
│       ├── todo_service.py  # Extended: filtered queries, recurrence logic
│       └── tag_service.py   # NEW: get_or_create, autocomplete
├── migrations/              # NEW: Alembic migrations directory
│   ├── env.py
│   ├── versions/
│   │   ├── 001_add_phase2_columns.py
│   │   └── 002_create_tag_tables.py
│   └── alembic.ini
├── tests/
│   ├── unit/
│   │   └── test_todo_service.py   # NEW: recurrence, filter tests
│   └── integration/
│       └── test_todos_api.py      # NEW: API endpoint tests
└── pyproject.toml           # Add: alembic, python-dateutil

frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx       # Unchanged
│   │   ├── page.tsx         # Updated: FilterPanel integration
│   │   └── globals.css      # Updated: priority colors, tag styles
│   ├── components/
│   │   ├── TodoForm.tsx     # Extended: priority, due date, tags, recurrence, reminder
│   │   ├── TodoList.tsx     # Extended: filter/sort state, reminder scheduling
│   │   ├── TodoItem.tsx     # Extended: priority badge, tags display, overdue indicator
│   │   ├── EditTodoModal.tsx # Extended: all new fields
│   │   ├── FilterPanel.tsx  # NEW: search, filters, sort controls
│   │   ├── PrioritySelector.tsx  # NEW: priority button group
│   │   ├── TagInput.tsx     # NEW: tag chips with autocomplete
│   │   ├── DateTimePicker.tsx    # NEW: wrapper for react-datepicker
│   │   ├── RecurrenceSelector.tsx # NEW: recurrence rule dropdown
│   │   └── [...existing]
│   ├── lib/
│   │   ├── api.ts           # Extended: query params, new endpoints
│   │   └── notifications.ts # NEW: reminder scheduling service
│   ├── types/
│   │   └── todo.ts          # Extended: Priority, RecurrenceRule, Tag types
│   └── hooks/
│       └── useReminders.ts  # NEW: reminder scheduling hook
├── package.json             # Add: react-datepicker
└── tests/                   # [Optional: add component tests]
```

**Structure Decision**: Web application structure maintained from Phase I. Backend follows existing pattern (models → services → routes). Frontend extends existing component architecture with new filter panel and form controls.

## Implementation Phases

### Phase 1: Backend Foundation (Data Model & Core API)

1. **Database Schema Extension**
   - Add Alembic for migrations
   - Create migration for Phase II columns (priority, due_date, recurrence_rule, reminder_time)
   - Create migration for Tag and TodoTag tables
   - Add database indexes for query performance

2. **Model Updates**
   - Add Priority and RecurrenceRule enums
   - Add Tag and TodoTag SQLModel classes
   - Extend Todo model with new fields and relationships
   - Create extended request/response schemas

3. **Service Layer**
   - Create tag_service.py for tag operations
   - Extend todo_service.py with filtered queries
   - Implement recurrence logic (next due date calculation)
   - Add validation for recurrence (requires due_date)

4. **API Routes**
   - Add query parameters to GET /todos
   - Create POST /todos/{id}/complete endpoint
   - Create GET /tags endpoint
   - Create GET /todos/reminders endpoint

### Phase 2: Frontend Foundation (Types & API Client)

1. **Type Definitions**
   - Add Priority, RecurrenceRule, Tag types
   - Extend Todo, TodoCreate, TodoUpdate interfaces
   - Add filter/sort parameter types

2. **API Client Updates**
   - Extend fetchTodos with query parameters
   - Add completeTodo function
   - Add fetchTags function
   - Add fetchPendingReminders function

### Phase 3: Frontend UI - Form Controls

1. **New Components**
   - PrioritySelector (button group)
   - TagInput (chips with autocomplete)
   - DateTimePicker (react-datepicker wrapper)
   - RecurrenceSelector (dropdown)

2. **Form Updates**
   - TodoForm: integrate all new controls
   - EditTodoModal: integrate all new controls
   - Validation: recurrence requires due_date

### Phase 4: Frontend UI - Display & Filtering

1. **Todo Display**
   - TodoItem: priority badge, tags, overdue indicator
   - Visual styling for priority levels (Tailwind)
   - Overdue state (red indicator, text styling)

2. **FilterPanel Component**
   - Search input (debounced)
   - Status filter (all/pending/completed)
   - Priority filter (multi-select)
   - Tag filter (multi-select)
   - Date range filter
   - Sort controls (field + direction)
   - Active filter indicators

3. **TodoList Integration**
   - Filter state management
   - Query parameter construction
   - UI state synchronization

### Phase 5: Advanced Features

1. **Recurring Tasks**
   - Complete endpoint integration
   - UI feedback for new instance creation
   - Recurrence indicator display

2. **Reminder Notifications**
   - notifications.ts service
   - useReminders hook
   - Permission request flow
   - Notification scheduling on load/create/update

### Phase 6: Polish & Testing

1. **Animations**
   - Filter/sort transitions
   - Priority badge animations
   - Tag chip animations
   - Enhanced todo enter/exit

2. **Testing**
   - Backend unit tests (recurrence logic, filtering)
   - Backend API tests (new endpoints)
   - Manual testing checklist

## Risk Analysis

| Risk | Impact | Mitigation |
|------|--------|------------|
| Migration fails on production data | High | Test on database copy first, create rollback migration |
| Notification permissions denied | Medium | Graceful degradation, show warning when setting reminder |
| Tag autocomplete slow with many tags | Low | Index on tag name, limit suggestions to 10 |
| Complex filter combinations slow | Medium | Database indexes, consider pagination if needed |

## Dependencies (New)

### Backend
```
python-dateutil>=2.9.0  # relativedelta for monthly recurrence
alembic>=1.13.0         # Database migrations
```

### Frontend
```
react-datepicker@^7.0.0    # Date/time picker
@types/react-datepicker    # TypeScript types
```

## Next Steps

Run `/sp.tasks` to generate atomic implementation tasks from this plan.

## Artifacts Generated

- [research.md](./research.md) - Technical research and decisions
- [data-model.md](./data-model.md) - Entity definitions and migrations
- [quickstart.md](./quickstart.md) - Implementation guide
- [contracts/openapi.yaml](./contracts/openapi.yaml) - API specification
