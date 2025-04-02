from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import files, data
from app.config import settings

app = FastAPI(
    title=settings.app_name,
    version="1.0.0",
    description="API for CSV file upload and processing"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(files.router)
app.include_router(data.router)

@app.get("/")
async def root():
    return {"message": "CSV Upload API is running"}
