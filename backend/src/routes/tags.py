"""Tags API routes."""
from typing import Optional
from fastapi import APIRouter, Depends
from sqlmodel import Session
from src.database import get_session
from src.models.todo import TagResponse
from src.services import tag_service

router = APIRouter(prefix="/tags", tags=["tags"])


@router.get("/", response_model=list[TagResponse])
async def list_tags(
    session: Session = Depends(get_session),
    search: Optional[str] = None,
    limit: int = 10
):
    """Get all tags or search by prefix.

    Args:
        search: Optional prefix to filter tags (for autocomplete)
        limit: Maximum number of tags to return (default: 10)

    Returns:
        List of tags matching the criteria
    """
    if search:
        return tag_service.get_tags_by_prefix(session, search, limit)
    return tag_service.get_all_tags(session, limit)
