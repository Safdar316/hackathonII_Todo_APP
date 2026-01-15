"""API routes for todo operations."""
from fastapi import APIRouter, HTTPException, status, Depends
from sqlmodel import Session
from src.models.todo import TodoCreate, TodoUpdate, TodoResponse
from src.database import get_session
from src.services import todo_service

router = APIRouter(prefix="/todos", tags=["Todos"])


@router.post("", response_model=TodoResponse, status_code=status.HTTP_201_CREATED)
def create_todo(todo_create: TodoCreate, session: Session = Depends(get_session)) -> TodoResponse:
    """Create a new todo."""
    todo = todo_service.create_todo(session, todo_create)
    return TodoResponse.model_validate(todo)


@router.get("", response_model=list[TodoResponse])
def list_todos(session: Session = Depends(get_session)) -> list[TodoResponse]:
    """List all todos ordered by created_at descending (newest first)."""
    todos = todo_service.get_all_todos(session)
    return [TodoResponse.model_validate(todo) for todo in todos]


@router.get("/{todo_id}", response_model=TodoResponse)
def get_todo(todo_id: int, session: Session = Depends(get_session)) -> TodoResponse:
    """Get a single todo by ID."""
    todo = todo_service.get_todo_by_id(session, todo_id)
    if todo is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Todo with id {todo_id} not found"
        )
    return TodoResponse.model_validate(todo)


@router.put("/{todo_id}", response_model=TodoResponse)
def update_todo(todo_id: int, todo_update: TodoUpdate, session: Session = Depends(get_session)) -> TodoResponse:
    """Update a todo by ID."""
    # Validate empty title
    if todo_update.title is not None and todo_update.title.strip() == "":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Title cannot be empty"
        )

    todo = todo_service.update_todo(session, todo_id, todo_update)
    if todo is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Todo with id {todo_id} not found"
        )
    return TodoResponse.model_validate(todo)


@router.delete("/{todo_id}")
def delete_todo(todo_id: int, session: Session = Depends(get_session)) -> dict:
    """Delete a todo by ID."""
    success = todo_service.delete_todo(session, todo_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Todo with id {todo_id} not found"
        )
    return {"message": "Todo deleted successfully"}
