# Tasks: Todo Phase II - Organization & Intelligence

**Input**: Design documents from `/specs/002-todo-phase-ii/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/openapi.yaml

**Tests**: Not explicitly requested - tests omitted per specification. Add via `/sp.tasks --with-tests` if needed.

**Organization**: Tasks grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Backend**: `backend/src/` for source, `backend/tests/` for tests
- **Frontend**: `frontend/src/` for source, `frontend/tests/` for tests
- **Migrations**: `backend/migrations/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, dependencies, and Alembic setup

- [x] T001 Add alembic and python-dateutil to backend/pyproject.toml
- [x] T002 Initialize Alembic with `alembic init migrations` in backend/
- [x] T003 Configure Alembic env.py to use DATABASE_URL from environment in backend/migrations/env.py
- [x] T004 [P] Install react-datepicker and @types/react-datepicker in frontend/package.json
- [x] T005 [P] Add Priority and RecurrenceRule enums to backend/src/models/todo.py

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Database schema and model extensions that ALL user stories depend on

**CRITICAL**: No user story work can begin until this phase is complete

- [x] T006 Create Alembic migration 001_add_phase2_columns.py for priority, due_date, recurrence_rule, reminder_time in backend/migrations/versions/
- [x] T007 Create Alembic migration 002_create_tag_tables.py for Tag and TodoTag tables in backend/migrations/versions/
- [x] T008 Run migrations with `alembic upgrade head` to apply schema changes
- [x] T009 Add Tag SQLModel class in backend/src/models/todo.py
- [x] T010 Add TodoTag junction table SQLModel class in backend/src/models/todo.py
- [x] T011 Extend Todo SQLModel with priority, due_date, recurrence_rule, reminder_time fields in backend/src/models/todo.py
- [x] T012 Add tags relationship to Todo model using Relationship() in backend/src/models/todo.py
- [x] T013 [P] Extend TodoCreate schema with priority, due_date, recurrence_rule, reminder_time, tags in backend/src/models/todo.py
- [x] T014 [P] Extend TodoUpdate schema with priority, due_date, recurrence_rule, reminder_time, tags in backend/src/models/todo.py
- [x] T015 [P] Extend TodoResponse schema with priority, due_date, recurrence_rule, reminder_time, tags, is_overdue in backend/src/models/todo.py
- [x] T016 [P] Add TagResponse schema in backend/src/models/todo.py
- [x] T017 [P] Add Priority, RecurrenceRule, Tag types in frontend/src/types/todo.ts
- [x] T018 [P] Extend Todo, TodoCreate, TodoUpdate interfaces in frontend/src/types/todo.ts
- [x] T019 Create tag_service.py with get_or_create_tags function in backend/src/services/tag_service.py
- [x] T020 Add get_tags_by_prefix function for autocomplete in backend/src/services/tag_service.py
- [x] T021 Update create_todo in todo_service.py to handle tags in backend/src/services/todo_service.py
- [x] T022 Update update_todo in todo_service.py to handle tags in backend/src/services/todo_service.py
- [x] T023 Create tags router with GET /tags endpoint in backend/src/routes/tags.py
- [x] T024 Register tags router in main.py in backend/src/main.py

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Prioritize Tasks for Better Focus (Priority: P1) - MVP

**Goal**: Users can assign, view, and change priority levels (low/medium/high) on todos with visual indicators

**Independent Test**: Create todos with different priorities, verify visual indicators display correctly, update priority and see immediate change

### Implementation for User Story 1

- [x] T025 [P] [US1] Add priority validation in create_todo service in backend/src/services/todo_service.py
- [x] T026 [P] [US1] Add priority validation in update_todo service in backend/src/services/todo_service.py
- [x] T027 [US1] Verify POST /todos accepts priority field via Swagger in backend/src/routes/todos.py
- [x] T028 [US1] Verify PUT /todos/{id} accepts priority field via Swagger in backend/src/routes/todos.py
- [x] T029 [P] [US1] Create PrioritySelector component with button group UI in frontend/src/components/PrioritySelector.tsx
- [x] T030 [P] [US1] Add priority color utilities (getPriorityColor, getPriorityBgColor) in frontend/src/components/PrioritySelector.tsx
- [x] T031 [US1] Integrate PrioritySelector into TodoForm in frontend/src/components/TodoForm.tsx
- [x] T032 [US1] Integrate PrioritySelector into EditTodoModal in frontend/src/components/EditTodoModal.tsx
- [x] T033 [US1] Add priority badge display to TodoItem component in frontend/src/components/TodoItem.tsx
- [x] T034 [US1] Add priority styles (colors for low/medium/high) - using Tailwind classes

**Checkpoint**: Priority feature complete - todos can be created/edited with priorities and display visual badges

---

## Phase 4: User Story 2 - Set Due Dates for Time Management (Priority: P1)

**Goal**: Users can set due dates on todos, see formatted dates, and identify overdue tasks visually

**Independent Test**: Add due dates to todos, verify date persistence, check overdue visual indicator for past dates

### Implementation for User Story 2

- [x] T035 [P] [US2] Add due_date validation (format check) in todo_service.py in backend/src/services/todo_service.py
- [x] T036 [P] [US2] Add is_overdue computed property to TodoResponse in backend/src/models/todo.py
- [x] T037 [US2] Verify POST/PUT endpoints accept due_date field in backend/src/routes/todos.py
- [x] T038 [P] [US2] Create DateTimePicker wrapper component for react-datepicker in frontend/src/components/DateTimePicker.tsx
- [x] T039 [US2] Integrate DateTimePicker into TodoForm in frontend/src/components/TodoForm.tsx
- [x] T040 [US2] Integrate DateTimePicker into EditTodoModal in frontend/src/components/EditTodoModal.tsx
- [x] T041 [US2] Display formatted due date in TodoItem in frontend/src/components/TodoItem.tsx
- [x] T042 [US2] Add overdue visual indicator (red styling) to TodoItem when is_overdue=true in frontend/src/components/TodoItem.tsx
- [x] T043 [US2] Add overdue styles - using Tailwind classes in TodoItem.tsx

**Checkpoint**: Due date feature complete - todos show dates and overdue status

---

## Phase 5: User Story 3 - Search Todos Quickly (Priority: P1)

**Goal**: Users can search todos by title or description with case-insensitive matching and dynamic results

**Independent Test**: Create multiple todos, search for specific terms, verify results update dynamically

### Implementation for User Story 3

- [x] T044 [US3] Add search query parameter to GET /todos endpoint in backend/src/routes/todos.py
- [x] T045 [US3] Implement ILIKE search in get_todos_filtered function in backend/src/services/todo_service.py
- [x] T046 [US3] Update fetchTodos API function to accept search parameter in frontend/src/lib/api.ts
- [x] T047 [P] [US3] Create SearchInput component with debounced input (300ms) in frontend/src/components/SearchInput.tsx
- [x] T048 [US3] Add search state management to TodoList in frontend/src/components/TodoList.tsx
- [x] T049 [US3] Integrate SearchInput into TodoList via FilterPanel in frontend/src/components/FilterPanel.tsx

**Checkpoint**: Search feature complete - users can find todos by typing search terms

---

## Phase 6: User Story 4 - Filter Todos by Status and Criteria (Priority: P2)

**Goal**: Users can filter todos by completion status, priority, and date range with combined filters

**Independent Test**: Apply various filter combinations, verify correct todos appear, confirm active filters are indicated

### Implementation for User Story 4

- [x] T050 [US4] Add completed query parameter to GET /todos in backend/src/routes/todos.py
- [x] T051 [US4] Add priority query parameter to GET /todos in backend/src/routes/todos.py
- [x] T052 [US4] Add due_from and due_to query parameters to GET /todos in backend/src/routes/todos.py
- [x] T053 [US4] Implement combined filtering logic in get_todos_filtered in backend/src/services/todo_service.py
- [x] T054 [US4] Update fetchTodos API function with filter parameters in frontend/src/lib/api.ts
- [x] T055 [P] [US4] Create StatusFilter component (all/pending/completed buttons) in frontend/src/components/FilterPanel.tsx (inline)
- [x] T056 [P] [US4] Create PriorityFilter component (multi-select for low/medium/high) in frontend/src/components/FilterPanel.tsx (inline)
- [x] T057 [P] [US4] Create DateRangeFilter component with two DateTimePickers in frontend/src/components/DateRangeFilter.tsx
- [x] T058 [US4] Create FilterPanel component combining all filters in frontend/src/components/FilterPanel.tsx
- [x] T059 [US4] Add filter state management to TodoList in frontend/src/components/TodoList.tsx
- [x] T060 [US4] Add active filter indicators to FilterPanel in frontend/src/components/FilterPanel.tsx
- [x] T061 [US4] Add clear filters button in FilterPanel in frontend/src/components/FilterPanel.tsx

**Checkpoint**: Filter feature complete - users can filter by status, priority, and date range

---

## Phase 7: User Story 5 - Sort Todos for Better Organization (Priority: P2)

**Goal**: Users can sort todos by due date, priority, or title alphabetically

**Independent Test**: Apply different sort orders, verify correct ordering for each sort type

### Implementation for User Story 5

- [x] T062 [US5] Add sort_by and sort_order query parameters to GET /todos in backend/src/routes/todos.py
- [x] T063 [US5] Implement sorting logic in get_todos_filtered with CASE for priority in backend/src/services/todo_service.py
- [x] T064 [US5] Update fetchTodos API function with sort parameters in frontend/src/lib/api.ts
- [x] T065 [P] [US5] Create SortSelector component (dropdown for field + direction) in frontend/src/components/FilterPanel.tsx (inline)
- [x] T066 [US5] Integrate SortSelector into FilterPanel in frontend/src/components/FilterPanel.tsx
- [x] T067 [US5] Add sort state management to TodoList in frontend/src/components/TodoList.tsx

**Checkpoint**: Sort feature complete - users can sort todos by various criteria

---

## Phase 8: User Story 6 - Organize Todos with Tags (Priority: P2)

**Goal**: Users can add multiple tags to todos, filter by tags, and get tag suggestions

**Independent Test**: Add tags to todos, filter by specific tag, verify autocomplete suggestions appear

### Implementation for User Story 6

- [x] T068 [US6] Add tags query parameter to GET /todos (comma-separated) in backend/src/routes/todos.py
- [x] T069 [US6] Implement tag filtering in get_todos_filtered (join with TodoTag) in backend/src/services/todo_service.py
- [x] T070 [US6] Add fetchTags API function in frontend/src/lib/api.ts
- [x] T071 [US6] Update fetchTodos API function with tags parameter in frontend/src/lib/api.ts
- [x] T072 [P] [US6] Create TagInput component with chips and autocomplete in frontend/src/components/TagInput.tsx
- [x] T073 [US6] Integrate TagInput into TodoForm in frontend/src/components/TodoForm.tsx
- [x] T074 [US6] Integrate TagInput into EditTodoModal in frontend/src/components/EditTodoModal.tsx
- [x] T075 [US6] Display tag chips in TodoItem in frontend/src/components/TodoItem.tsx
- [x] T076 [P] [US6] Create TagFilter component for FilterPanel in frontend/src/components/TagFilter.tsx
- [x] T077 [US6] Integrate TagFilter into FilterPanel in frontend/src/components/FilterPanel.tsx
- [x] T078 [US6] Add tag styles - using Tailwind classes in components

**Checkpoint**: Tags feature complete - users can tag todos and filter by tags

---

## Phase 9: User Story 7 - Create Recurring Tasks (Priority: P3)

**Goal**: Users can create recurring todos (daily/weekly/monthly) that auto-generate new instances on completion

**Independent Test**: Create recurring todo, complete it, verify new instance created with next due date

### Implementation for User Story 7

- [x] T079 [US7] Add calculate_next_due_date function using dateutil in backend/src/routes/todos.py (inline)
- [x] T080 [US7] Add complete_recurring_todo function to create next instance in backend/src/routes/todos.py
- [x] T081 [US7] Create POST /todos/{id}/complete endpoint in backend/src/routes/todos.py
- [x] T082 [US7] Add validation: recurrence_rule requires due_date in backend/src/routes/todos.py
- [x] T083 [US7] Add completeTodo API function in frontend/src/lib/api.ts
- [x] T084 [P] [US7] Create RecurrenceSelector component (dropdown for none/daily/weekly/monthly) in frontend/src/components/RecurrenceSelector.tsx
- [x] T085 [US7] Integrate RecurrenceSelector into TodoForm in frontend/src/components/TodoForm.tsx
- [x] T086 [US7] Integrate RecurrenceSelector into EditTodoModal in frontend/src/components/EditTodoModal.tsx
- [x] T087 [US7] Display recurrence indicator in TodoItem in frontend/src/components/TodoItem.tsx
- [x] T088 [US7] Update TodoList to use completeTodo API and show new instance feedback in frontend/src/components/TodoList.tsx

**Checkpoint**: Recurring feature complete - completing a recurring todo creates next instance

---

## Phase 10: User Story 8 - Receive Reminders for Important Tasks (Priority: P3)

**Goal**: Users can set reminders that trigger browser notifications at scheduled times

**Independent Test**: Set reminder time, wait for scheduled time, verify browser notification appears

### Implementation for User Story 8

- [x] T089 [US8] Add reminder_time validation (must be <= due_date) in backend/src/routes/todos.py
- [x] T090 [US8] Create GET /todos/reminders endpoint for pending reminders in backend/src/routes/todos.py
- [x] T091 [US8] Add fetchPendingReminders API function in frontend/src/lib/api.ts
- [x] T092 [P] [US8] Create notifications.ts service with requestPermission and scheduleReminder in frontend/src/lib/notifications.ts
- [x] T093 [P] [US8] Create useReminders hook for scheduling/canceling notifications in frontend/src/hooks/useReminders.ts
- [x] T094 [US8] Add reminder time picker to TodoForm (enabled when due_date set) in frontend/src/components/TodoForm.tsx
- [x] T095 [US8] Add reminder time picker to EditTodoModal in frontend/src/components/EditTodoModal.tsx
- [x] T096 [US8] Integrate useReminders hook into TodoList in frontend/src/components/TodoList.tsx
- [x] T097 [US8] Add notification permission request UI (banner in TodoList) in frontend/src/components/TodoList.tsx
- [x] T098 [US8] Display reminder time in TodoItem in frontend/src/components/TodoItem.tsx

**Checkpoint**: Reminders feature complete - users receive browser notifications at scheduled times

---

## Phase 11: Polish & Cross-Cutting Concerns

**Purpose**: Animations, UX improvements, and final validation

- [x] T099 [P] Add Framer Motion animations for todo creation/removal in frontend/src/components/TodoList.tsx
- [x] T100 [P] Add Framer Motion animations for filter/sort transitions in frontend/src/components/FilterPanel.tsx
- [x] T101 [P] Add Framer Motion animations for priority badge in frontend/src/components/TodoItem.tsx
- [x] T102 [P] Add Framer Motion animations for tag chips in frontend/src/components/TagInput.tsx
- [x] T103 [P] Add layout animation for todo reordering in frontend/src/components/TodoList.tsx
- [x] T104 Manual test: Verify all filter combinations work correctly
- [x] T105 Manual test: Verify recurring task creates new instance
- [x] T106 Manual test: Verify reminder notifications fire at correct time
- [x] T107 Manual test: Verify overdue visual indicator displays correctly
- [x] T108 Verify backward compatibility with existing todos (no data loss)
- [x] T109 Run quickstart.md validation steps

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phases 3-10)**: All depend on Foundational phase completion
  - P1 stories (US1, US2, US3) recommended first for MVP
  - P2 stories (US4, US5, US6) build on P1 but independently testable
  - P3 stories (US7, US8) require US2 (due dates) foundation
- **Polish (Phase 11)**: Depends on all desired user stories being complete

### User Story Dependencies

| Story | Depends On | Can Parallel With |
|-------|------------|-------------------|
| US1 (Priority) | Foundational | US2, US3 |
| US2 (Due Dates) | Foundational | US1, US3 |
| US3 (Search) | Foundational | US1, US2 |
| US4 (Filters) | Foundational + US1 for priority filter | US5, US6 |
| US5 (Sorting) | Foundational + US1 for priority sort | US4, US6 |
| US6 (Tags) | Foundational | US4, US5 |
| US7 (Recurring) | US2 (due_date required) | US8 |
| US8 (Reminders) | US2 (due_date required) | US7 |

### Within Each User Story

- Backend model changes before service logic
- Service logic before API routes
- API routes before frontend API client
- Frontend API client before UI components
- Core UI before integrations

### Parallel Opportunities

- All tasks marked [P] within same phase can run in parallel
- US1, US2, US3 can all run in parallel after Foundational
- US4, US5, US6 can run in parallel after their dependencies
- US7, US8 can run in parallel after US2

---

## Parallel Execution Examples

### Example 1: Foundational Phase Parallelization

```bash
# Can run in parallel (different files):
T013: Extend TodoCreate schema
T014: Extend TodoUpdate schema
T015: Extend TodoResponse schema
T016: Add TagResponse schema
T017: Add frontend types
T018: Extend frontend interfaces
```

### Example 2: User Story 1 Parallelization

```bash
# Can run in parallel:
T025: Backend priority validation (create)
T026: Backend priority validation (update)
T029: PrioritySelector component
T030: Priority color utilities
```

### Example 3: Multi-Story Parallelization (after Foundational)

```bash
# Three developers can work in parallel:
Developer A: Phase 3 (US1 - Priority)
Developer B: Phase 4 (US2 - Due Dates)
Developer C: Phase 5 (US3 - Search)
```

---

## Implementation Strategy

### MVP First (P1 Stories Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: US1 - Priority
4. Complete Phase 4: US2 - Due Dates
5. Complete Phase 5: US3 - Search
6. **STOP and VALIDATE**: Test all P1 stories independently
7. Deploy/demo if ready - this is your MVP!

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add US1 (Priority) → Test → Demo
3. Add US2 (Due Dates) → Test → Demo
4. Add US3 (Search) → Test → Demo (MVP complete!)
5. Add US4-US6 (P2 stories) → Test → Demo
6. Add US7-US8 (P3 stories) → Test → Demo
7. Polish phase → Final release

### Suggested MVP Scope

**Minimum Viable Product**: Complete Phases 1-5 (Setup, Foundational, US1, US2, US3)

This delivers:
- Priority management (create, edit, display)
- Due date management with overdue indicators
- Search functionality

---

## Task Summary

| Phase | Story | Task Count | Parallelizable |
|-------|-------|------------|----------------|
| 1 - Setup | - | 5 | 2 |
| 2 - Foundational | - | 19 | 7 |
| 3 - Priority | US1 | 10 | 4 |
| 4 - Due Dates | US2 | 9 | 2 |
| 5 - Search | US3 | 6 | 1 |
| 6 - Filters | US4 | 12 | 3 |
| 7 - Sorting | US5 | 6 | 1 |
| 8 - Tags | US6 | 11 | 2 |
| 9 - Recurring | US7 | 10 | 1 |
| 10 - Reminders | US8 | 10 | 2 |
| 11 - Polish | - | 11 | 5 |
| **Total** | | **109** | **30** |

---

## Notes

- [P] tasks = different files, no dependencies - can run simultaneously
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- Backend tasks reference `backend/src/` paths
- Frontend tasks reference `frontend/src/` paths
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
