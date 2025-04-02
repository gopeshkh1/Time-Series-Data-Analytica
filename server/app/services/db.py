from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from app.config import settings
from asyncpg import create_pool

DATABASE_URL = settings.database_url
print(f"Connecting to database at {DATABASE_URL}")

engine = create_async_engine(DATABASE_URL, future=True, echo=True)

AsyncSessionLocal = sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)

Base = declarative_base()

# Function to get a session from AsyncSessionLocal
async def get_db():
    async with AsyncSessionLocal() as session:
        yield session