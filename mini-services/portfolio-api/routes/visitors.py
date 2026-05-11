"""
Visitor analytics API routes.
POST   /api/visitors          — Track a new visitor
GET    /api/visitors           — List visitor records (admin)
GET    /api/visitors/stats     — Get visitor statistics
"""

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc, distinct
from typing import Optional
from datetime import datetime, timedelta

from database import get_db
from models import Visitor
from schemas import VisitorCreate, VisitorResponse

router = APIRouter(prefix="/api/visitors", tags=["visitors"])


@router.post("/", response_model=VisitorResponse, status_code=201)
async def track_visitor(
    visitor: VisitorCreate,
    db: AsyncSession = Depends(get_db),
):
    """Track a new visitor or page visit."""
    db_visitor = Visitor(
        session_id=visitor.session_id,
        page=visitor.page,
        referrer=visitor.referrer,
        user_agent=visitor.user_agent,
        country=visitor.country,
        city=visitor.city,
        time_on_page=visitor.time_on_page,
    )
    db.add(db_visitor)
    await db.commit()
    await db.refresh(db_visitor)
    return db_visitor


@router.get("/", response_model=list[VisitorResponse])
async def list_visitors(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: AsyncSession = Depends(get_db),
):
    """List visitor records."""
    result = await db.execute(
        select(Visitor).order_by(desc(Visitor.created_at)).offset(skip).limit(limit)
    )
    return result.scalars().all()


@router.get("/stats")
async def get_visitor_stats(db: AsyncSession = Depends(get_db)):
    """Get visitor analytics statistics."""
    # Total visits
    total = await db.execute(select(func.count(Visitor.id)))
    total_visits = total.scalar() or 0

    # Unique sessions
    unique = await db.execute(select(func.count(distinct(Visitor.session_id))))
    unique_visitors = unique.scalar() or 0

    # Visits today
    today = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    today_q = await db.execute(select(func.count(Visitor.id)).where(Visitor.created_at >= today))
    visits_today = today_q.scalar() or 0

    # Visits this week
    week_ago = datetime.utcnow() - timedelta(days=7)
    week_q = await db.execute(select(func.count(Visitor.id)).where(Visitor.created_at >= week_ago))
    visits_this_week = week_q.scalar() or 0

    # Top pages
    top_pages = await db.execute(
        select(Visitor.page, func.count(Visitor.id).label("count"))
        .where(Visitor.page.isnot(None))
        .group_by(Visitor.page)
        .order_by(desc("count"))
        .limit(10)
    )
    pages = [{"page": row.page, "visits": row.count} for row in top_pages.all()]

    # Top countries
    top_countries = await db.execute(
        select(Visitor.country, func.count(Visitor.id).label("count"))
        .where(Visitor.country.isnot(None))
        .group_by(Visitor.country)
        .order_by(desc("count"))
        .limit(10)
    )
    countries = [{"country": row.country, "visits": row.count} for row in top_countries.all()]

    # Average time on page
    avg_time = await db.execute(
        select(func.avg(Visitor.time_on_page)).where(Visitor.time_on_page.isnot(None))
    )
    avg_time_on_page = round(avg_time.scalar() or 0, 2)

    return {
        "total_visits": total_visits,
        "unique_visitors": unique_visitors,
        "visits_today": visits_today,
        "visits_this_week": visits_this_week,
        "avg_time_on_page_seconds": avg_time_on_page,
        "top_pages": pages,
        "top_countries": countries,
    }
