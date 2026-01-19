"""Todo service with database operations."""
from datetime import datetime, timezone
from typing import Optional
from sqlmodel import Session, select, or_
from sqlalchemy import case
from src.models.todo import Todo, TodoCreate, TodoUpdate, Tag, TodoTag, Priority, RecurrenceRule
from src.services.tag_service import get_or_create_tags


def create_todo(session: Session, todo_create: TodoCreate) -> Todo:
    """Create a new todo in the database."""
    # Handle tags
    tags = []
    if todo_create.tags:
        tags = get_or_create_tags(session, todo_create.tags)

    todo = Todo(
        title=todo_create.title,
        description=todo_create.description,
        completed=False,
        created_at=datetime.now(timezone.utc),
        priority=todo_create.priority,
        due_date=todo_create.due_date,
        recurrence_rule=todo_create.recurrence_rule,
        reminder_time=todo_create.reminder_time,
        tags=tags
    )
    session.add(todo)
    session.commit()
    session.refresh(todo)
    return todo


def get_all_todos(session: Session) -> list[Todo]:
    """Return all todos ordered by created_at descending (newest first)."""
    statement = select(Todo).order_by(Todo.created_at.desc())
    return list(session.exec(statement).all())


def get_todo_by_id(session: Session, todo_id: int) -> Todo | None:
    """Get a todo by ID. Returns None if not found."""
    return session.get(Todo, todo_id)


def update_todo(session: Session, todo_id: int, todo_update: TodoUpdate) -> Todo | None:
    """Update a todo with partial data. Returns None if not found."""
    todo = session.get(Todo, todo_id)
    if todo is None:
        return None

    # Get update data excluding unset fields
    update_data = todo_update.model_dump(exclude_unset=True)

    # Handle tags separately
    if 'tags' in update_data:
        tag_names = update_data.pop('tags')
        if tag_names is not None:
            # Replace all tags with new ones
            todo.tags = get_or_create_tags(session, tag_names)

    # Apply other partial updates
    for key, value in update_data.items():
        setattr(todo, key, value)

    session.add(todo)
    session.commit()
    session.refresh(todo)
    return todo


def delete_todo(session: Session, todo_id: int) -> bool:
    """Delete a todo by ID. Returns False if not found."""
    todo = session.get(Todo, todo_id)
    if todo is None:
        return False
    session.delete(todo)
    session.commit()
    return True


def get_todos_filtered(
    session: Session,
    search: Optional[str] = None,
    completed: Optional[bool] = None,
    priority: Optional[Priority] = None,
    tags: Optional[list[str]] = None,
    due_from: Optional[datetime] = None,
    due_to: Optional[datetime] = None,
    sort_by: str = "created_at",
    sort_order: str = "desc"
) -> list[Todo]:
    """Get todos with filtering and sorting.

    Args:
        session: Database session
        search: Search term for title/description (case-insensitive)
        completed: Filter by completion status
        priority: Filter by priority level
        tags: Filter by tag names (comma-separated)
        due_from: Filter by due date >= this value
        due_to: Filter by due date <= this value
        sort_by: Field to sort by (created_at, due_date, priority, title)
        sort_order: Sort direction (asc, desc)

    Returns:
        List of filtered and sorted Todo objects
    """
    query = select(Todo)

    # Apply search filter
    if search:
        search_term = f"%{search}%"
        query = query.where(
            or_(
                Todo.title.ilike(search_term),
                Todo.description.ilike(search_term)
            )
        )

    # Apply completed filter
    if completed is not None:
        query = query.where(Todo.completed == completed)

    # Apply priority filter
    if priority:
        query = query.where(Todo.priority == priority)

    # Apply tag filter (todos must have ALL specified tags)
    if tags:
        for tag_name in tags:
            normalized_name = tag_name.strip().lower()
            query = query.where(
                Todo.id.in_(
                    select(TodoTag.todo_id)
                    .join(Tag, Tag.id == TodoTag.tag_id)
                    .where(Tag.name == normalized_name)
                )
            )

    # Apply due date range filter
    if due_from:
        query = query.where(Todo.due_date >= due_from)
    if due_to:
        query = query.where(Todo.due_date <= due_to)

    # Apply sorting
    valid_sort_fields = {
        "created_at": Todo.created_at,
        "due_date": Todo.due_date,
        "title": Todo.title,
        "priority": case(
            (Todo.priority == Priority.HIGH, 1),
            (Todo.priority == Priority.MEDIUM, 2),
            (Todo.priority == Priority.LOW, 3),
            else_=4
        )
    }

    sort_field = valid_sort_fields.get(sort_by, Todo.created_at)

    if sort_order == "asc":
        query = query.order_by(sort_field.asc())
    else:
        query = query.order_by(sort_field.desc())

    return list(session.exec(query).all())


def get_pending_reminders(session: Session) -> list[Todo]:
    """Get todos with pending reminders (reminder_time in future, not completed).

    Returns:
        List of Todo objects with pending reminders
    """
    now = datetime.now(timezone.utc)
    statement = (
        select(Todo)
        .where(Todo.reminder_time.isnot(None))
        .where(Todo.reminder_time > now)
        .where(Todo.completed == False)
        .order_by(Todo.reminder_time.asc())
    )
    return list(session.exec(statement).all())
