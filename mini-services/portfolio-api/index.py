"""
Jayanth Portfolio FastAPI Backend
================================
A RESTful API backend for the portfolio website with:
- Contact form submissions
- Visitor analytics tracking
- Newsletter subscriptions
- Project management
- Pinecone vector search integration
- Analytics dashboard

Run: uvicorn index:app --host 0.0.0.0 --port 8000 --reload
"""

import os
import logging
from contextlib import asynccontextmanager
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

from database import init_db
from pinecone_service import init_pinecone

# Routes
from routes.contacts import router as contacts_router
from routes.visitors import router as visitors_router
from routes.newsletter import router as newsletter_router
from routes.projects import router as projects_router
from routes.analytics import router as analytics_router
from routes.search import router as search_router

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize database and Pinecone on startup."""
    logger.info("Starting Portfolio API...")
    await init_db()
    logger.info("Database initialized.")
    await init_pinecone()
    logger.info("Startup complete. API is ready.")
    yield
    logger.info("Shutting down Portfolio API...")


app = FastAPI(
    title="Jayanth Portfolio API",
    description="""
    Backend API for Jayanth Pallapu's portfolio website.

    ## Features
    - **Contacts**: Store and manage contact form submissions
    - **Visitors**: Track visitor analytics and page views
    - **Newsletter**: Manage email subscriptions
    - **Projects**: CRUD operations for portfolio projects
    - **Analytics**: Dashboard statistics
    - **Search**: Pinecone-powered semantic search

    ## Pinecone Integration
    Vector search is powered by Pinecone. Configure your API key in `.env`
    to enable semantic search capabilities.
    """,
    version="1.0.0",
    lifespan=lifespan,
)

# CORS — Allow the Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://preview-*.space.chatglm.site",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(contacts_router)
app.include_router(visitors_router)
app.include_router(newsletter_router)
app.include_router(projects_router)
app.include_router(analytics_router)
app.include_router(search_router)


@app.get("/", tags=["health"])
async def root():
    """Health check endpoint."""
    return {
        "service": "Jayanth Portfolio API",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs",
    }


@app.get("/health", tags=["health"])
async def health():
    """Detailed health check."""
    return {"status": "healthy", "database": "connected"}


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("index:app", host="0.0.0.0", port=port, reload=True)
