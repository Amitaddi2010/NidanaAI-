from app.services.rag_service import RAGService
from app.services.pageindex_service import PageIndexService
import json

class DiagnosisService:
    def __init__(self):
        self.rag = RAGService()
        self.pageindex = PageIndexService()

    def generate_diagnosis(self, patient_data: dict, clinical_context: dict):
        # 1. Construct prompt
        prompt = f"""
        Act as a senior orthopedic surgeon. Based on the following patient data:
        {json.dumps(patient_data)}
        And clinical context:
        {json.dumps(clinical_context)}
        
        Using clinical guidelines (FRI Metsemakers 2018, MSIS PJI, ICM 2018):
        - Analyze the data
        - Determine if infection is confirmed, unlikely, or equivocal
        - Provide diagnostic confidence
        - Recommend further tests
        - Suggest a management plan
        
        Return ONLY valid JSON in the following format:
        {{
            "diagnosis": "...",
            "diagnostic_confidence": "...",
            "recommended_tests": [...],
            "management_plan": "...",
            "guideline_references": [...]
        }}
        """
        
        # 2. Query RAG for specific guidelines context
        guideline_context = self.rag.query_guidelines("Diagnostic criteria for FRI and PJI and management protocols")
        
        # 3. Request LLM
        full_prompt = f"Guidelines Context:\n{str(guideline_context)}\n\nUser Query:\n{prompt}"
        response = self.rag.llm.complete(full_prompt)
        
        try:
            # Attempt to parse JSON from the response
            content = str(response)
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0].strip()
            elif "{" in content:
                 content = content[content.find("{"):content.rfind("}")+1]
            
            return json.loads(content)
        except Exception as e:
            print(f"Failed to parse LLM response: {e}")
            return {
                "diagnosis": "Analysis Error",
                "diagnostic_confidence": "N/A",
                "recommended_tests": ["Repeat clinical assessment"],
                "management_plan": "The AI reasoning system encountered a formatting error. Please review primary guidelines.",
                "guideline_references": ["System Error"]
            }
