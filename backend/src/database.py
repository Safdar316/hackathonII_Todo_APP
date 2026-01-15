"""Database connection and session management for PostgreSQL."""
import os
from sqlmodel import SQLModel, Session, create_engine
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get database URL from environment variable
DATABASE_URL = os.getenv("DATABASE_URL")

if DATABASE_URL is None:
    raise ValueError("DATABASE_URL environment variable is not set")

# Create engine with connection pooling
engine = create_engine(
    DATABASE_URL,
    echo=False,  # Set to True for SQL debugging
    pool_size=5,
    max_overflow=10,
    pool_pre_ping=True,  # Verify connections before use
)


def create_db_and_tables():
    """Create all database tables from SQLModel metadata."""
    SQLModel.metadata.create_all(engine)


def get_session():
    """Dependency that yields a database session."""
    with Session(engine) as session:
        yield session
