from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, JSON, Text, Enum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
import datetime
import enum

Base = declarative_base()

class CaseStatus(enum.Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"
    ARCHIVED = "archived"

class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    external_id = Column(String, unique=True, index=True)
    provider_id = Column(String, index=True, nullable=True) # Identity tie
    age = Column(Integer)
    sex = Column(String)
    comorbidities = Column(JSON) # List of strings or dict
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    cases = relationship("ClinicalCase", back_populates="patient")

class ClinicalCase(Base):
    __tablename__ = "clinical_cases"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"))
    symptoms = Column(JSON) # Dynamic answers
    lab_results = Column(JSON)
    imaging_findings = Column(Text)
    status = Column(Enum(CaseStatus), default=CaseStatus.PENDING)
    
    # AI Output
    diagnosis = Column(String)
    diagnostic_confidence = Column(String)
    recommended_tests = Column(JSON)
    management_plan = Column(Text)
    guideline_references = Column(JSON)
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    patient = relationship("Patient", back_populates="cases")
    audit_logs = relationship("AuditLog", back_populates="clinical_case")

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(Integer, ForeignKey("clinical_cases.id"))
    action = Column(String)
    details = Column(Text)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

    clinical_case = relationship("ClinicalCase", back_populates="audit_logs")
