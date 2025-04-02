import os
from fastapi import UploadFile
from app.config import settings
from typing import Optional
import uuid
from datetime import datetime, timedelta

class StorageService:
    def __init__(self):
        self.base_path = settings.local_storage_path
    
    async def save_file(self, file: UploadFile) -> tuple[str, str]:
        """Save file to local storage and return (filepath, filename)"""
        file_ext = os.path.splitext(file.filename)[1]
        filename = f"{uuid.uuid4()}{file_ext}"
        filepath = os.path.join(self.base_path, filename)
        
        with open(filepath, "wb") as buffer:
            buffer.write(await file.read())
        
        return filepath, filename
    
    async def generate_presigned_url(self, filename: str) -> str:
        """Simulate S3 presigned URL for local development"""
        return f"/api/files/{filename}"
    
    async def read_file_chunks(self, filepath: str, chunk_size: int = 8192):
        """Generator to read file in chunks"""
        with open(filepath, "rb") as file:
            while chunk := file.read(chunk_size):
                yield chunk

class S3StorageService(StorageService):
    """Placeholder for actual S3 implementation"""
    async def save_file(self, file: UploadFile) -> tuple[str, str]:
        raise NotImplementedError("S3 storage not implemented yet")
    
    async def generate_presigned_url(self, filename: str) -> str:
        raise NotImplementedError("S3 storage not implemented yet")

def get_storage_service():
    if settings.storage_type == "local":
        return StorageService()
    elif settings.storage_type == "s3":
        return S3StorageService()
    raise ValueError("Invalid storage type in configuration")
