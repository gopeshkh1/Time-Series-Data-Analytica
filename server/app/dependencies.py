from fastapi import Depends
from app.services.storage import get_storage_service

def get_storage_dependency():
    return Depends(get_storage_service)
