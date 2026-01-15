# Quickstart: Console-Based Todo Application

**Feature**: 001-console-todo-api
**Date**: 2026-01-13

## Prerequisites

- Python 3.10 or higher
- uv package manager (install from https://docs.astral.sh/uv/)

## Setup

### 1. Initialize Project

```bash
# Navigate to repository root
cd console-todo-api

# Install dependencies using uv
uv sync
```

### 2. Start the API Server

```bash
# Run the FastAPI server with uvicorn
uv run uvicorn src.main:app --reload
```

The server will start at `http://localhost:8000`.

**Verify**: Open `http://localhost:8000/docs` in your browser to see the Swagger UI.

### 3. Run the Console Client

In a **new terminal**:

```bash
# Run the console client
uv run python -m src.cli.client
```

## Usage

### Console Menu

When you run the console client, you'll see:

```
=== Todo Application ===
1. Add todo
2. View all todos
3. View todo by ID
4. Update todo
5. Mark todo as completed
6. Delete todo
7. Exit

Select an option (1-7):
```

### Example Session

```
Select an option (1-7): 1
Enter todo title: Buy groceries
Enter description (optional, press Enter to skip): Milk and eggs
✓ Todo created with ID: 1

Select an option (1-7): 1
Enter todo title: Write report
Enter description (optional, press Enter to skip):
✓ Todo created with ID: 2

Select an option (1-7): 2
--- All Todos ---
ID: 1 | Title: Buy groceries | Completed: No
ID: 2 | Title: Write report | Completed: No

Select an option (1-7): 5
Enter todo ID to mark complete: 1
✓ Todo 1 marked as completed

Select an option (1-7): 7
Goodbye!
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /todos | Create a new todo |
| GET | /todos | List all todos |
| GET | /todos/{id} | Get a single todo |
| PUT | /todos/{id} | Update a todo |
| DELETE | /todos/{id} | Delete a todo |

## Testing

### Manual Testing

Use the console client to test all CRUD operations:
1. Create 2-3 todos
2. List all todos
3. View a specific todo by ID
4. Update a todo's title
5. Mark a todo as completed
6. Delete a todo
7. Exit

### API Testing with curl

```bash
# Create a todo
curl -X POST http://localhost:8000/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "Test todo", "description": "Testing"}'

# List all todos
curl http://localhost:8000/todos

# Get a specific todo
curl http://localhost:8000/todos/1

# Update a todo
curl -X PUT http://localhost:8000/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'

# Delete a todo
curl -X DELETE http://localhost:8000/todos/1
```

### Running Unit Tests (Optional)

```bash
uv run pytest tests/ -v
```

## Troubleshooting

### "Cannot connect to server"

Ensure the FastAPI server is running in a separate terminal before starting the console client.

### "Module not found" errors

Run `uv sync` to ensure all dependencies are installed.

### Port 8000 already in use

Either stop the other process or run uvicorn on a different port:
```bash
uv run uvicorn src.main:app --port 8001
```

Then update the BASE_URL in the console client.

## Project Structure

```
console-todo-api/
├── src/
│   ├── main.py              # FastAPI app entry point
│   ├── models/todo.py       # Pydantic models
│   ├── services/todo_service.py  # Business logic
│   ├── routes/todos.py      # API endpoints
│   └── cli/client.py        # Console client
├── tests/
│   ├── unit/
│   └── integration/
├── pyproject.toml           # uv project config
└── README.md
```
