"""API routes for todo operations."""
from datetime import datetime
from typing import Optional
from fastapi import APIRouter, HTTPException, status, Depends, Query
from sqlmodel import Session
from src.models.todo import TodoCreate, TodoUpdate, TodoResponse, Priority
from src.database import get_session
from src.services import todo_service

router = APIRouter(prefix="/todos", tags=["Todos"])


@router.post("", response_model=TodoResponse, status_code=status.HTTP_201_CREATED)
def create_todo(todo_create: TodoCreate, session: Session = Depends(get_session)) -> TodoResponse:
    """Create a new todo."""
    # Validate recurrence requires due_date
    if todo_create.recurrence_rule and not todo_create.due_date:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Recurrence rule requires a due date"
        )

    # Validate reminder_time <= due_date
    if todo_create.reminder_time and todo_create.due_date:
        if todo_create.reminder_time > todo_create.due_date:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Reminder time must be before or equal to due date"
            )

    todo = todo_service.create_todo(session, todo_create)
    return TodoResponse.model_validate(todo)


@router.get("", response_model=list[TodoResponse])
def list_todos(
    session: Session = Depends(get_session),
    search: Optional[str] = Query(None, description="Search in title and description"),
    completed: Optional[bool] = Query(None, description="Filter by completion status"),
    priority: Optional[Priority] = Query(None, description="Filter by priority"),
    tags: Optional[str] = Query(None, description="Filter by tags (comma-separated)"),
    due_from: Optional[datetime] = Query(None, description="Filter due date from"),
    due_to: Optional[datetime] = Query(None, description="Filter due date to"),
    sort_by: str = Query("created_at", description="Sort by field: created_at, due_date, priority, title"),
    sort_order: str = Query("desc", description="Sort order: asc or desc"),
) -> list[TodoResponse]:
    """List todos with optional filtering and sorting."""
    # Parse tags from comma-separated string
    tag_list = [t.strip() for t in tags.split(",")] if tags else None

    todos = todo_service.get_todos_filtered(
        session,
        search=search,
        completed=completed,
        priority=priority,
        tags=tag_list,
        due_from=due_from,
        due_to=due_to,
        sort_by=sort_by,
        sort_order=sort_order,
    )
    return [TodoResponse.model_validate(todo) for todo in todos]


@router.get("/reminders", response_model=list[TodoResponse])
def get_pending_reminders(session: Session = Depends(get_session)) -> list[TodoResponse]:
    """Get todos with pending reminders (future reminder_time, not completed)."""
    todos = todo_service.get_pending_reminders(session)
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

    # Validate reminder_time <= due_date if both provided
    if todo_update.reminder_time and todo_update.due_date:
        if todo_update.reminder_time > todo_update.due_date:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Reminder time must be before or equal to due date"
            )

    todo = todo_service.update_todo(session, todo_id, todo_update)
    if todo is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Todo with id {todo_id} not found"
        )
    return TodoResponse.model_validate(todo)


@router.post("/{todo_id}/complete", response_model=dict)
def complete_todo(todo_id: int, session: Session = Depends(get_session)) -> dict:
    """Mark a todo as complete. For recurring todos, creates the next instance."""
    from dateutil.relativedelta import relativedelta
    from src.models.todo import Todo, RecurrenceRule

    todo = todo_service.get_todo_by_id(session, todo_id)
    if todo is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Todo with id {todo_id} not found"
        )

    # Mark as completed
    todo.completed = True

    next_instance = None

    # If recurring, create next instance
    if todo.recurrence_rule and todo.due_date:
        # Calculate next due date
        if todo.recurrence_rule == RecurrenceRule.DAILY:
            next_due = todo.due_date + relativedelta(days=1)
        elif todo.recurrence_rule == RecurrenceRule.WEEKLY:
            next_due = todo.due_date + relativedelta(weeks=1)
        elif todo.recurrence_rule == RecurrenceRule.MONTHLY:
            next_due = todo.due_date + relativedelta(months=1)
        else:
            next_due = None

        if next_due:
            # Calculate reminder offset if original had reminder
            next_reminder = None
            if todo.reminder_time:
                reminder_offset = todo.due_date - todo.reminder_time
                next_reminder = next_due - reminder_offset

            # Create new instance
            next_instance = Todo(
                title=todo.title,
                description=todo.description,
                completed=False,
                priority=todo.priority,
                due_date=next_due,
                recurrence_rule=todo.recurrence_rule,
                reminder_time=next_reminder,
                tags=todo.tags,
            )
            session.add(next_instance)

    session.commit()
    session.refresh(todo)

    response = {
        "completed_todo": TodoResponse.model_validate(todo),
        "next_instance": None,
    }

    if next_instance:
        session.refresh(next_instance)
        response["next_instance"] = TodoResponse.model_validate(next_instance)

    return response


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
