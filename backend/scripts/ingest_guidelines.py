import os
import argparse
from app.services.rag_service import RAGService

def main():
    parser = argparse.ArgumentParser(description="Ingest guidelines into Qdrant")
    parser.add_argument("--folder", type=str, default="guidelines", help="Folder containing guideline PDFs")
    args = parser.parse_args()

    rag_service = RAGService()
    print(f"Starting ingestion from {args.folder}...")
    
    try:
        index = rag_service.ingest_guidelines(args.folder)
        print("Ingestion completed successfully.")
    except Exception as e:
        print(f"Error during ingestion: {e}")

if __name__ == "__main__":
    main()
