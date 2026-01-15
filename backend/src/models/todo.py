"""SQLModel and Pydantic models for Todo entities."""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict
from sqlmodel import SQLModel, Field as SQLField


class TodoCreate(BaseModel):
    """Request model for creating a new todo."""
    title: str = Field(..., min_length=1, max_length=200, description="Task title (required)")
    description: str | None = Field(None, max_length=1000, description="Task description (optional)")


class TodoUpdate(BaseModel):
    """Request model for updating an existing todo."""
    title: str | None = Field(None, min_length=1, max_length=200, description="Updated title")
    description: str | None = Field(None, max_length=1000, description="Updated description")
    completed: bool | None = Field(None, description="Completion status")


class TodoResponse(BaseModel):
    """Response model for todo data."""
    id: int = Field(..., description="Unique identifier")
    title: str = Field(..., description="Task title")
    description: str | None = Field(None, description="Task description")
    completed: bool = Field(..., description="Completion status")
    created_at: datetime = Field(..., description="Creation timestamp")

    model_config = ConfigDict(from_attributes=True)


class Todo(SQLModel, table=True):
    """Todo entity for database persistence."""
    __tablename__ = "todos"

    id: Optional[int] = SQLField(default=None, primary_key=True)
    title: str = SQLField(max_length=200)
    description: Optional[str] = SQLField(default=None, max_length=1000)
    completed: bool = SQLField(default=False)
    created_at: datetime = SQLField(default_factory=datetime.utcnow)
