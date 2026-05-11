"""
Pinecone vector search API routes.
GET  /api/search           — Semantic search across portfolio data
GET  /api/search/status    — Get Pinecone connection status
POST /api/search/index     — Re-index all data into Pinecone
"""

from fastapi import APIRouter, Query
from typing import Optional

from pinecone_service import search_vectors, get_pinecone_status, upsert_vector

router = APIRouter(prefix="/api/search", tags=["search"])


@router.get("/status")
async def pinecone_status():
    """Get the current Pinecone connection and configuration status."""
    return get_pinecone_status()


@router.get("/")
async def semantic_search(
    q: str = Query(..., min_length=1, description="Search query"),
    top_k: int = Query(5, ge=1, le=20, description="Number of results"),
    type: Optional[str] = Query(None, description="Filter by type: contact, project, skill"),
):
    """
    Perform semantic search across all portfolio data stored in Pinecone.
    Requires Pinecone API key to be configured.
    """
    filter_dict = {}
    if type:
        filter_dict["type"] = type

    results = await search_vectors(
        query=q,
        top_k=top_k,
        namespace="portfolio",
        filter_dict=filter_dict if filter_dict else None,
    )
    return results
