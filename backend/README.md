# Console Todo API

A console-driven Todo application backed by a FastAPI server.

## Overview

This application consists of two components:
1. **FastAPI Backend**: RESTful API with in-memory storage
2. **Console Client**: Menu-driven CLI that communicates with the API

## Prerequisites

- Python 3.10+
- [uv](https://docs.astral.sh/uv/) package manager

## Setup

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
uv sync
```

## Running the Application

### 1. Start the API Server

```bash
cd backend
uv run uvicorn src.main:app --reload
```

The server will start at `http://localhost:8000`.

- **API Documentation**: http://localhost:8000/docs
- **Root endpoint**: http://localhost:8000/

### 2. Run the Console Client

In a **new terminal**:

```bash
cd backend
uv run python -m src.cli.client
```

## Console Menu

```
=== Todo Application ===
1. Add todo
2. View all todos
3. View todo by ID
4. Update todo
5. Mark todo as completed
6. Delete todo
7. Exit
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /todos | Create a new todo |
| GET | /todos | List all todos |
| GET | /todos/{id} | Get a single todo |
| PUT | /todos/{id} | Update a todo |
| DELETE | /todos/{id} | Delete a todo |

## Project Structure

```
backend/
├── src/
│   ├── main.py              # FastAPI app entry point
│   ├── models/
│   │   └── todo.py          # Pydantic models
│   ├── services/
│   │   └── todo_service.py  # Business logic & storage
│   ├── routes/
│   │   └── todos.py         # API endpoints
│   └── cli/
│       └── client.py        # Console client
├── tests/
│   ├── unit/
│   └── integration/
├── pyproject.toml           # uv project config
└── README.md
```

## Example Usage

```
Welcome to the Todo Application!

=== Todo Application ===
1. Add todo
2. View all todos
...

Select an option (1-7): 1
Enter todo title: Buy groceries
Enter description (optional): Milk and eggs
✓ Todo created with ID: 1

Select an option (1-7): 2
--- All Todos ---
ID: 1 | Title: Buy groceries | Completed: No

Select an option (1-7): 7
Goodbye!
```

## Notes

- Data is stored in-memory and resets when the server restarts
- The server must be running before using the console client
- Default port is 8000
