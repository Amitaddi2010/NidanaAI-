from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.database import Base
import os

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./nidana.db")

# Handle SQLite vs Postgres
if "sqlite" in DATABASE_URL:
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
else:
    engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    Base.metadata.create_all(bind=engine)
