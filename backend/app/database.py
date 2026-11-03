import time
import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.config import settings

logger = logging.getLogger(__name__)

# Connect with retry for container startup orchestration
def get_engine():
    db_url = settings.DATABASE_URL
    max_retries = 10
    retry_interval = 2

    for attempt in range(1, max_retries + 1):
        try:
            engine = create_engine(
                db_url,
                pool_pre_ping=True,
                pool_size=10,
                max_overflow=20
            )
            # Test connection
            with engine.connect() as conn:
                logger.info(f"Connected to database successfully on attempt {attempt}")
                return engine
        except Exception as e:
            logger.warning(f"Database connection attempt {attempt}/{max_retries} failed: {e}")
            if attempt == max_retries:
                # If PostgreSQL fails completely in local environment, fallback to SQLite for zero-friction local testing
                logger.error("Failed to connect to PostgreSQL after max retries. Falling back to local SQLite.")
                return create_engine("sqlite:///./aquavibe.db", connect_args={"check_same_thread": False})
            time.sleep(retry_interval)

engine = get_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
