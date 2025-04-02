from sqlalchemy import Column, Integer, DateTime, JSON, String, ForeignKey, PrimaryKeyConstraint
from app.services.db import Base
import datetime

class Uploads(Base):
    __tablename__ = "uploads"
    upload_id = Column(Integer, primary_key=True, index=True)
    upload_time = Column(DateTime, default=datetime.datetime.now)
    file_name = Column(String(255))
    client_ip = Column(String(15))

class UploadsData(Base):
    __tablename__ = "uploads_data"
    upload_id = Column(Integer, ForeignKey('uploads.upload_id'))
    observation_time = Column(DateTime, nullable=False)
    data = Column(JSON)
    
    __table_args__ = (
        PrimaryKeyConstraint('upload_id', 'observation_time'),
    )

class UploadsHeaderMetadata(Base):
    __tablename__ = 'uploads_header_metadata'
    upload_id = Column(Integer, ForeignKey('uploads.upload_id'))
    header_name = Column(String, index=True)
    data_type = Column(String)

    __table_args__ = (
        PrimaryKeyConstraint('upload_id', 'header_name'),
    )