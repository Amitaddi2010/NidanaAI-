import os
from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.database.session import init_db, get_db
from sqlalchemy.orm import Session
from app.models.database import Patient, ClinicalCase
import logging

app = FastAPI(title="NidanaAI API", version="0.1.0")

# CORS Configuration - MUST be defined early
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "https://nidana-ai-ndey.vercel.app",
        "https://nidanaai.vercel.app",
    ],
    allow_origin_regex="https://.*\.vercel\.app", # Support Vercel preview URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    init_db()

from typing import Optional

# Stats Endpoint
@app.get("/api/v1/stats")
async def get_dashboard_stats(provider_id: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(ClinicalCase).join(Patient)
    if provider_id:
        query = query.filter(Patient.provider_id == provider_id)
        
    total_cases = query.count()
    active_cases = query.filter(ClinicalCase.status != "completed").count()
    pending_cases = query.filter(ClinicalCase.status == "pending").count()
    
    return {
        "active_cases": active_cases,
        "pending_diagnosis": pending_cases,
        "total_cases": total_cases,
        "system_confidence": "94%"
    }

@app.get("/")
async def root():
    return {"message": "Welcome to NidanaAI Clinical Decision Support System"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Future imports for routers
from app.api import patient, diagnosis
app.include_router(patient.router, prefix="/api/v1")
app.include_router(diagnosis.router, prefix="/api/v1")
