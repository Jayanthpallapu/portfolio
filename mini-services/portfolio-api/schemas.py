"""
Pydantic schemas for request/response validation.
"""

from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime


# ── Contact Schemas ──

class ContactCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100, description="Sender's name")
    email: str = Field(..., min_length=1, max_length=200, description="Sender's email")
    message: str = Field(..., min_length=1, max_length=5000, description="Message content")
    subject: Optional[str] = Field(None, max_length=300, description="Optional subject line")
    source: Optional[str] = Field("portfolio_website", max_length=50)


class ContactResponse(BaseModel):
    id: int
    name: str
    email: str
    message: str
    subject: Optional[str]
    is_read: bool
    is_replied: bool
    source: str
    created_at: datetime

    model_config = {"from_attributes": True}


class ContactUpdate(BaseModel):
    is_read: Optional[bool] = None
    is_replied: Optional[bool] = None


# ── Visitor Schemas ──

class VisitorCreate(BaseModel):
    session_id: Optional[str] = None
    page: Optional[str] = Field(None, max_length=200)
    referrer: Optional[str] = Field(None, max_length=500)
    user_agent: Optional[str] = Field(None, max_length=500)
    country: Optional[str] = None
    city: Optional[str] = None
    time_on_page: Optional[float] = None


class VisitorResponse(BaseModel):
    id: int
    session_id: Optional[str]
    page: Optional[str]
    referrer: Optional[str]
    country: Optional[str]
    city: Optional[str]
    time_on_page: Optional[float]
    created_at: datetime

    model_config = {"from_attributes": True}


# ── Newsletter Schemas ──

class NewsletterCreate(BaseModel):
    email: str = Field(..., min_length=1, max_length=200)
    source: Optional[str] = Field("portfolio_website", max_length=50)


class NewsletterResponse(BaseModel):
    id: int
    email: str
    is_active: bool
    source: str
    created_at: datetime

    model_config = {"from_attributes": True}


# ── Project Schemas ──

class ProjectCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: str = Field(..., min_length=1)
    tech_stack: Optional[str] = Field(None, max_length=500, description="Comma-separated technologies")
    category: Optional[str] = None
    github_url: Optional[str] = None
    live_url: Optional[str] = None
    image_url: Optional[str] = None
    featured: Optional[bool] = False
    sort_order: Optional[int] = 0


class ProjectResponse(BaseModel):
    id: int
    title: str
    description: str
    tech_stack: Optional[str]
    category: Optional[str]
    github_url: Optional[str]
    live_url: Optional[str]
    image_url: Optional[str]
    featured: bool
    sort_order: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    tech_stack: Optional[str] = None
    category: Optional[str] = None
    github_url: Optional[str] = None
    live_url: Optional[str] = None
    image_url: Optional[str] = None
    featured: Optional[bool] = None
    sort_order: Optional[int] = None


# ── Analytics Schemas ──

class AnalyticsResponse(BaseModel):
    total_contacts: int
    unread_contacts: int
    total_visitors: int
    total_subscribers: int
    total_projects: int
    recent_contacts: list[ContactResponse]


# ── Generic Response ──

class MessageResponse(BaseModel):
    success: bool
    message: str
