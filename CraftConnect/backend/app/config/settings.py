import os
import pathlib
from typing import Optional
     
from pydantic_settings import BaseSettings, SettingsConfigDict

BACKEND_DIR = pathlib.Path(__file__).resolve().parent.parent.parent
ENV_FILE_PATH = BACKEND_DIR / ".env"

class Settings(BaseSettings):
    # Database settings
    DATABASE_URL: str = "sqlite:///./craftconnect.db"
    
    # Optional Google Cloud settings (for when available)
    PROJECT_ID: Optional[str] = None
    GOOGLE_APPLICATION_CREDENTIALS: Optional[str] = None
    GEMINI_MODEL: Optional[str] = None
    GEMINI_MODEL_ID: str = "gemini-1.5-flash"
    FIRESTORE_DB: Optional[str] = None
    BUCKET_NAME: Optional[str] = None
    
    # Alternative AI settings
    OPENAI_API_KEY: Optional[str] = None
    HUGGINGFACE_API_KEY: Optional[str] = None
    
    # Other settings
    EMBEDDING_MODEL_ID: str = "text-embedding-004"
    TRANSLATION_QA_THRESHOLD: float = 0.85
    EMBEDDING_REGION: str = "us-central1"
    REGION: Optional[str] = None
    FIRESTORE_EMULATOR_HOST: Optional[str] = None

    model_config = SettingsConfigDict(
        env_file=ENV_FILE_PATH,
        env_file_encoding='utf-8',
        extra='ignore'
    )

settings = Settings()

# Set the environment variable for Google credentials if available
if settings.GOOGLE_APPLICATION_CREDENTIALS:
    os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = settings.GOOGLE_APPLICATION_CREDENTIALS