from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.database import ClinicalCase, CaseStatus
from app.services.diagnosis_service import DiagnosisService
from pydantic import BaseModel

router = APIRouter()
diagnosis_service = DiagnosisService()

class DiagnosisRequest(BaseModel):
    case_id: int

class QueryRequest(BaseModel):
    query: str

@router.post("/diagnosis")
def get_diagnosis(request: DiagnosisRequest, db: Session = Depends(get_db)):
    db_case = db.query(ClinicalCase).filter(ClinicalCase.id == request.case_id).first()
    if not db_case:
        raise HTTPException(status_code=404, detail="Case not found")
        
    if db_case.status == CaseStatus.COMPLETED and db_case.diagnosis:
        return {
            "diagnosis": db_case.diagnosis,
            "diagnostic_confidence": db_case.diagnostic_confidence,
            "recommended_tests": db_case.recommended_tests,
            "management_plan": db_case.management_plan,
            "guideline_references": db_case.guideline_references
        }
    
    patient = db_case.patient
    patient_data = {"age": patient.age, "sex": patient.sex}
    clinical_context = {"symptoms": db_case.symptoms, "labs": db_case.lab_results}
    
    result = diagnosis_service.generate_diagnosis(patient_data, clinical_context)
    
    # Save results to DB
    db_case.diagnosis = result["diagnosis"]
    db_case.diagnostic_confidence = result["diagnostic_confidence"]
    db_case.recommended_tests = result["recommended_tests"]
    db_case.management_plan = result["management_plan"]
    db_case.guideline_references = result["guideline_references"]
    db_case.status = CaseStatus.COMPLETED
    db.commit()
    
    return result

@router.get("/recommendations/{case_id}")
async def get_recommendations(case_id: int):
    return {
        "case_id": case_id,
        "recommendations": "Based on the diagnosis, we recommend starting empiric antibiotics..."
    }

@router.post("/query")
def query_guidelines(request: QueryRequest):
    try:
        # Append strict instructions for the LLM to format the response into beautiful, legible markdown
        formatting_instructions = "\n\n(IMPORTANT FORMATTING INSTRUCTION: Structure your response into clear and highly readable markdown. Always use properly spaced bullet points or numbered lists instead of bulk paragraphs, highlight key clinical criteria using bold text, and use line breaks frequently for readability. Never output a single block of dense text.)"
        
        enhanced_query = f"{request.query}{formatting_instructions}"
        response = diagnosis_service.rag.query_guidelines(enhanced_query)
        
        return {"response": str(response)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
