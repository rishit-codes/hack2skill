from pydantic import BaseModel, Field, field_validator
from typing import Optional
from datetime import datetime
from enum import Enum

class SaleStatus(str, Enum):
    """Sale status"""
    PENDING = "pending"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    REFUNDED = "refunded"

class SaleRecordRequest(BaseModel):
    """Request model for recording a sale"""
    product_id: str = Field(..., description="Product ID that was sold")
    buyer_name: str = Field(..., min_length=2, max_length=100, description="Buyer name")
    buyer_email: Optional[str] = Field(None, description="Buyer email")
    buyer_phone: Optional[str] = Field(None, description="Buyer phone")
    amount: float = Field(..., gt=0, description="Sale amount")
    currency: str = Field(default="USD", description="Currency code")
    quantity: int = Field(default=1, gt=0, description="Quantity sold")
    payment_method: Optional[str] = Field(None, description="Payment method used")
    notes: Optional[str] = Field(None, max_length=500, description="Additional notes")

    @field_validator('currency')
    @classmethod
    def validate_currency(cls, v: str) -> str:
        """Validate currency code"""
        if len(v) != 3 or not v.isalpha():
            raise ValueError('Currency must be a 3-letter code')
        return v.upper()

class SaleResponse(BaseModel):
    """Response model for sale data"""
    sale_id: str
    seller_id: str
    product_id: str
    buyer_name: str
    buyer_email: Optional[str] = None
    buyer_phone: Optional[str] = None
    amount: float
    currency: str
    quantity: int
    payment_method: Optional[str] = None
    status: SaleStatus
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class SalesAnalyticsResponse(BaseModel):
    """Response model for sales analytics"""
    total_sales: int = Field(..., description="Total number of sales")
    total_revenue: float = Field(..., description="Total revenue")
    currency: str = Field(..., description="Currency code")
    average_order_value: float = Field(..., description="Average order value")
    total_items_sold: int = Field(..., description="Total items sold")
    sales_by_status: dict = Field(..., description="Sales count by status")
    top_products: list = Field(..., description="Top selling products")
    revenue_trend: list = Field(..., description="Revenue over time")
    period: str = Field(..., description="Time period of analytics")

class SaleUpdateRequest(BaseModel):
    """Request model for updating a sale"""
    status: Optional[SaleStatus] = None
    notes: Optional[str] = Field(None, max_length=500)
