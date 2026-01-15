# Tasks: Full-Stack Todo Web Application (Phase II)

**Input**: Design documents from `/specs/001-fullstack-todo-webapp/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/openapi.yaml

**Tests**: Manual testing only for Phase II (no automated test tasks)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Backend**: `backend/src/` (existing FastAPI application)
- **Frontend**: `frontend/src/` (new Next.js application)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and dependency setup

- [x] T001 [P] Add SQLModel and psycopg2-binary dependencies to backend/pyproject.toml
- [x] T002 [P] Create backend/.env.example with DATABASE_URL template
- [x] T003 Create Next.js application with TypeScript and Tailwind CSS in frontend/ directory using `npx create-next-app@latest frontend --typescript --tailwind --app --src-dir`
- [x] T004 Install Framer Motion dependency in frontend/ using `npm install framer-motion`
- [x] T005 [P] Create frontend/.env.example with NEXT_PUBLIC_API_URL template
- [x] T006 [P] Create frontend/.env.local with NEXT_PUBLIC_API_URL=http://localhost:8000

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**Backend - Database Layer**

- [x] T007 Create database connection module in backend/src/database.py with SQLModel engine, session management, and Neon PostgreSQL connection using DATABASE_URL env var
- [x] T008 Create SQLModel Todo table definition in backend/src/models/todo.py with id, title (max 200), description (max 1000), completed, created_at fields
- [x] T009 Update backend/src/main.py to initialize database tables on startup using SQLModel.metadata.create_all()
- [x] T010 Update backend/src/services/todo_service.py to use database sessions instead of in-memory storage
- [x] T011 Update backend/src/routes/todos.py to inject database session dependency and order results by created_at DESC

**Frontend - Core Setup**

- [x] T012 Create TypeScript interfaces in frontend/src/types/todo.ts for Todo, TodoCreate, TodoUpdate
- [x] T013 Create API client module in frontend/src/lib/api.ts with fetchTodos, createTodo, updateTodo, deleteTodo functions
- [x] T014 Configure custom Tailwind theme colors in frontend/tailwind.config.ts with primary blue and accent purple palette
- [x] T015 Update frontend/src/app/globals.css with base styles and Tailwind directives
- [x] T016 Create root layout in frontend/src/app/layout.tsx with metadata and global styling

**Checkpoint**: Foundation ready - backend has PostgreSQL persistence, frontend has API client and styling configured

---

## Phase 3: User Story 1 - View All Todos (Priority: P1) 🎯 MVP

**Goal**: Display all todos in an attractive list, ordered newest first, with empty state handling

**Independent Test**: Load application → verify todos display from database → refresh page → verify persistence

### Implementation for User Story 1

- [x] T017 [US1] Create TodoItem component in frontend/src/components/TodoItem.tsx displaying title, description, completed status with Tailwind styling
- [x] T018 [US1] Create TodoList component in frontend/src/components/TodoList.tsx that fetches and displays todos using the API client
- [x] T019 [US1] Create EmptyState component in frontend/src/components/EmptyState.tsx with encouraging message to create first todo
- [x] T020 [US1] Implement main page in frontend/src/app/page.tsx that renders TodoList with loading and error states
- [x] T021 [US1] Add loading spinner component in frontend/src/components/LoadingSpinner.tsx
- [x] T022 [US1] Add error display component in frontend/src/components/ErrorMessage.tsx with retry button

**Checkpoint**: User Story 1 complete - todos display from PostgreSQL, empty state shown when no todos, page refresh maintains data

---

## Phase 4: User Story 2 - Create New Todo (Priority: P1)

**Goal**: Allow users to create todos with title (required) and description (optional), with entrance animation

**Independent Test**: Enter title → click create → verify todo appears with animation → refresh → verify persistence

### Implementation for User Story 2

- [x] T023 [US2] Create TodoForm component in frontend/src/components/TodoForm.tsx with title input (required), description textarea (optional), and submit button
- [x] T024 [US2] Add form validation to TodoForm: title required, max 200 chars; description max 1000 chars
- [x] T025 [US2] Integrate TodoForm into page.tsx above TodoList
- [x] T026 [US2] Add Framer Motion entrance animation to TodoItem for new todos (fade in + slide down)
- [x] T027 [US2] Update TodoList to prepend new todos to list (optimistic update) and handle API response
- [x] T028 [US2] Add loading state to create button while API call is in progress

**Checkpoint**: User Story 2 complete - can create todos with validation, new todos animate in, persist after refresh

---

## Phase 5: User Story 3 - Mark Todo Complete/Incomplete (Priority: P1)

**Goal**: Toggle completion status with visual feedback and smooth transition animation

**Independent Test**: Click todo checkbox → verify visual change with animation → refresh → verify persistence

### Implementation for User Story 3

- [x] T029 [US3] Add checkbox/toggle control to TodoItem component for completion status
- [x] T030 [US3] Add Framer Motion transition animation for completion toggle (opacity change, strikethrough effect)
- [x] T031 [US3] Implement toggleTodo handler in TodoList that calls updateTodo API with completed status
- [x] T032 [US3] Add visual styling for completed todos: reduced opacity, strikethrough title, muted colors
- [x] T033 [US3] Handle optimistic update for toggle with rollback on API error

**Checkpoint**: User Story 3 complete - can toggle completion with animation, visual feedback clear, persists after refresh

---

## Phase 6: User Story 4 - Delete Todo (Priority: P2)

**Goal**: Delete todos immediately (no confirmation) with smooth exit animation

**Independent Test**: Click delete → verify todo disappears with animation → refresh → verify deleted

### Implementation for User Story 4

- [x] T034 [US4] Add delete button to TodoItem component with trash icon styling
- [x] T035 [US4] Wrap TodoList items in Framer Motion AnimatePresence for exit animations
- [x] T036 [US4] Add exit animation to TodoItem (fade out + slide left)
- [x] T037 [US4] Implement deleteTodo handler in TodoList that calls delete API
- [x] T038 [US4] Add loading state to delete button during API call
- [x] T039 [US4] Handle optimistic removal with rollback on API error

**Checkpoint**: User Story 4 complete - can delete todos with smooth exit animation, deletion persists

---

## Phase 7: User Story 5 - Edit Todo (Priority: P2)

**Goal**: Edit todo title and description with validation and visual feedback

**Independent Test**: Click edit → modify fields → save → verify changes display → refresh → verify persistence

### Implementation for User Story 5

- [x] T040 [US5] Create EditTodoModal component in frontend/src/components/EditTodoModal.tsx with title and description inputs
- [x] T041 [US5] Add edit button to TodoItem component
- [x] T042 [US5] Add form validation to EditTodoModal: title required (1-200 chars), description optional (max 1000 chars)
- [x] T043 [US5] Implement modal open/close state management in TodoList
- [x] T044 [US5] Implement saveEdit handler that calls updateTodo API and updates local state
- [x] T045 [US5] Add loading state to save button and close modal on success
- [x] T046 [US5] Add Framer Motion animation for modal entrance/exit

**Checkpoint**: User Story 5 complete - can edit todos with validation, changes persist after refresh

---

## Phase 8: User Story 6 - Responsive Experience (Priority: P3)

**Goal**: Application works well on mobile (320px) to desktop (1920px) screens

**Independent Test**: Resize browser → verify layout adapts → test on mobile viewport → verify touch targets

### Implementation for User Story 6

- [x] T047 [US6] Add responsive Tailwind classes to TodoList for mobile/tablet/desktop layouts
- [x] T048 [US6] Add responsive Tailwind classes to TodoItem for proper spacing and touch targets on mobile
- [x] T049 [US6] Add responsive Tailwind classes to TodoForm for mobile-friendly input sizing
- [x] T050 [US6] Add responsive Tailwind classes to EditTodoModal for mobile full-screen mode
- [x] T051 [US6] Test and adjust font sizes for readability across viewport sizes
- [x] T052 [US6] Ensure buttons have minimum 44px touch target on mobile

**Checkpoint**: User Story 6 complete - app works on all screen sizes from 320px to 1920px

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements affecting multiple user stories

- [x] T053 [P] Add page load animation to TodoList (stagger children entrance)
- [x] T054 [P] Add hover effects to TodoItem buttons for better interactivity feedback
- [x] T055 [P] Add focus styles for accessibility on all interactive elements
- [x] T056 Verify all API error states display user-friendly messages
- [ ] T057 Test full CRUD flow end-to-end and fix any issues
- [ ] T058 Verify data persistence across page refreshes for all operations
- [ ] T059 [P] Validate performance: page load <3s, create <2s, update/delete <1s
- [ ] T060 Run quickstart.md validation - verify setup instructions work on clean environment

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-8)**: All depend on Foundational phase completion
  - US1 (View) → US2 (Create) → US3 (Complete) → US4 (Delete) → US5 (Edit) → US6 (Responsive)
  - Stories build on each other but each is independently testable
- **Polish (Phase 9)**: Depends on all user stories being complete

### User Story Dependencies

| Story | Depends On | Reason |
|-------|------------|--------|
| US1 (View) | Foundational | Needs TodoList, TodoItem, API client |
| US2 (Create) | US1 | Needs TodoList to display new todo |
| US3 (Complete) | US1 | Needs TodoItem toggle functionality |
| US4 (Delete) | US1 | Needs TodoItem delete button |
| US5 (Edit) | US1 | Needs TodoItem edit functionality |
| US6 (Responsive) | US1-US5 | Needs all components to exist |

### Parallel Opportunities

**Within Setup (Phase 1)**:
- T001, T002, T005, T006 can run in parallel (different files)

**Within Foundational (Phase 2)**:
- Backend tasks (T007-T011) must be sequential
- Frontend tasks (T012-T016) can run in parallel with backend tasks
- T012, T013, T014, T015, T016 can run in parallel (different files)

**Within User Stories**:
- Most tasks within a story are sequential (build on each other)
- Different stories can be parallelized by different developers after Foundational

---

## Parallel Example: Foundational Phase

```bash
# Launch backend and frontend foundation in parallel:
# Developer A (Backend):
Task: T007 → T008 → T009 → T010 → T011

# Developer B (Frontend):
Task: T012, T013, T014, T015, T016 (all parallel)
```

---

## Implementation Strategy

### MVP First (User Stories 1-3)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: US1 - View All Todos
4. Complete Phase 4: US2 - Create New Todo
5. Complete Phase 5: US3 - Mark Complete/Incomplete
6. **STOP and VALIDATE**: Test core CRUD independently
7. Deploy/demo if ready - this is a functional MVP!

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add US1 (View) → Test → Deploy (read-only MVP)
3. Add US2 (Create) + US3 (Complete) → Test → Deploy (core functionality)
4. Add US4 (Delete) + US5 (Edit) → Test → Deploy (full CRUD)
5. Add US6 (Responsive) → Test → Deploy (polished product)
6. Polish phase → Final release

---

## Summary

| Phase | Tasks | Purpose |
|-------|-------|---------|
| 1. Setup | T001-T006 (6) | Project initialization |
| 2. Foundational | T007-T016 (10) | Database + API client |
| 3. US1 View | T017-T022 (6) | Display todos |
| 4. US2 Create | T023-T028 (6) | Create todos |
| 5. US3 Complete | T029-T033 (5) | Toggle completion |
| 6. US4 Delete | T034-T039 (6) | Delete todos |
| 7. US5 Edit | T040-T046 (7) | Edit todos |
| 8. US6 Responsive | T047-T052 (6) | Mobile support |
| 9. Polish | T053-T060 (8) | Final touches |
| **Total** | **60 tasks** | |

### Task Distribution by Story

| User Story | Task Count | Priority |
|------------|------------|----------|
| US1 - View All Todos | 6 | P1 |
| US2 - Create New Todo | 6 | P1 |
| US3 - Mark Complete | 5 | P1 |
| US4 - Delete Todo | 6 | P2 |
| US5 - Edit Todo | 7 | P2 |
| US6 - Responsive | 6 | P3 |

### MVP Scope

**Suggested MVP**: Complete through Phase 5 (US1 + US2 + US3) = 27 tasks
- Users can view, create, and complete todos
- Full persistence with PostgreSQL
- Smooth animations for add and complete

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story is independently testable after completion
- Backend already exists - focus is on database integration + new frontend
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
