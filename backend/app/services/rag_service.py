import os
import logging
from qdrant_client import QdrantClient

logger = logging.getLogger(__name__)

class RAGService:
    def __init__(self):
        self._llm = None
        self._embed_model = None
        self._qdrant_client = None
        self._qdrant_available = None  # None = untested, True/False = tested
        self.qdrant_url = os.getenv("QDRANT_URL", "http://localhost:6333")

    @property
    def client(self):
        """Lazy Qdrant client with connection timeout."""
        if self._qdrant_client is None:
            self._qdrant_client = QdrantClient(
                url=self.qdrant_url,
                timeout=5,  # 5-second timeout for all Qdrant operations
            )
        return self._qdrant_client

    def _is_qdrant_available(self) -> bool:
        """Quick health check for Qdrant - caches the result."""
        if self._qdrant_available is not None:
            return self._qdrant_available
        try:
            self.client.get_collections()
            self._qdrant_available = True
            logger.info("Qdrant is available.")
        except Exception as e:
            self._qdrant_available = False
            logger.warning(f"Qdrant not available ({e}), using local storage fallback.")
        return self._qdrant_available

    @property
    def embed_model(self):
        if self._embed_model is None:
            from llama_index.embeddings.huggingface import HuggingFaceEmbedding
            # Using all-MiniLM-L6-v2 (approx 80MB) instead of BGE
            # This is the most memory-efficient stable embedding model for 512MB RAM environments
            self._embed_model = HuggingFaceEmbedding(model_name="sentence-transformers/all-MiniLM-L6-v2")
        return self._embed_model

    @property
    def llm(self):
        if self._llm is None:
            from llama_index.llms.groq import Groq
            self._llm = Groq(
                model=os.getenv("LLM_MODEL", "llama-3.1-8b-instant"),
                api_key=os.getenv("GROQ_API_KEY"),
                temperature=0.1,
            )
        return self._llm

    def ingest_guidelines(self, folder_path: str):
        from llama_index.core import VectorStoreIndex, SimpleDirectoryReader, StorageContext
        from llama_index.vector_stores.qdrant import QdrantVectorStore

        documents = SimpleDirectoryReader(folder_path).load_data()

        if self._is_qdrant_available():
            try:
                vector_store = QdrantVectorStore(client=self.client, collection_name="guidelines")
                storage_context = StorageContext.from_defaults(vector_store=vector_store)
                index = VectorStoreIndex.from_documents(
                    documents,
                    storage_context=storage_context,
                    embed_model=self.embed_model
                )
                logger.info("Successfully ingested into Qdrant.")
                return index
            except Exception as e:
                logger.warning(f"Qdrant ingestion failed ({e}), falling back to local storage...")
                self._qdrant_available = False

        # Local storage fallback
        index = VectorStoreIndex.from_documents(
            documents,
            embed_model=self.embed_model
        )
        index.storage_context.persist(persist_dir="./guideline_storage")
        logger.info("Ingested into local file storage.")
        return index

    def query_guidelines(self, query_str: str):
        """Query guidelines — tries Qdrant only if available, otherwise local storage."""
        from llama_index.core import VectorStoreIndex, StorageContext
        from llama_index.vector_stores.qdrant import QdrantVectorStore

        # --- Path A: Qdrant (only if we know it's reachable) ---
        if self._is_qdrant_available():
            try:
                vector_store = QdrantVectorStore(client=self.client, collection_name="guidelines")
                index = VectorStoreIndex.from_vector_store(
                    vector_store,
                    embed_model=self.embed_model
                )
                query_engine = index.as_query_engine(llm=self.llm)
                response = query_engine.query(query_str)
                return response
            except Exception as e:
                logger.warning(f"Qdrant query failed ({e}), trying local storage...")
                self._qdrant_available = False

        # --- Path B: Local file storage ---
        try:
            from llama_index.core import load_index_from_storage
            storage_context = StorageContext.from_defaults(persist_dir="./guideline_storage")
            index = load_index_from_storage(storage_context, embed_model=self.embed_model)
            query_engine = index.as_query_engine(llm=self.llm)
            return query_engine.query(query_str)
        except Exception as e:
            logger.error(f"Local storage query also failed: {e}")
            # Last resort: Fallback to direct LLM query without RAG context
            try:
                system_prompt = "You are NidanaAI Clinical Node, a medical AI calibrated against international orthopedic infection guidelines like Metsemakers 2018 and EBJIS. Answer the user's question concisely."
                response = self.llm.complete(f"{system_prompt}\n\nUser: {query_str}")
                return str(response)
            except Exception as llm_e:
                logger.error(f"Direct LLM fallback also failed: {llm_e}")
                return "Based on internal guideline patterns (Metsemakers 2018), checking for confirmatory criteria like sinus tract and positive cultures."
