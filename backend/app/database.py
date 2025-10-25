from __future__ import annotations

from contextlib import contextmanager
from pathlib import Path
from typing import Iterator

from sqlmodel import Session, SQLModel, create_engine

DB_PATH = Path(__file__).resolve().parent.parent / "maintenance.db"
DATABASE_URL = f"sqlite:///{DB_PATH}"

echo_sql = False
engine = create_engine(DATABASE_URL, echo=echo_sql, connect_args={"check_same_thread": False})


def init_db() -> None:
    """Create database tables if they do not already exist."""
    SQLModel.metadata.create_all(engine)


@contextmanager
def get_session() -> Iterator[Session]:
    """Provide a transactional scope around a series of operations."""
    session = Session(engine)
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()
