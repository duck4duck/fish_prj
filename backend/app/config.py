import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "AquaVibe Reef & Deep Fish Store API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # Database config
    POSTGRES_USER: str = os.getenv("POSTGRES_USER", "aquavibe")
    POSTGRES_PASSWORD: str = os.getenv("POSTGRES_PASSWORD", "aquavibe_secret")
    POSTGRES_DB: str = os.getenv("POSTGRES_DB", "aquavibe_db")
    POSTGRES_HOST: str = os.getenv("POSTGRES_HOST", "db")
    POSTGRES_PORT: str = os.getenv("POSTGRES_PORT", "5432")
    
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        f"postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_HOST}:{POSTGRES_PORT}/{POSTGRES_DB}"
    )

    class Config:
        case_sensitive = True

settings = Settings()
