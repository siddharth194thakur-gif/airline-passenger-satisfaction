import os
import json
from pydantic import BaseModel

def get_database_url() -> str:
    raw_url = os.getenv("DATABASE_URL", "sqlite:///./predictions.db")
    # SQLAlchemy 2.0 requires postgresql:// instead of postgres:// (Render provides postgres://)
    if raw_url.startswith("postgres://"):
        raw_url = raw_url.replace("postgres://", "postgresql://", 1)
    return raw_url

def get_cors_origins() -> list[str]:
    cors_env = os.getenv("CORS_ORIGINS")
    if cors_env:
        cors_str = cors_env.strip()
        if cors_str.startswith("["):
            try:
                return json.loads(cors_str)
            except Exception:
                pass
        return [orig.strip() for orig in cors_str.split(",") if orig.strip()]
    return [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*"
    ]

class Settings(BaseModel):
    PROJECT_NAME: str = "Airline Passenger Satisfaction API"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    WEKA_ENGINE_URL: str = os.getenv("WEKA_ENGINE_URL", "http://127.0.0.1:8081")
    DATABASE_URL: str = get_database_url()
    CORS_ORIGINS: list[str] = get_cors_origins()

settings = Settings()
