from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from uuid import UUID

class Merchant(BaseModel):
    legal_name: str
    dba_name: str
    federal_tax_id: str
    address: str
    industry: str
    annual_revenue: float

class Owner(BaseModel):
    name: str
    ssn: str
    address: str
    date_of_birth: datetime
    ownership_percentage: float

class FundingDetails(BaseModel):
    amount_requested: float
    use_of_funds: str

class Document(BaseModel):
    id: UUID
    document_type: str
    storage_url: str
    uploaded_at: datetime

class Application(BaseModel):
    id: UUID
    email_id: UUID
    received_at: datetime
    status: str
    processed_by: Optional[UUID]
    merchant: Merchant
    owners: List[Owner]
    funding_details: FundingDetails
    documents: List[Document]

# HUMAN ASSISTANCE NEEDED
# The confidence level for the Application class is 0.8, which is at the threshold.
# Please review the Application class to ensure all fields are correctly defined
# and that the relationships between classes are properly established.
# Consider adding any additional validation or methods if necessary.