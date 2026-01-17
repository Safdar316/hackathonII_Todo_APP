"""SQLModel and Pydantic models for Todo entities."""
from datetime import datetime, timezone
from enum import Enum
from typing import Optional, List, TYPE_CHECKING
from pydantic import BaseModel, Field, ConfigDict, computed_field
from sqlmodel import SQLModel, Field as SQLField, Relationship


class Priority(str, Enum):
    """Priority levels for todos."""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class RecurrenceRule(str, Enum):
    """Recurrence patterns for recurring todos."""
    DAILY = "daily"
    WEEKLY = "weekly"
    MONTHLY = "monthly"


# ============== Junction Table ==============

class TodoTag(SQLModel, table=True):
    """Junction table for Todo-Tag many-to-many relationship."""
    __tablename__ = "todo_tag"

    todo_id: int = SQLField(foreign_key="todos.id", primary_key=True, ondelete="CASCADE")
    tag_id: int = SQLField(foreign_key="tag.id", primary_key=True, ondelete="CASCADE")


# ============== Tag Model ==============

class Tag(SQLModel, table=True):
    """Tag entity for categorizing todos."""
    __tablename__ = "tag"

    id: Optional[int] = SQLField(default=None, primary_key=True)
    name: str = SQLField(max_length=50, unique=True, index=True)

    # Relationship to todos
    todos: List["Todo"] = Relationship(back_populates="tags", link_model=TodoTag)


# ============== Todo Model (Extended) ==============

class Todo(SQLModel, table=True):
    """Todo entity for database persistence."""
    __tablename__ = "todos"

    id: Optional[int] = SQLField(default=None, primary_key=True)
    title: str = SQLField(max_length=200)
    description: Optional[str] = SQLField(default=None, max_length=1000)
    completed: bool = SQLField(default=False)
    created_at: datetime = SQLField(default_factory=lambda: datetime.now(timezone.utc))

    # Phase II fields
    priority: Priority = SQLField(default=Priority.MEDIUM)
    due_date: Optional[datetime] = SQLField(default=None)
    recurrence_rule: Optional[RecurrenceRule] = SQLField(default=None)
    reminder_time: Optional[datetime] = SQLField(default=None)

    # Relationship to tags
    tags: List[Tag] = Relationship(back_populates="todos", link_model=TodoTag)


# ============== Request Schemas ==============

class TodoCreate(BaseModel):
    """Request model for creating a new todo."""
    title: str = Field(..., min_length=1, max_length=200, description="Task title (required)")
    description: str | None = Field(None, max_length=1000, description="Task description (optional)")
    priority: Priority = Field(default=Priority.MEDIUM, description="Priority level")
    due_date: datetime | None = Field(None, description="Due date (optional)")
    recurrence_rule: RecurrenceRule | None = Field(None, description="Recurrence pattern (optional)")
    reminder_time: datetime | None = Field(None, description="Reminder time (optional)")
    tags: List[str] = Field(default_factory=list, description="Tag names")


class TodoUpdate(BaseModel):
    """Request model for updating an existing todo."""
    title: str | None = Field(None, min_length=1, max_length=200, description="Updated title")
    description: str | None = Field(None, max_length=1000, description="Updated description")
    completed: bool | None = Field(None, description="Completion status")
    priority: Priority | None = Field(None, description="Priority level")
    due_date: datetime | None = Field(None, description="Due date")
    recurrence_rule: RecurrenceRule | None = Field(None, description="Recurrence pattern")
    reminder_time: datetime | None = Field(None, description="Reminder time")
    tags: List[str] | None = Field(None, description="Tag names (replaces all tags if provided)")


# ============== Response Schemas ==============

class TagResponse(BaseModel):
    """Response model for tag data."""
    id: int = Field(..., description="Unique identifier")
    name: str = Field(..., description="Tag name")

    model_config = ConfigDict(from_attributes=True)


class TodoResponse(BaseModel):
    """Response model for todo data."""
    id: int = Field(..., description="Unique identifier")
    title: str = Field(..., description="Task title")
    description: str | None = Field(None, description="Task description")
    completed: bool = Field(..., description="Completion status")
    created_at: datetime = Field(..., description="Creation timestamp")
    priority: Priority = Field(..., description="Priority level")
    due_date: datetime | None = Field(None, description="Due date")
    recurrence_rule: RecurrenceRule | None = Field(None, description="Recurrence pattern")
    reminder_time: datetime | None = Field(None, description="Reminder time")
    tags: List[TagResponse] = Field(default_factory=list, description="Associated tags")

    model_config = ConfigDict(from_attributes=True)

    @computed_field
    @property
    def is_overdue(self) -> bool:
        """Check if the todo is overdue (has due_date in past and not completed)."""
        if self.due_date and not self.completed:
            return datetime.now(timezone.utc) > self.due_date.replace(tzinfo=timezone.utc) if self.due_date.tzinfo is None else datetime.now(timezone.utc) > self.due_date
        return False
