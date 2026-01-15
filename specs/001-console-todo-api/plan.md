# Implementation Plan: Console-Based Todo Application (FastAPI Backend)

**Branch**: `001-console-todo-api` | **Date**: 2026-01-13 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-console-todo-api/spec.md`

## Summary

Build a console-driven Todo application backed by a FastAPI server. The system consists of two components: (1) a FastAPI backend providing RESTful CRUD endpoints with in-memory storage, and (2) a menu-driven console client that communicates with the API via HTTP. This phase establishes the architectural foundation for future full-stack and AI-agent extensions.

## Technical Context

**Language/Version**: Python 3.10+
**Primary Dependencies**: FastAPI, uvicorn, pydantic, httpx
**Package Manager**: uv (for project initialization and dependency management)
**Storage**: In-memory (Python dictionary)
**Testing**: pytest (optional unit tests), manual testing via console client
**Target Platform**: Local development (Windows/macOS/Linux)
**Project Type**: Single project with backend API and CLI client
**Performance Goals**: Instant response for typical CLI usage (<100ms)
**Constraints**: No external database, no authentication, in-memory only
**Scale/Scope**: Single-user local application, learning/demonstration purpose

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Evidence |
|-----------|--------|----------|
| I. Correctness | ✅ PASS | 13 acceptance scenarios defined in spec; test coverage planned |
| II. Clarity | ✅ PASS | PEP8 compliance required; README and OpenAPI docs planned |
| III. Reproducibility | ✅ PASS | uv for deps; setup instructions in quickstart.md |
| IV. Modularity | ✅ PASS | Separate models/, services/, routes/, cli/ structure |
| V. AI-Native Design | ⏸️ N/A | Phase I - no AI features yet |
| VI. Security-First | ✅ PASS | Input validation via Pydantic; no secrets needed |

**Gate Status**: PASSED - All applicable principles satisfied.

## Project Structure

### Documentation (this feature)

```text
specs/001-console-todo-api/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (OpenAPI spec)
└── tasks.md             # Phase 2 output (/sp.tasks command)
```

### Source Code (repository root)

```text
src/
├── __init__.py
├── main.py              # FastAPI application entry point
├── models/
│   ├── __init__.py
│   └── todo.py          # Pydantic models (Todo, TodoCreate, TodoUpdate)
├── services/
│   ├── __init__.py
│   └── todo_service.py  # Business logic and in-memory storage
├── routes/
│   ├── __init__.py
│   └── todos.py         # API endpoints (router)
└── cli/
    ├── __init__.py
    └── client.py        # Console client application

tests/
├── __init__.py
├── unit/
│   └── test_todo_service.py
└── integration/
    └── test_api.py

pyproject.toml           # uv project configuration
README.md                # Project documentation
```

**Structure Decision**: Single project structure selected. The backend (FastAPI) and CLI client share the same codebase under `src/`. This keeps the project simple for Phase I while allowing clear separation via the `routes/`, `services/`, and `cli/` subdirectories. The architecture supports future extraction into separate packages if needed.

## Complexity Tracking

> No violations detected. All design choices align with constitution principles.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | - | - |

## Architecture Decisions

### AD-001: In-Memory Storage with Dictionary

**Decision**: Use Python dictionary for todo storage with integer keys.

**Rationale**:
- Simplest implementation for Phase I learning objectives
- O(1) lookup by ID
- Easy to replace with database in Phase II
- No external dependencies

**Alternatives Considered**:
- List with linear search: Rejected - O(n) lookup inefficient
- SQLite: Rejected - adds complexity beyond phase scope
- Redis: Rejected - external dependency not needed

### AD-002: Service Layer Pattern

**Decision**: Implement TodoService class to encapsulate all business logic.

**Rationale**:
- Separates API layer from data management
- Enables unit testing without HTTP overhead
- Prepares for database swap in Phase II
- Aligns with constitution Modularity principle

### AD-003: Synchronous HTTP Client

**Decision**: Use httpx in synchronous mode for console client.

**Rationale**:
- CLI is inherently sequential (user input → response → next input)
- Simpler code without async/await complexity
- httpx supports both sync and async for future flexibility
- Blocking is acceptable per spec assumptions

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| ID collision after server restart | Document that IDs reset; acceptable for in-memory phase |
| Large todo lists slow down list view | Not a concern for learning scope; pagination can be added later |
| Console client crashes on server unavailable | Implement connection error handling with clear message |
