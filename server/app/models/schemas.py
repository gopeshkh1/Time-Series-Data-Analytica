from typing import TypeVar, Generic, List, Any
from pydantic import BaseModel

T = TypeVar('T')

class FileUploadResponse(BaseModel):
    upload_id: int
    message: str | None = None

class AxiosDataWrapper(BaseModel, Generic[T]):
    data: T

class CSVDataResponse(BaseModel):
    rows : List[dict[str, Any]]
    headers: List[dict[str, str]]
    total_rows: int
