"""
Contact form API routes.
POST   /api/contacts         — Submit a new contact message
GET    /api/contacts          — List all contacts (admin)
GET    /api/contacts/{id}     — Get a specific contact
PATCH  /api/contacts/{id}     — Update contact (mark read/replied)
DELETE /api/contacts/{id}     — Delete a contact
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc
from typing import Optional

from database import get_db
from models import Contact
from schemas import ContactCreate, ContactResponse, ContactUpdate, MessageResponse
from pinecone_service import upsert_vector

router = APIRouter(prefix="/api/contacts", tags=["contacts"])


@router.post("/", response_model=MessageResponse, status_code=201)
async def create_contact(
    contact: ContactCreate,
    db: AsyncSession = Depends(get_db),
):
    """Submit a new contact message from the portfolio website."""
    db_contact = Contact(
        name=contact.name,
        email=contact.email,
        message=contact.message,
        subject=contact.subject,
        source=contact.source,
    )
    db.add(db_contact)
    await db.commit()
    await db.refresh(db_contact)

    # Try to vectorize in Pinecone for semantic search
    await upsert_vector(
        id=f"contact_{db_contact.id}",
        text=f"{contact.name}: {contact.message}",
        metadata={
            "type": "contact",
            "name": contact.name,
            "email": contact.email,
            "subject": contact.subject or "",
        },
        namespace="portfolio",
    )

    return MessageResponse(
        success=True,
        message="Thank you for your message! I'll get back to you soon.",
    )


@router.get("/", response_model=list[ContactResponse])
async def list_contacts(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(50, ge=1, le=200, description="Max records to return"),
    is_read: Optional[bool] = Query(None, description="Filter by read status"),
    search: Optional[str] = Query(None, description="Search in name/email/message"),
    db: AsyncSession = Depends(get_db),
):
    """List all contact messages (admin endpoint)."""
    query = select(Contact)

    if is_read is not None:
        query = query.where(Contact.is_read == is_read)
    if search:
        search_term = f"%{search}%"
        query = query.where(
            (Contact.name.ilike(search_term))
            | (Contact.email.ilike(search_term))
            | (Contact.message.ilike(search_term))
        )

    query = query.order_by(desc(Contact.created_at)).offset(skip).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()


@router.get("/count")
async def get_contacts_count(db: AsyncSession = Depends(get_db)):
    """Get total and unread contact counts."""
    total = await db.execute(select(func.count(Contact.id)))
    unread = await db.execute(select(func.count(Contact.id)).where(Contact.is_read == False))
    return {"total": total.scalar(), "unread": unread.scalar()}


@router.get("/{contact_id}", response_model=ContactResponse)
async def get_contact(contact_id: int, db: AsyncSession = Depends(get_db)):
    """Get a specific contact by ID."""
    result = await db.execute(select(Contact).where(Contact.id == contact_id))
    contact = result.scalar_one_or_none()
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    return contact


@router.patch("/{contact_id}", response_model=ContactResponse)
async def update_contact(
    contact_id: int,
    update: ContactUpdate,
    db: AsyncSession = Depends(get_db),
):
    """Update a contact (mark as read/replied)."""
    result = await db.execute(select(Contact).where(Contact.id == contact_id))
    contact = result.scalar_one_or_none()
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")

    if update.is_read is not None:
        contact.is_read = update.is_read
    if update.is_replied is not None:
        contact.is_replied = update.is_replied

    await db.commit()
    await db.refresh(contact)
    return contact


@router.delete("/{contact_id}", response_model=MessageResponse)
async def delete_contact(contact_id: int, db: AsyncSession = Depends(get_db)):
    """Delete a contact message."""
    result = await db.execute(select(Contact).where(Contact.id == contact_id))
    contact = result.scalar_one_or_none()
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")

    await db.delete(contact)
    await db.commit()
    return MessageResponse(success=True, message="Contact deleted successfully")
