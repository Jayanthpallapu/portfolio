"""
Pinecone vector database service.
Handles embedding storage and semantic search for portfolio data.

To activate:
1. Set PINECONE_API_KEY in .env
2. Set PINECONE_INDEX_NAME in .env
3. The service will auto-initialize when the API starts
"""

import os
import logging
from typing import Optional

logger = logging.getLogger(__name__)

# Pinecone is optional — the API works fine without it
_pinecone_client = None
_index = None
_initialized = False


def get_pinecone_status() -> dict:
    """Return current Pinecone connection status."""
    return {
        "initialized": _initialized,
        "api_key_set": bool(os.getenv("PINECONE_API_KEY") and os.getenv("PINECONE_API_KEY") != "your-pinecone-api-key-here"),
        "index_name": os.getenv("PINECONE_INDEX_NAME", "portfolio-data"),
        "region": os.getenv("PINECONE_REGION", "us-east-1"),
    }


async def init_pinecone():
    """Initialize Pinecone client and connect to index."""
    global _pinecone_client, _index, _initialized

    api_key = os.getenv("PINECONE_API_KEY")
    index_name = os.getenv("PINECONE_INDEX_NAME", "portfolio-data")
    region = os.getenv("PINECONE_REGION", "us-east-1")

    if not api_key or api_key == "your-pinecone-api-key-here":
        logger.warning("Pinecone API key not configured. Vector search features will be disabled.")
        _initialized = False
        return

    try:
        from pinecone import Pinecone

        _pinecone_client = Pinecone(api_key=api_key)

        # Check if index exists, create if not
        existing_indexes = [idx.name for idx in _pinecone_client.list_indexes()]
        if index_name not in existing_indexes:
            logger.info(f"Creating Pinecone index: {index_name}")
            _pinecone_client.create_index(
                name=index_name,
                dimension=1536,  # OpenAI text-embedding-3-small dimension
                metric="cosine",
                spec={
                    "serverless": {
                        "cloud": "aws",
                        "region": region,
                    }
                },
            )
            logger.info(f"Pinecone index '{index_name}' created successfully.")
        else:
            logger.info(f"Pinecone index '{index_name}' already exists.")

        _index = _pinecone_client.Index(index_name)
        _initialized = True
        logger.info("Pinecone initialized successfully!")

    except Exception as e:
        logger.error(f"Failed to initialize Pinecone: {e}")
        _initialized = False


async def upsert_vector(
    id: str,
    text: str,
    metadata: dict,
    namespace: str = "portfolio",
):
    """
    Store a text vector in Pinecone.
    When Pinecone is configured, this will generate embeddings and store them.
    For now, it prepares the structure for when embeddings are added.
    """
    global _index, _initialized

    if not _initialized or _index is None:
        logger.warning("Pinecone not initialized. Skipping vector upsert.")
        return {"status": "skipped", "reason": "pinecone_not_configured"}

    try:
        # Placeholder embedding — replace with actual embedding generation
        # when you integrate OpenAI or another embedding provider
        # Example: embedding = openai.embeddings.create(input=text, model="text-embedding-3-small")
        import hashlib
        dummy_embedding = [0.0] * 1536  # Will be replaced with real embeddings

        _index.upsert(
            vectors=[
                {
                    "id": id,
                    "values": dummy_embedding,
                    "metadata": {**metadata, "text": text},
                }
            ],
            namespace=namespace,
        )
        logger.info(f"Vector upserted: {id}")
        return {"status": "success", "id": id}

    except Exception as e:
        logger.error(f"Failed to upsert vector: {e}")
        return {"status": "error", "reason": str(e)}


async def search_vectors(
    query: str,
    top_k: int = 5,
    namespace: str = "portfolio",
    filter_dict: Optional[dict] = None,
):
    """
    Perform semantic search across stored vectors.
    When Pinecone is configured with embeddings, this returns relevant results.
    """
    global _index, _initialized

    if not _initialized or _index is None:
        logger.warning("Pinecone not initialized. Skipping vector search.")
        return {"status": "skipped", "reason": "pinecone_not_configured", "results": []}

    try:
        # Placeholder — replace with actual query embedding
        dummy_embedding = [0.0] * 1536

        query_params = {
            "vector": dummy_embedding,
            "top_k": top_k,
            "namespace": namespace,
            "include_metadata": True,
        }
        if filter_dict:
            query_params["filter"] = filter_dict

        results = _index.query(**query_params)
        return {"status": "success", "results": results.get("matches", [])}

    except Exception as e:
        logger.error(f"Failed to search vectors: {e}")
        return {"status": "error", "reason": str(e), "results": []}


async def delete_vector(id: str, namespace: str = "portfolio"):
    """Delete a vector from Pinecone by ID."""
    global _index, _initialized

    if not _initialized or _index is None:
        return {"status": "skipped", "reason": "pinecone_not_configured"}

    try:
        _index.delete(ids=[id], namespace=namespace)
        return {"status": "success", "id": id}
    except Exception as e:
        logger.error(f"Failed to delete vector: {e}")
        return {"status": "error", "reason": str(e)}
