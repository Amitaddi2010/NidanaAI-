from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.database import Patient, ClinicalCase, CaseStatus, Base
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter()

class PatientCreate(BaseModel):
    external_id: str
    age: int
    sex: str
    provider_id: Optional[str] = "Anonymous"
    comorbidities: Optional[List[str]] = []

@router.post("/patients")
async def create_patient(patient: PatientCreate, db: Session = Depends(get_db)):
    db_patient = Patient(
        external_id=patient.external_id,
        provider_id=patient.provider_id,
        age=patient.age,
        sex=patient.sex,
        comorbidities=patient.comorbidities
    )
    db.add(db_patient)
    db.commit()
    db.refresh(db_patient)
    
    # Create initial clinical case
    db_case = ClinicalCase(patient_id=db_patient.id, status=CaseStatus.PENDING)
    db.add(db_case)
    db.commit()
    db.refresh(db_case)
    
    return {"message": "Patient created successfully", "patient_id": db_patient.id, "case_id": db_case.id}

class SymptomEntry(BaseModel):
    case_id: int
    symptoms: dict

@router.post("/symptoms")
async def enter_symptoms(entry: SymptomEntry, db: Session = Depends(get_db)):
    db_case = db.query(ClinicalCase).filter(ClinicalCase.id == entry.case_id).first()
    if not db_case:
        raise HTTPException(status_code=404, detail="Case not found")
    db_case.symptoms = entry.symptoms
    db.commit()
    return {"message": "Symptoms recorded"}

class LabResults(BaseModel):
    case_id: int
    results: dict

@router.post("/lab-results")
async def upload_lab_results(results: LabResults, db: Session = Depends(get_db)):
    db_case = db.query(ClinicalCase).filter(ClinicalCase.id == results.case_id).first()
    if not db_case:
        raise HTTPException(status_code=404, detail="Case not found")
    db_case.lab_results = results.results
    db.commit()
    return {"message": "Lab results uploaded"}

@router.get("/patients")
async def get_patients(provider_id: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(ClinicalCase).join(Patient).order_by(ClinicalCase.created_at.desc())
    if provider_id:
        query = query.filter(Patient.provider_id == provider_id)
        
    cases = query.all()
    history = []
    for c in cases:
        patient = c.patient
        status_text = c.diagnosis if c.diagnosis else "Requires Review"
        ui_type = "warning"
        
        if c.diagnosis:
            if "Confirmed" in c.diagnosis or "Infection Confirmed" in c.diagnosis:
                ui_type = "danger"
            elif "Unlikely" in c.diagnosis or "Healthy" in c.diagnosis:
                ui_type = "success"
                
        history.append({
            "id": str(c.id),
            "mrn": patient.external_id,
            "name": f"Patient {patient.external_id.split('-')[-1]}" if '-' in patient.external_id else "Anonymous",
            "age": patient.age,
            "sex": patient.sex,
            "date": c.created_at.strftime("%Y-%m-%d"),
            "status": status_text,
            "confidence": c.diagnostic_confidence if c.diagnostic_confidence else "N/A",
            "type": ui_type
        })
    return history

@router.put("/cases/{case_id}/archive")
async def archive_case(case_id: int, db: Session = Depends(get_db)):
    db_case = db.query(ClinicalCase).filter(ClinicalCase.id == case_id).first()
    if not db_case:
        raise HTTPException(status_code=404, detail="Case not found")
        
    db_case.status = CaseStatus.ARCHIVED
    db.commit()
    return {"message": "Case successfully archived", "case_id": case_id}

