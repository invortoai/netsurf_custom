from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(title="NetSurf Direct Call Management API", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Define Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

class CallLog(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_email: str
    phone_number: str
    call_attempted: str
    pcap: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    status: str = "initiated"

class CallLogCreate(BaseModel):
    user_email: str
    phone_number: str
    call_attempted: str = "No"
    pcap: str = "netsurf"

# Authentication endpoints (for potential future use)
@api_router.post("/auth/login")
async def login(email: str, password: str):
    """
    Simple authentication endpoint (currently just validates domain)
    In production, this would validate against a proper user database
    """
    if not email.endswith("@netsurfdirect.com"):
        raise HTTPException(status_code=401, detail="Unauthorized domain")
    
    if password != "Invorto2025":
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    return {"status": "success", "message": "Login successful"}

# Call logging endpoints
@api_router.post("/calls/log", response_model=CallLog)
async def log_call(call_data: CallLogCreate):
    """
    Log a call attempt to the database
    """
    call_dict = call_data.dict()
    call_obj = CallLog(**call_dict)
    
    # Store in MongoDB
    await db.call_logs.insert_one(call_obj.dict())
    
    return call_obj

@api_router.get("/calls/logs", response_model=List[CallLog])
async def get_call_logs(user_email: Optional[str] = None, limit: int = 100):
    """
    Retrieve call logs, optionally filtered by user email
    """
    query = {}
    if user_email:
        query["user_email"] = user_email
    
    call_logs = await db.call_logs.find(query).limit(limit).sort("timestamp", -1).to_list(limit)
    return [CallLog(**log) for log in call_logs]

# Health check endpoints
@api_router.get("/")
async def root():
    return {"message": "NetSurf Direct Call Management API", "status": "running"}

@api_router.get("/health")
async def health_check():
    """
    Health check endpoint to verify API and database connectivity
    """
    try:
        # Test database connection
        await db.list_collection_names()
        return {
            "status": "healthy",
            "database": "connected",
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Database connection failed: {str(e)}")

# Legacy endpoints (keeping for compatibility)
@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)