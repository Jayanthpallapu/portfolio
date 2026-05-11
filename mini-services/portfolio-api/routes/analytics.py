"""
Analytics dashboard API routes.
GET /api/analytics — Get overall portfolio analytics
"""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc

from database import get_db
from models import Contact, Visitor, Newsletter, Project
from pinecone_service import get_pinecone_status

router = APIRouter(prefix="/api/analytics", tags=["analytics"])


@router.get("/")
async def get_analytics(db: AsyncSession = Depends(get_db)):
    """Get overall portfolio analytics dashboard data."""
    # Contacts
    total_contacts = await db.execute(select(func.count(Contact.id)))
    unread_contacts = await db.execute(select(func.count(Contact.id)).where(Contact.is_read == False))

    # Visitors
    total_visitors = await db.execute(select(func.count(Visitor.id)))

    # Newsletter
    total_subscribers = await db.execute(
        select(func.count(Newsletter.id)).where(Newsletter.is_active == True)
    )

    # Projects
    total_projects = await db.execute(select(func.count(Project.id)))

    # Recent contacts
    recent = await db.execute(
        select(Contact).order_by(desc(Contact.created_at)).limit(5)
    )
    recent_contacts = [
        {
            "id": c.id,
            "name": c.name,
            "email": c.email,
            "message": c.message[:100] + "..." if len(c.message) > 100 else c.message,
            "is_read": c.is_read,
            "created_at": c.created_at.isoformat() if c.created_at else None,
        }
        for c in recent.scalars().all()
    ]

    # Pinecone status
    pinecone = get_pinecone_status()

    return {
        "total_contacts": total_contacts.scalar() or 0,
        "unread_contacts": unread_contacts.scalar() or 0,
        "total_visitors": total_visitors.scalar() or 0,
        "total_subscribers": total_subscribers.scalar() or 0,
        "total_projects": total_projects.scalar() or 0,
        "recent_contacts": recent_contacts,
        "pinecone_status": pinecone,
    }
