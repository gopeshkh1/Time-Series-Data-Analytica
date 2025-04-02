from pydantic_settings import BaseSettings
from pydantic import Field

from pathlib import Path
import os

class Settings(BaseSettings):
    app_name: str = "CSV Upload API"
    storage_type: str = "local"
    local_storage_path: str = "uploads"
    max_file_size: int = 10_000_000
    db_host: str = Field(..., env="DB_HOST")
    db_user: str = Field(..., env="DB_USER")
    db_password: str = Field(..., env="DB_PASSWORD")
    db_name: str = Field(..., env="DB_NAME")
    
    @property
    def database_url(self) -> str:
        return f"postgresql+asyncpg://{self.db_user}:{self.db_password}@{self.db_host}/{self.db_name}"
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"

settings = Settings()
Path(settings.local_storage_path).mkdir(exist_ok=True)