import csv
from io import StringIO
import datetime
from app.services.db import get_db
from sqlalchemy.orm import Session
from app.models.csv_upload import Uploads, UploadsData, UploadsHeaderMetadata
from fastapi import APIRouter, UploadFile, File, HTTPException, Form, Depends
from app.models.schemas import FileUploadResponse
from dateutil import parser

router = APIRouter(prefix="/api/files", tags=["files"])

@router.post("/upload", response_model=FileUploadResponse)
async def upload_file(
    file: UploadFile = File(...),
    client_ip: str = Form(...),
    db: Session = Depends(get_db)):

    if not file.filename.lower().endswith('.csv'):
        raise HTTPException(400, detail="Only CSV files are accepted")

    try:
        content = await file.read()
        file_str = content.decode('utf-8')
        csv_reader = csv.DictReader(StringIO(file_str))

        upload = Uploads(
            upload_time=datetime.datetime.now(),
            file_name = file.filename.lower(),
            client_ip=client_ip
        )
        db.add(upload)
        await db.commit()
        db.refresh(upload)
        column_data_types = {}

        # Identify potential observation_time header
        observation_time_header = None
        for header in csv_reader.fieldnames:
            sample_value = next((row[header] for row in csv_reader if row[header].strip()), None)
            if sample_value:
                try:
                    parser.parse(sample_value)  # Try parsing to datetime
                    observation_time_header = header
                    break  # Use the first detected date column
                except ValueError:
                    continue

        if not observation_time_header:
            raise HTTPException(400, detail="No valid observation_time column found.")

        csv_reader = csv.DictReader(StringIO(file_str))

        for row in csv_reader:
            for header, value in row.items():
                if header == observation_time_header:
                    column_data_types[header] = 'timestamp'
                    continue
                if header not in column_data_types:
                    if value.isdigit():
                        column_data_types[header] = 'int'
                    elif value.replace('.', '', 1).isdigit() and value.count('.') < 2:
                        column_data_types[header] = 'float'
                    else: 
                        column_data_types[header] = 'str'
            try:
                observation_time_str = row[observation_time_header]
                observation_time = parser.parse(observation_time_str)
            except ValueError:
                # If the observation time is not valid, skip this row
                continue
            cleaned_row = {key: value for key, value in row.items() if value not in [None, '', 'null']}            
            data = cleaned_row
            if data:
                upload_data = UploadsData(
                    upload_id=upload.upload_id,
                    observation_time=observation_time,
                    data=data
                )
                db.add(upload_data)
        
        for header, data_type in column_data_types.items():
            header_metadata = UploadsHeaderMetadata(
                upload_id=upload.upload_id,
                header_name=header,
                data_type=data_type
            )
            db.add(header_metadata)

        await db.commit()

        return FileUploadResponse(
            upload_id=upload.upload_id,
            message="File uploaded and data inserted successfully"
        )
    except Exception as e:
        await db.rollback()
        print(e)
        raise HTTPException(500, detail=str(e))