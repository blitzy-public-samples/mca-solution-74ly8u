from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from uuid import uuid4
from datetime import datetime
from enum import Enum as PyEnum

Base = declarative_base()

class ApplicationStatus(PyEnum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"

class DocumentType(PyEnum):
    BANK_STATEMENT = "BANK_STATEMENT"
    TAX_RETURN = "TAX_RETURN"
    BUSINESS_LICENSE = "BUSINESS_LICENSE"
    IDENTIFICATION = "IDENTIFICATION"

class UserRole(PyEnum):
    ADMIN = "ADMIN"
    PROCESSOR = "PROCESSOR"
    VIEWER = "VIEWER"

class Application(Base):
    __tablename__ = 'applications'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid4()))
    email_id = Column(String(36), nullable=False)
    received_at = Column(DateTime, default=datetime.utcnow)
    status = Column(Enum(ApplicationStatus), default=ApplicationStatus.PENDING)
    processed_by = Column(String(36), ForeignKey('users.id'))

    merchant = relationship("Merchant", back_populates="application", uselist=False)
    owners = relationship("Owner", back_populates="application")
    funding_details = relationship("FundingDetails", back_populates="application", uselist=False)
    documents = relationship("Document", back_populates="application")

class Merchant(Base):
    __tablename__ = 'merchants'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid4()))
    application_id = Column(String(36), ForeignKey('applications.id'), nullable=False)
    legal_name = Column(String(255), nullable=False)
    dba_name = Column(String(255))
    federal_tax_id = Column(String(20), nullable=False)
    address = Column(String(255), nullable=False)
    industry = Column(String(100), nullable=False)
    annual_revenue = Column(Float, nullable=False)

    application = relationship("Application", back_populates="merchant")

class Owner(Base):
    __tablename__ = 'owners'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid4()))
    application_id = Column(String(36), ForeignKey('applications.id'), nullable=False)
    name = Column(String(255), nullable=False)
    ssn = Column(String(11), nullable=False)
    address = Column(String(255), nullable=False)
    date_of_birth = Column(DateTime, nullable=False)
    ownership_percentage = Column(Float, nullable=False)

    application = relationship("Application", back_populates="owners")

class FundingDetails(Base):
    __tablename__ = 'funding_details'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid4()))
    application_id = Column(String(36), ForeignKey('applications.id'), nullable=False)
    amount_requested = Column(Float, nullable=False)
    use_of_funds = Column(String(255), nullable=False)

    application = relationship("Application", back_populates="funding_details")

class Document(Base):
    __tablename__ = 'documents'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid4()))
    application_id = Column(String(36), ForeignKey('applications.id'), nullable=False)
    document_type = Column(Enum(DocumentType), nullable=False)
    storage_url = Column(String(255), nullable=False)
    uploaded_at = Column(DateTime, default=datetime.utcnow)

    application = relationship("Application", back_populates="documents")

class User(Base):
    __tablename__ = 'users'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid4()))
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), nullable=False)

class Webhook(Base):
    __tablename__ = 'webhooks'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid4()))
    url = Column(String(255), nullable=False)
    secret_key = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)