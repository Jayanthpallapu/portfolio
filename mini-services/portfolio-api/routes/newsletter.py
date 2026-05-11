"""
Newsletter subscription API routes.
POST   /api/newsletter         — Subscribe to newsletter
GET    /api/newsletter          — List all subscribers (admin)
DELETE /api/newsletter/{id}     — Unsubscribe
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc

from database import get_db
from models import Newsletter
from schemas import NewsletterCreate, NewsletterResponse, MessageResponse

router = APIRouter(prefix="/api/newsletter", tags=["newsletter"])


@router.post("/", response_model=MessageResponse, status_code=201)
async def subscribe(
    subscription: NewsletterCreate,
    db: AsyncSession = Depends(get_db),
):
    """Subscribe an email to the newsletter."""
    # Check if already subscribed
    existing = await db.execute(
        select(Newsletter).where(Newsletter.email == subscription.email)
    )
    existing_sub = existing.scalar_one_or_none()

    if existing_sub:
        if existing_sub.is_active:
            raise HTTPException(status_code=409, detail="This email is already subscribed.")
        else:
            # Reactivate
            existing_sub.is_active = True
            existing_sub.source = subscription.source
            await db.commit()
            return MessageResponse(success=True, message="Welcome back! You've been resubscribed.")

    db_sub = Newsletter(
        email=subscription.email,
        source=subscription.source,
    )
    db.add(db_sub)
    await db.commit()

    return MessageResponse(success=True, message="Successfully subscribed to the newsletter!")


@router.get("/", response_model=list[NewsletterResponse])
async def list_subscribers(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    active_only: bool = Query(True),
    db: AsyncSession = Depends(get_db),
):
    """List all newsletter subscribers."""
    query = select(Newsletter)
    if active_only:
        query = query.where(Newsletter.is_active == True)
    query = query.order_by(desc(Newsletter.created_at)).offset(skip).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()


@router.get("/count")
async def get_subscriber_count(db: AsyncSession = Depends(get_db)):
    """Get total active subscriber count."""
    result = await db.execute(
        select(func.count(Newsletter.id)).where(Newsletter.is_active == True)
    )
    return {"active_subscribers": result.scalar()}


@router.delete("/{subscriber_id}", response_model=MessageResponse)
async def unsubscribe(subscriber_id: int, db: AsyncSession = Depends(get_db)):
    """Unsubscribe from the newsletter."""
    result = await db.execute(select(Newsletter).where(Newsletter.id == subscriber_id))
    sub = result.scalar_one_or_none()
    if not sub:
        raise HTTPException(status_code=404, detail="Subscription not found")

    sub.is_active = False
    await db.commit()
    return MessageResponse(success=True, message="Successfully unsubscribed.")
