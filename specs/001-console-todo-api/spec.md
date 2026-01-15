# Feature Specification: Console-Based Todo Application (FastAPI Backend)

**Feature Branch**: `001-console-todo-api`
**Created**: 2026-01-13
**Status**: Draft
**Input**: User description: "Console-driven Todo application backed by a FastAPI server with CLI-to-API interaction"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create and View Todos (Priority: P1)

As a user, I want to create new todos and view all my todos so that I can track tasks I need to complete.

**Why this priority**: Core functionality - without the ability to create and view todos, the application has no value. This is the minimum viable product.

**Independent Test**: Can be fully tested by running the console client, adding 2-3 todos, and verifying they appear in the list view. Delivers immediate value of task tracking.

**Acceptance Scenarios**:

1. **Given** the application is running, **When** I select "Add todo" and enter a title "Buy groceries", **Then** I receive confirmation that the todo was created with an assigned ID
2. **Given** I have created one or more todos, **When** I select "View all todos", **Then** I see a formatted list showing ID, title, completion status, and creation date for each todo
3. **Given** no todos exist, **When** I select "View all todos", **Then** I see a message indicating the list is empty

---

### User Story 2 - Update and Complete Todos (Priority: P2)

As a user, I want to update todo details and mark todos as completed so that I can track progress and correct mistakes.

**Why this priority**: Essential for maintaining accurate task lists - users need to fix typos and mark tasks done. Depends on P1 existing first.

**Independent Test**: Can be tested by creating a todo, updating its title, then marking it complete. Verifies the full lifecycle of a todo item.

**Acceptance Scenarios**:

1. **Given** a todo with ID 1 exists with title "Buy groceries", **When** I select "Update todo", enter ID 1, and change title to "Buy organic groceries", **Then** the todo title is updated and I receive confirmation
2. **Given** a todo with ID 1 exists and is not completed, **When** I select "Mark todo as completed" and enter ID 1, **Then** the todo's completed status changes to true and I receive confirmation
3. **Given** I try to update a todo with ID 999 that does not exist, **When** I submit the update, **Then** I see a clear error message indicating the todo was not found

---

### User Story 3 - Delete Todos and View Details (Priority: P3)

As a user, I want to delete todos I no longer need and view detailed information about a specific todo so that I can manage my task list efficiently.

**Why this priority**: Cleanup and detail view are secondary to creation and completion. Users can function without these initially.

**Independent Test**: Can be tested by creating a todo, viewing its details by ID, then deleting it and verifying it no longer appears.

**Acceptance Scenarios**:

1. **Given** a todo with ID 1 exists, **When** I select "View todo by ID" and enter 1, **Then** I see the complete details including ID, title, description, completed status, and creation timestamp
2. **Given** a todo with ID 1 exists, **When** I select "Delete todo" and enter ID 1, **Then** the todo is removed and I receive confirmation
3. **Given** I try to delete a todo with ID 999 that does not exist, **When** I submit the delete request, **Then** I see a clear error message indicating the todo was not found
4. **Given** a todo was deleted, **When** I view all todos, **Then** the deleted todo no longer appears in the list

---

### User Story 4 - Application Lifecycle (Priority: P4)

As a user, I want to start the application, navigate the menu, and exit cleanly so that I have a smooth user experience.

**Why this priority**: Infrastructure story - the menu and exit are necessary but not the core value proposition.

**Independent Test**: Can be tested by launching the console client, viewing the menu, selecting "Exit", and verifying the application terminates cleanly.

**Acceptance Scenarios**:

1. **Given** I launch the console client, **When** the application starts, **Then** I see a welcome message and the main menu with all 7 options
2. **Given** I am viewing the main menu, **When** I select "Exit", **Then** the application terminates gracefully with a goodbye message
3. **Given** I am at any point in the application, **When** I enter an invalid menu option, **Then** I see an error message and am returned to the menu

---

### Edge Cases

- What happens when the user enters a non-numeric value for todo ID? System displays a validation error and prompts for valid input.
- What happens when the user enters an empty title when creating a todo? System displays a validation error indicating title is required.
- What happens when the API server is not running? Console client displays a connection error and prompts user to ensure server is running.
- What happens when the user creates a todo with only a title (no description)? Todo is created successfully with description as empty/null.
- What happens when maximum integer ID is reached? IDs are auto-incremented; practical limit is system integer max (implementation handles overflow gracefully).

## Requirements *(mandatory)*

### Functional Requirements

**API Requirements:**

- **FR-001**: System MUST provide a POST /todos endpoint that creates a new todo with auto-generated ID and timestamp
- **FR-002**: System MUST provide a GET /todos endpoint that returns all todos in the system
- **FR-003**: System MUST provide a GET /todos/{id} endpoint that returns a single todo by its ID
- **FR-004**: System MUST provide a PUT /todos/{id} endpoint that updates title, description, or completion status
- **FR-005**: System MUST provide a DELETE /todos/{id} endpoint that removes a todo from the system
- **FR-006**: System MUST return HTTP 400 for invalid input with human-readable error message
- **FR-007**: System MUST return HTTP 404 when a requested todo ID does not exist
- **FR-008**: System MUST validate that title is non-empty when creating or updating a todo

**Console Client Requirements:**

- **FR-009**: Console client MUST display a numbered menu with all 7 options (Add, View all, View by ID, Update, Mark complete, Delete, Exit)
- **FR-010**: Console client MUST prompt user for required input (title, ID) with clear instructions
- **FR-011**: Console client MUST display API responses in human-readable format
- **FR-012**: Console client MUST handle API errors gracefully and display meaningful messages
- **FR-013**: Console client MUST allow users to optionally provide a description when creating a todo

**Data Requirements:**

- **FR-014**: System MUST store todos in memory (data does not persist after server restart)
- **FR-015**: System MUST auto-generate unique sequential integer IDs for new todos
- **FR-016**: System MUST auto-generate creation timestamp when a todo is created

### Key Entities

- **Todo**: Represents a task to be completed. Contains:
  - ID: Unique identifier for the todo (auto-generated integer)
  - Title: Short description of the task (required, non-empty string)
  - Description: Longer explanation of the task (optional string)
  - Completed: Whether the task is done (boolean, defaults to false)
  - Created At: When the todo was created (timestamp, auto-generated)

## Clarifications

### Session 2026-01-13

- Q: What package manager should be used for Python project initialization? → A: uv
- Q: Which HTTP client library should the console client use? → A: httpx

## Assumptions

- The API server and console client will run on the same machine (localhost)
- The default API port is 8000 (standard FastAPI default)
- Session/authentication is not required for this phase
- Data persistence is not required - in-memory storage is acceptable
- The console client will use synchronous HTTP requests (blocking is acceptable for CLI)
- UTF-8 encoding is used for all text input/output
- Python project MUST be initialized using `uv` package manager (not pip or poetry)
- Console client MUST use `httpx` library for HTTP requests to the API

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can complete the full todo lifecycle (create, view, update, complete, delete) within a single session
- **SC-002**: All 7 menu options function correctly and return to the menu after completion
- **SC-003**: Invalid inputs (empty title, non-existent ID) produce clear error messages within 1 second
- **SC-004**: API responses return immediately for typical usage (no perceptible delay)
- **SC-005**: All CRUD operations on the API return appropriate status codes (200, 201, 400, 404)
- **SC-006**: The application can be set up and run by following the README instructions without additional support
- **SC-007**: 100% of acceptance scenarios pass when tested manually through the console client
