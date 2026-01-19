"""Add Phase II columns to todos table.

Revision ID: 001_add_phase2_columns
Revises:
Create Date: 2026-01-16

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '001_add_phase2_columns'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Add Phase II columns with defaults for existing data."""
    # Add priority column with default for existing rows
    op.add_column('todos', sa.Column('priority', sa.String(10), nullable=False, server_default='medium'))

    # Add due_date column (nullable)
    op.add_column('todos', sa.Column('due_date', sa.DateTime(timezone=True), nullable=True))

    # Add recurrence_rule column (nullable)
    op.add_column('todos', sa.Column('recurrence_rule', sa.String(10), nullable=True))

    # Add reminder_time column (nullable)
    op.add_column('todos', sa.Column('reminder_time', sa.DateTime(timezone=True), nullable=True))

    # Add indexes for query performance
    op.create_index('idx_todos_priority', 'todos', ['priority'])
    op.create_index('idx_todos_due_date', 'todos', ['due_date'])
    op.create_index('idx_todos_completed', 'todos', ['completed'])


def downgrade() -> None:
    """Remove Phase II columns."""
    op.drop_index('idx_todos_completed', 'todos')
    op.drop_index('idx_todos_due_date', 'todos')
    op.drop_index('idx_todos_priority', 'todos')
    op.drop_column('todos', 'reminder_time')
    op.drop_column('todos', 'recurrence_rule')
    op.drop_column('todos', 'due_date')
    op.drop_column('todos', 'priority')
