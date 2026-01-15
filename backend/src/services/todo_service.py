"""Todo service with database operations."""
from datetime import datetime
from sqlmodel import Session, select
from src.models.todo import Todo, TodoCreate, TodoUpdate


def create_todo(session: Session, todo_create: TodoCreate) -> Todo:
    """Create a new todo in the database."""
    todo = Todo(
        title=todo_create.title,
        description=todo_create.description,
        completed=False,
        created_at=datetime.utcnow()
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

    # Apply partial updates
    update_data = todo_update.model_dump(exclude_unset=True)
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
