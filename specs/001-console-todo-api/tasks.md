# Tasks: Console-Based Todo Application (FastAPI Backend)

**Input**: Design documents from `/specs/001-console-todo-api/`
**Prerequisites**: plan.md (required), spec.md (required), data-model.md, contracts/, research.md

**Tests**: Manual testing via console client. Unit tests are optional per spec.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

**NOTE**: Project is located in `backend/` directory (not repository root).

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `backend/src/`, `backend/tests/`
- Paths follow plan.md structure

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Initialize Python project with uv in backend/ directory (uv init, creates pyproject.toml)
- [x] T002 Add project dependencies with uv (fastapi, uvicorn, pydantic, httpx)
- [x] T003 [P] Add dev dependencies with uv (pytest)
- [x] T004 [P] Create backend/src/__init__.py package file
- [x] T005 [P] Create backend/src/models/__init__.py package file
- [x] T006 [P] Create backend/src/services/__init__.py package file
- [x] T007 [P] Create backend/src/routes/__init__.py package file
- [x] T008 [P] Create backend/src/cli/__init__.py package file
- [x] T009 [P] Create backend/tests/__init__.py package file
- [x] T010 [P] Create backend/tests/unit/__init__.py package file
- [x] T011 [P] Create backend/tests/integration/__init__.py package file

**Checkpoint**: ✅ Project structure created, dependencies installed, `uv sync` works

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**CRITICAL**: No user story work can begin until this phase is complete

- [x] T012 Create Pydantic models (Todo, TodoCreate, TodoUpdate, TodoResponse) in backend/src/models/todo.py
- [x] T013 Create TodoService class with in-memory storage dict and counter in backend/src/services/todo_service.py
- [x] T014 Create FastAPI app instance and configure CORS in backend/src/main.py
- [x] T015 Create APIRouter for todos with prefix /todos in backend/src/routes/todos.py
- [x] T016 Register todos router in FastAPI app in backend/src/main.py
- [x] T017 Verify FastAPI server starts with `uv run uvicorn src.main:app --reload` and /docs is accessible

**Checkpoint**: ✅ Foundation ready - FastAPI server runs, /docs shows API, service layer exists

---

## Phase 3: User Story 1 - Create and View Todos (Priority: P1)

**Goal**: Users can add new todos and view all existing todos - this is the MVP

**Independent Test**: Run console client, add 2-3 todos, verify they appear in list view

### Implementation for User Story 1

- [x] T018 [US1] Implement create() method in TodoService that auto-generates ID and timestamp in backend/src/services/todo_service.py
- [x] T019 [US1] Implement list_all() method in TodoService that returns all todos in backend/src/services/todo_service.py
- [x] T020 [US1] Implement POST /todos endpoint that calls service.create() in backend/src/routes/todos.py
- [x] T021 [US1] Implement GET /todos endpoint that calls service.list_all() in backend/src/routes/todos.py
- [x] T022 [US1] Add input validation for empty title in POST /todos (return 400) in backend/src/routes/todos.py
- [x] T023 [US1] Create CLI client base with httpx and BASE_URL constant in backend/src/cli/client.py
- [x] T024 [US1] Implement add_todo() function in CLI that prompts for title/description in backend/src/cli/client.py
- [x] T025 [US1] Implement list_todos() function in CLI that displays formatted todo list in backend/src/cli/client.py
- [x] T026 [US1] Handle empty list case with "No todos found" message in list_todos() in backend/src/cli/client.py

**Checkpoint**: ✅ User Story 1 complete - can create and list todos via CLI

---

## Phase 4: User Story 2 - Update and Complete Todos (Priority: P2)

**Goal**: Users can modify todo details and mark todos as completed

**Independent Test**: Create a todo, update its title, mark it complete, verify changes persist

### Implementation for User Story 2

- [x] T027 [US2] Implement get_by_id() method in TodoService (returns None if not found) in backend/src/services/todo_service.py
- [x] T028 [US2] Implement update() method in TodoService that applies partial updates in backend/src/services/todo_service.py
- [x] T029 [US2] Implement PUT /todos/{id} endpoint with 404 handling in backend/src/routes/todos.py
- [x] T030 [US2] Add validation for empty title in PUT (return 400 if title is empty string) in backend/src/routes/todos.py
- [x] T031 [US2] Implement update_todo() function in CLI that prompts for ID and new values in backend/src/cli/client.py
- [x] T032 [US2] Implement mark_complete() function in CLI that sets completed=true in backend/src/cli/client.py
- [x] T033 [US2] Handle 404 errors with clear "Todo not found" message in CLI in backend/src/cli/client.py

**Checkpoint**: ✅ User Story 2 complete - can update and complete todos via CLI

---

## Phase 5: User Story 3 - Delete Todos and View Details (Priority: P3)

**Goal**: Users can remove todos and view detailed information about a specific todo

**Independent Test**: Create a todo, view its details by ID, delete it, verify it's removed from list

### Implementation for User Story 3

- [x] T034 [US3] Implement delete() method in TodoService (returns False if not found) in backend/src/services/todo_service.py
- [x] T035 [US3] Implement GET /todos/{id} endpoint with 404 handling in backend/src/routes/todos.py
- [x] T036 [US3] Implement DELETE /todos/{id} endpoint with 404 handling in backend/src/routes/todos.py
- [x] T037 [US3] Implement view_todo() function in CLI that shows full todo details in backend/src/cli/client.py
- [x] T038 [US3] Implement delete_todo() function in CLI that prompts for ID in backend/src/cli/client.py
- [x] T039 [US3] Handle 404 errors for view and delete with clear messages in backend/src/cli/client.py

**Checkpoint**: ✅ User Story 3 complete - can view details and delete todos via CLI

---

## Phase 6: User Story 4 - Application Lifecycle (Priority: P4)

**Goal**: Users have a smooth menu-driven experience with proper startup and exit

**Independent Test**: Launch CLI, see welcome message and menu, select Exit, verify clean termination

### Implementation for User Story 4

- [x] T040 [US4] Implement display_menu() function showing all 7 options in backend/src/cli/client.py
- [x] T041 [US4] Implement main() function with welcome message and menu loop in backend/src/cli/client.py
- [x] T042 [US4] Implement menu option routing (1-7) to appropriate functions in backend/src/cli/client.py
- [x] T043 [US4] Implement exit option (7) with goodbye message in backend/src/cli/client.py
- [x] T044 [US4] Handle invalid menu input with error message and re-prompt in backend/src/cli/client.py
- [x] T045 [US4] Handle connection errors when API server is not running in backend/src/cli/client.py
- [x] T046 [US4] Add if __name__ == "__main__": main() entry point in backend/src/cli/client.py

**Checkpoint**: ✅ User Story 4 complete - full CLI experience with menu navigation

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Documentation and final verification

- [x] T047 [P] Create README.md with project overview, setup, and run instructions
- [x] T048 [P] Add inline code comments where logic is non-obvious in backend/src/services/todo_service.py
- [x] T049 Run full manual test: create, list, update, complete, view, delete, exit
- [x] T050 Verify all acceptance scenarios from spec.md pass
- [x] T051 [P] Run quickstart.md validation (follow steps on clean environment)

---

## Implementation Status

**Completed**: 51/51 tasks (100%)
**Status**: All tasks completed and verified

### How to Test

1. Start the API server:
   ```bash
   cd backend
   uv run uvicorn src.main:app --reload
   ```

2. In a new terminal, run the CLI client:
   ```bash
   cd backend
   uv run python -m src.cli.client
   ```

3. Test all menu options (1-7)

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- All file paths are relative to `backend/` directory
