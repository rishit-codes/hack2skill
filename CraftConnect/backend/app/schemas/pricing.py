from pydantic import BaseModel, Field
from typing import Optional

class PriceSuggestionRequest(BaseModel):
    materials_cost: float = Field(..., gt=0, description="Cost of raw materials in INR.")
    labor_hours: float = Field(..., gt=0, description="Total hours of labor.")
    category: str = Field(..., description="Product category for finding comparables.", examples=["pottery", "textiles"])

class PriceSuggestionResponse(BaseModel):
    suggested_price: float
    min_price: Optional[float] = None
    max_price: Optional[float] = None
    explanation: Optional[str] = Field(None, description="AI-generated explanation for the price range.")
    confidence: Optional[str] = Field(None, description="The confidence level of the suggestion (Low, Medium, High).")
    price_breakdown: Optional[dict] = None