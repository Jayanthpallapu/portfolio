"""
SQLAlchemy models for the Portfolio API.
Tables: contacts, visitors, newsletter, projects
"""

from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, Float
from sqlalchemy.sql import func
from database import Base


class Contact(Base):
    """Stores contact form submissions from portfolio visitors."""
    __tablename__ = "contacts"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(200), nullable=False)
    message = Column(Text, nullable=False)
    subject = Column(String(300), nullable=True)
    is_read = Column(Boolean, default=False, nullable=False)
    is_replied = Column(Boolean, default=False, nullable=False)
    source = Column(String(50), default="portfolio_website", nullable=False)
    ip_address = Column(String(50), nullable=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)


class Visitor(Base):
    """Tracks visitor analytics on the portfolio site."""
    __tablename__ = "visitors"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String(100), nullable=True, index=True)
    page = Column(String(200), nullable=True)
    referrer = Column(String(500), nullable=True)
    user_agent = Column(String(500), nullable=True)
    country = Column(String(100), nullable=True)
    city = Column(String(100), nullable=True)
    ip_address = Column(String(50), nullable=True)
    time_on_page = Column(Float, nullable=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)


class Newsletter(Base):
    """Stores newsletter subscription emails."""
    __tablename__ = "newsletter"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(200), nullable=False, unique=True)
    is_active = Column(Boolean, default=True, nullable=False)
    source = Column(String(50), default="portfolio_website", nullable=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)


class Project(Base):
    """Stores project data for the portfolio (also vectorized for Pinecone)."""
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    tech_stack = Column(String(500), nullable=True)  # comma-separated
    category = Column(String(100), nullable=True)
    github_url = Column(String(500), nullable=True)
    live_url = Column(String(500), nullable=True)
    image_url = Column(String(500), nullable=True)
    featured = Column(Boolean, default=False, nullable=False)
    sort_order = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)
