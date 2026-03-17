# NidanaAI | CDSS for Orthopedic Infections

An AI-powered clinical decision support system for diagnosing and managing Fracture-Related Infection (FRI) and Prosthetic Joint Infection (PJI), based on international surgical guidelines.

## Features
- **Guideline-Driven AI**: Reasoning engine powered by LlamaIndex and Qwen2.5-72B.
- **RAG Implementation**: Searchable vector database (Qdrant) containing official clinical guidelines.
- **Premium UI**: Sleek, glassmorphic React dashboard for surgical data management.
- **Clinical Data Entry**: Multi-step forms for symptoms, labs, and history.
- **Diagnostic Reports**: AI-generated reports with evidence-based reasoning and management plans.

## Technical Stack
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: FastAPI (Python 3.11), SQLAlchemy, PostgreSQL
- **AI/RAG**: LlamaIndex, Qdrant, vLLM
- **Deployment**: Docker, Docker Compose

## Quick Start
1. **Clone the repository**:
   ```bash
   git clone <repo-url>
   cd NidanaAI
   ```

2. **Environment Setup**:
   Copy `.env.example` to `.env` (included in root).

3. **Deploy with Docker**:
   ```bash
   docker-compose up --build
   ```
   *Access the platform at http://localhost:3001*

4. **Ingest Guidelines**:
   ```bash
   docker-compose exec backend python scripts/ingest_guidelines.py --folder app/guidelines
   ```

## Guideline Sources
- FRI Consensus Definition (Metsemakers 2018)
- MSIS Prosthetic Joint Infection criteria
- ICM 2018 PJI guidelines
- IDSA PJI treatment guidelines

## Development
To run locally without Docker:
- **Backend**: `cd backend && pip install -r requirements.txt && uvicorn app.main:app --reload`
- **Frontend**: `cd frontend && npm install && npm run dev`
