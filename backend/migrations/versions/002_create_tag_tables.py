"""Create Tag and TodoTag tables.

Revision ID: 002_create_tag_tables
Revises: 001_add_phase2_columns
Create Date: 2026-01-16

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '002_create_tag_tables'
down_revision: Union[str, None] = '001_add_phase2_columns'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Create tag and todo_tag tables."""
    # Create tag table
    op.create_table(
        'tag',
        sa.Column('id', sa.Integer, primary_key=True, autoincrement=True),
        sa.Column('name', sa.String(50), nullable=False, unique=True)
    )
    op.create_index('idx_tag_name', 'tag', ['name'])

    # Create junction table for many-to-many relationship
    op.create_table(
        'todo_tag',
        sa.Column('todo_id', sa.Integer, sa.ForeignKey('todos.id', ondelete='CASCADE'), primary_key=True),
        sa.Column('tag_id', sa.Integer, sa.ForeignKey('tag.id', ondelete='CASCADE'), primary_key=True)
    )
    op.create_index('idx_todo_tag_todo_id', 'todo_tag', ['todo_id'])
    op.create_index('idx_todo_tag_tag_id', 'todo_tag', ['tag_id'])


def downgrade() -> None:
    """Remove tag and todo_tag tables."""
    op.drop_index('idx_todo_tag_tag_id', 'todo_tag')
    op.drop_index('idx_todo_tag_todo_id', 'todo_tag')
    op.drop_table('todo_tag')
    op.drop_index('idx_tag_name', 'tag')
    op.drop_table('tag')
