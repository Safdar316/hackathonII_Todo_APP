"""Tag service with database operations."""
from sqlmodel import Session, select
from src.models.todo import Tag


def get_or_create_tags(session: Session, tag_names: list[str]) -> list[Tag]:
    """Get existing tags or create new ones by name.

    Args:
        session: Database session
        tag_names: List of tag names to get or create

    Returns:
        List of Tag objects
    """
    tags = []
    for name in tag_names:
        # Normalize tag name: strip whitespace and convert to lowercase
        normalized_name = name.strip().lower()
        if not normalized_name:
            continue

        # Try to find existing tag
        statement = select(Tag).where(Tag.name == normalized_name)
        tag = session.exec(statement).first()

        if not tag:
            # Create new tag
            tag = Tag(name=normalized_name)
            session.add(tag)
            session.flush()  # Flush to get the ID

        tags.append(tag)

    return tags


def get_tags_by_prefix(session: Session, prefix: str, limit: int = 10) -> list[Tag]:
    """Get tags that start with the given prefix (for autocomplete).

    Args:
        session: Database session
        prefix: Prefix to search for (case-insensitive)
        limit: Maximum number of tags to return

    Returns:
        List of matching Tag objects
    """
    normalized_prefix = prefix.strip().lower()
    statement = select(Tag).where(Tag.name.ilike(f"{normalized_prefix}%")).limit(limit)
    return list(session.exec(statement).all())


def get_all_tags(session: Session, limit: int = 100) -> list[Tag]:
    """Get all tags ordered by name.

    Args:
        session: Database session
        limit: Maximum number of tags to return

    Returns:
        List of Tag objects
    """
    statement = select(Tag).order_by(Tag.name).limit(limit)
    return list(session.exec(statement).all())
