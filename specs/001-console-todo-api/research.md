# Research: Console-Based Todo Application (FastAPI Backend)

**Feature**: 001-console-todo-api
**Date**: 2026-01-13
**Status**: Complete

## Research Summary

All technical decisions have been resolved. No NEEDS CLARIFICATION items remain.

## Technology Research

### R-001: FastAPI Best Practices for Simple CRUD APIs

**Decision**: Use FastAPI with APIRouter for endpoint organization.

**Rationale**:
- FastAPI provides automatic OpenAPI documentation (/docs)
- Pydantic integration for request/response validation
- APIRouter enables clean separation of endpoint groups
- Built-in exception handlers for HTTP errors

**Best Practices Applied**:
- Use `APIRouter` with prefix `/todos` for grouping
- Use Pydantic models for all request/response bodies
- Use `HTTPException` for 400/404 errors
- Use `status` constants from `fastapi` for response codes
- Return Pydantic models directly (automatic JSON serialization)

**Sources**:
- FastAPI official documentation
- FastAPI best practices for production applications

### R-002: uv Package Manager Setup

**Decision**: Use uv for project initialization and dependency management.

**Rationale**:
- Modern, fast Python package manager
- Creates pyproject.toml automatically
- Compatible with pip ecosystem
- Simplifies virtual environment management

**Setup Commands**:
```bash
uv init console-todo-api
cd console-todo-api
uv add fastapi uvicorn pydantic httpx
uv add --dev pytest
```

**Sources**:
- uv official documentation
- User clarification (spec session 2026-01-13)

### R-003: httpx for HTTP Client

**Decision**: Use httpx in synchronous mode for console client.

**Rationale**:
- Modern replacement for requests library
- Same API as requests but with async support
- Better timeout handling
- Recommended by FastAPI for testing

**Usage Pattern**:
```python
import httpx

BASE_URL = "http://localhost:8000"

def get_todos():
    response = httpx.get(f"{BASE_URL}/todos")
    response.raise_for_status()
    return response.json()
```

**Sources**:
- httpx official documentation
- User clarification (spec session 2026-01-13)

### R-004: In-Memory Storage Pattern

**Decision**: Use Python dictionary with auto-increment ID counter.

**Rationale**:
- Dictionary provides O(1) lookup by ID
- Simple counter for sequential IDs
- Thread-safe for single-process development
- Easy to replace with database repository pattern later

**Implementation Pattern**:
```python
class TodoService:
    def __init__(self):
        self._todos: dict[int, Todo] = {}
        self._counter: int = 0

    def create(self, todo_create: TodoCreate) -> Todo:
        self._counter += 1
        todo = Todo(
            id=self._counter,
            title=todo_create.title,
            description=todo_create.description,
            completed=False,
            created_at=datetime.now()
        )
        self._todos[todo.id] = todo
        return todo
```

**Sources**:
- Python data structures documentation
- Repository pattern best practices

### R-005: Error Handling Strategy

**Decision**: Use HTTPException for API errors, try/except for client errors.

**Rationale**:
- FastAPI's HTTPException provides consistent error format
- Client-side httpx.HTTPStatusError for response errors
- httpx.ConnectError for server unavailable

**API Error Pattern**:
```python
from fastapi import HTTPException, status

def get_todo(id: int) -> Todo:
    if id not in self._todos:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Todo with id {id} not found"
        )
    return self._todos[id]
```

**Client Error Pattern**:
```python
try:
    response = httpx.get(f"{BASE_URL}/todos/{id}")
    response.raise_for_status()
except httpx.ConnectError:
    print("Error: Cannot connect to server. Is it running?")
except httpx.HTTPStatusError as e:
    print(f"Error: {e.response.json()['detail']}")
```

**Sources**:
- FastAPI error handling documentation
- httpx exception handling documentation

## Resolved Clarifications

| Item | Resolution | Source |
|------|------------|--------|
| Package manager | uv | User clarification |
| HTTP client library | httpx | User selection (Option A) |
| Storage mechanism | In-memory dictionary | Spec constraint |
| API framework | FastAPI | Spec constraint |

## Outstanding Items

None. All research complete.
