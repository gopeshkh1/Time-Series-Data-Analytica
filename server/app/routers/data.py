from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.services.db import get_db 
from app.models.csv_upload import UploadsData, UploadsHeaderMetadata
from app.models.schemas import CSVDataResponse, AxiosDataWrapper
from datetime import datetime
import asyncio

def to_dict(instance, exclude_fields=None):
    if exclude_fields is None:
        exclude_fields = []
    return {column.name: getattr(instance, column.name) for column in instance.__table__.columns if column.name not in exclude_fields}


router = APIRouter(prefix="/api/data", tags=["data"])

@router.get("/{upload_id}", response_model=AxiosDataWrapper[CSVDataResponse])
async def get_csv_data(
    upload_id: int,
    start_time: datetime | None = Query(None, description="Start time for the data range"),
    end_time: datetime | None = Query(None, description="End time for the data range"),
    db: AsyncSession = Depends(get_db)
):
    print(f"Fetching data for upload_id: {upload_id}, start_time: {start_time}, end_time: {end_time}")
    try:
        query_data = select(UploadsData).where(UploadsData.upload_id == upload_id)
        query_header = select(UploadsHeaderMetadata).where(UploadsHeaderMetadata.upload_id == upload_id)

        if start_time:
            query_data = query_data.filter(UploadsData.observation_time >= start_time)
        if end_time:
            query_data = query_data.filter(UploadsData.observation_time <= end_time)
        async with db.begin():
            data_result = await db.execute(query_data.order_by(UploadsData.observation_time))
            header_result = await db.execute(query_header)
        

        data = data_result.scalars().all()
        header_metadata = header_result.scalars().all()

        rows = [to_dict(item, 'upload_id') for item in data]
        header_metadata_dict = [to_dict(item, 'upload_id') for item in header_metadata]

        return AxiosDataWrapper(
            data=CSVDataResponse(rows=rows, headers=header_metadata_dict, total_rows=len(data)),
        )

    except Exception as e:
        print(f"Error fetching data: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching data from database: {str(e)}"
        )