import os
from pydantic_settings import SettingsConfigDict, BaseSettings
from typing import Optional

# Compute absolute path to app/.env
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
env_file_path = os.path.join(base_dir, ".env")

class Setting(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=(env_file_path, ".env"),
        extra="ignore"
    )
    DATABASE_URL: str = "sqlite:///./safeher.db"
    SECRET_KEY: str = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
    ALGORITHM: str = "HS256"
    EXP_TIME: int = 30
    
    # otp ke liye
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USERNAME: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    SMTP_FROM_EMAIL: Optional[str] = None


setting = Setting()