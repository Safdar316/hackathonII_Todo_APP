# Data Model: Console-Based Todo Application

**Feature**: 001-console-todo-api
**Date**: 2026-01-13

## Entities

### Todo

The primary entity representing a task to be completed.

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| id | int | Yes (auto) | Auto-generated | Unique identifier, sequential integer |
| title | str | Yes | - | Short description of the task (non-empty) |
| description | str | No | None | Longer explanation of the task |
| completed | bool | Yes | False | Whether the task is done |
| created_at | datetime | Yes (auto) | Auto-generated | Timestamp when todo was created |

**Validation Rules**:
- `title` MUST be non-empty string (min length: 1)
- `id` MUST be positive integer
- `created_at` MUST be valid ISO 8601 datetime

**State Transitions**:
```
[Created] --> completed=False
    |
    v
[Completed] --> completed=True
    |
    v
[Deleted] --> Removed from storage
```

## Pydantic Models

### TodoCreate (Request)

Used for POST /todos endpoint.

```python
class TodoCreate(BaseModel):
    title: str = Field(..., min_length=1, description="Task title")
    description: str | None = Field(None, description="Task description")
```

### TodoUpdate (Request)

Used for PUT /todos/{id} endpoint. All fields optional for partial updates.

```python
class TodoUpdate(BaseModel):
    title: str | None = Field(None, min_length=1, description="Updated title")
    description: str | None = Field(None, description="Updated description")
    completed: bool | None = Field(None, description="Completion status")
```

### TodoResponse (Response)

Used for all response bodies containing todo data.

```python
class TodoResponse(BaseModel):
    id: int = Field(..., description="Unique identifier")
    title: str = Field(..., description="Task title")
    description: str | None = Field(None, description="Task description")
    completed: bool = Field(..., description="Completion status")
    created_at: datetime = Field(..., description="Creation timestamp")

    model_config = ConfigDict(from_attributes=True)
```

### ErrorResponse (Response)

Standard error response format (provided by FastAPI).

```python
class ErrorResponse(BaseModel):
    detail: str = Field(..., description="Error message")
```

## Relationships

This phase has a single entity with no relationships. Future phases may introduce:
- User → Todo (one-to-many) for multi-user support
- Category → Todo (many-to-many) for organization

## Storage Schema

In-memory dictionary structure:

```python
_todos: dict[int, Todo] = {
    1: Todo(id=1, title="Buy groceries", description=None, completed=False, created_at=datetime(...)),
    2: Todo(id=2, title="Write report", description="Q4 summary", completed=True, created_at=datetime(...)),
}
_counter: int = 2  # Tracks highest assigned ID
```

## Sample Data

```json
{
  "id": 1,
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "completed": false,
  "created_at": "2026-01-13T10:30:00"
}
```
