"""
Projects API routes.
POST   /api/projects           — Create a new project
GET    /api/projects            — List all projects
GET    /api/projects/{id}       — Get a specific project
PATCH  /api/projects/{id}       — Update a project
DELETE /api/projects/{id}       — Delete a project
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from typing import Optional

from database import get_db
from models import Project
from schemas import ProjectCreate, ProjectResponse, ProjectUpdate, MessageResponse
from pinecone_service import upsert_vector, delete_vector

router = APIRouter(prefix="/api/projects", tags=["projects"])


@router.post("/", response_model=ProjectResponse, status_code=201)
async def create_project(
    project: ProjectCreate,
    db: AsyncSession = Depends(get_db),
):
    """Create a new project entry."""
    db_project = Project(
        title=project.title,
        description=project.description,
        tech_stack=project.tech_stack,
        category=project.category,
        github_url=project.github_url,
        live_url=project.live_url,
        image_url=project.image_url,
        featured=project.featured,
        sort_order=project.sort_order,
    )
    db.add(db_project)
    await db.commit()
    await db.refresh(db_project)

    # Vectorize in Pinecone for semantic search
    await upsert_vector(
        id=f"project_{db_project.id}",
        text=f"{project.title}: {project.description} | Tech: {project.tech_stack or ''}",
        metadata={
            "type": "project",
            "title": project.title,
            "category": project.category or "",
            "tech_stack": project.tech_stack or "",
        },
        namespace="portfolio",
    )

    return db_project


@router.get("/", response_model=list[ProjectResponse])
async def list_projects(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    category: Optional[str] = Query(None, description="Filter by category"),
    featured: Optional[bool] = Query(None, description="Filter featured projects"),
    db: AsyncSession = Depends(get_db),
):
    """List all projects with optional filters."""
    query = select(Project)

    if category:
        query = query.where(Project.category == category)
    if featured is not None:
        query = query.where(Project.featured == featured)

    query = query.order_by(Project.sort_order, desc(Project.created_at)).offset(skip).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()


@router.get("/featured", response_model=list[ProjectResponse])
async def get_featured_projects(db: AsyncSession = Depends(get_db)):
    """Get all featured projects."""
    result = await db.execute(
        select(Project)
        .where(Project.featured == True)
        .order_by(Project.sort_order, desc(Project.created_at))
    )
    return result.scalars().all()


@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project(project_id: int, db: AsyncSession = Depends(get_db)):
    """Get a specific project by ID."""
    result = await db.execute(select(Project).where(Project.id == project_id))
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@router.patch("/{project_id}", response_model=ProjectResponse)
async def update_project(
    project_id: int,
    update: ProjectUpdate,
    db: AsyncSession = Depends(get_db),
):
    """Update a project entry."""
    result = await db.execute(select(Project).where(Project.id == project_id))
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    update_data = update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(project, field, value)

    await db.commit()
    await db.refresh(project)

    # Re-vectorize in Pinecone
    if update.description or update.title or update.tech_stack:
        await upsert_vector(
            id=f"project_{project.id}",
            text=f"{project.title}: {project.description} | Tech: {project.tech_stack or ''}",
            metadata={
                "type": "project",
                "title": project.title,
                "category": project.category or "",
                "tech_stack": project.tech_stack or "",
            },
            namespace="portfolio",
        )

    return project


@router.delete("/{project_id}", response_model=MessageResponse)
async def delete_project(project_id: int, db: AsyncSession = Depends(get_db)):
    """Delete a project."""
    result = await db.execute(select(Project).where(Project.id == project_id))
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    await db.delete(project)
    await db.commit()

    # Remove from Pinecone
    await delete_vector(id=f"project_{project_id}", namespace="portfolio")

    return MessageResponse(success=True, message="Project deleted successfully")
