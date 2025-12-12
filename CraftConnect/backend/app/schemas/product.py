from pydantic import BaseModel, Field, validator, field_validator
from typing import List, Optional, Dict
from datetime import datetime
from enum import Enum
import re

class ProductStatus(str, Enum):
    """Product visibility status"""
    DRAFT = "draft"
    PUBLIC = "public"
    PRIVATE = "private"
    ARCHIVED = "archived"

class ProductCategory(str, Enum):
    """Product categories for artisan crafts"""
    POTTERY = "pottery"
    TEXTILES = "textiles"
    WOODWORK = "woodwork"
    JEWELRY = "jewelry"
    METALWORK = "metalwork"
    PAINTING = "painting"
    SCULPTURE = "sculpture"
    LEATHER = "leather"
    GLASSWORK = "glasswork"
    OTHER = "other"

class ProductImage(BaseModel):
    """Product image data"""
    gcs_uri: str = Field(..., description="Google Cloud Storage URI")
    enhanced_uri: Optional[str] = Field(None, description="Enhanced image URI")
    is_primary: bool = Field(default=False, description="Primary product image")
    uploaded_at: datetime = Field(default_factory=datetime.utcnow)

    @field_validator('gcs_uri', 'enhanced_uri')
    @classmethod
    def validate_uri(cls, v: Optional[str]) -> Optional[str]:
        """Validate GCS URI or local storage URI format"""
        if v is None:
            return v
        # Allow both GCS URIs and local storage URIs
        if not (v.startswith('gs://') or v.startswith('/uploads/')):
            raise ValueError('URI must start with gs:// or /uploads/')
        return v

class ProductPricing(BaseModel):
    """Product pricing structure"""
    materials_cost: float = Field(..., ge=0, description="Cost of materials")
    labor_hours: float = Field(..., ge=0, description="Labor hours spent")
    suggested_price: Optional[float] = Field(None, ge=0, description="AI suggested price")
    final_price: Optional[float] = Field(None, ge=0, description="Final listing price")
    currency: str = Field(default="USD", description="Currency code")

    @field_validator('currency')
    @classmethod
    def validate_currency(cls, v: str) -> str:
        """Validate currency code"""
        if len(v) != 3 or not v.isalpha():
            raise ValueError('Currency must be a 3-letter code')
        return v.upper()

class ProductDimensions(BaseModel):
    """Product physical dimensions"""
    length_cm: Optional[float] = Field(None, ge=0, description="Length in cm")
    width_cm: Optional[float] = Field(None, ge=0, description="Width in cm")
    height_cm: Optional[float] = Field(None, ge=0, description="Height in cm")
    weight_g: Optional[float] = Field(None, ge=0, description="Weight in grams")

class ProductCreateRequest(BaseModel):
    """Request model for creating a new product"""
    title: str = Field(..., min_length=3, max_length=200, description="Product title")
    description: str = Field(..., min_length=10, max_length=5000, description="Product description")
    category: ProductCategory = Field(..., description="Product category")
    materials: List[str] = Field(default_factory=list, description="List of materials used")
    colors: List[str] = Field(default_factory=list, description="Primary colors")
    tags: List[str] = Field(default_factory=list, max_length=20, description="Product tags")
    story: Optional[str] = Field(None, max_length=10000, description="Artisan story")
    images: List[ProductImage] = Field(default_factory=list, description="Product images")
    pricing: Optional[ProductPricing] = Field(None, description="Pricing information")
    dimensions: Optional[ProductDimensions] = Field(None, description="Product dimensions")
    status: ProductStatus = Field(default=ProductStatus.DRAFT, description="Product status")

    @field_validator('title', 'description')
    @classmethod
    def sanitize_text(cls, v: str) -> str:
        """Sanitize text input to prevent XSS"""
        # Remove any HTML tags
        v = re.sub(r'<[^>]*>', '', v)
        # Remove script tags specifically
        v = re.sub(r'<script.*?</script>', '', v, flags=re.IGNORECASE | re.DOTALL)
        return v.strip()

    @field_validator('materials', 'colors', 'tags')
    @classmethod
    def validate_list_items(cls, v: List[str]) -> List[str]:
        """Validate and sanitize list items"""
        if not v:
            return v
        # Limit each item length
        validated = []
        for item in v[:20]:  # Max 20 items
            cleaned = re.sub(r'<[^>]*>', '', item).strip()
            if cleaned and len(cleaned) <= 50:
                validated.append(cleaned)
        return validated

class ProductUpdateRequest(BaseModel):
    """Request model for updating a product"""
    title: Optional[str] = Field(None, min_length=3, max_length=200)
    description: Optional[str] = Field(None, min_length=10, max_length=5000)
    category: Optional[ProductCategory] = None
    materials: Optional[List[str]] = None
    colors: Optional[List[str]] = None
    tags: Optional[List[str]] = None
    story: Optional[str] = Field(None, max_length=10000)
    images: Optional[List[ProductImage]] = None
    pricing: Optional[ProductPricing] = None
    dimensions: Optional[ProductDimensions] = None
    status: Optional[ProductStatus] = None

    @field_validator('title', 'description', 'story')
    @classmethod
    def sanitize_text(cls, v: Optional[str]) -> Optional[str]:
        """Sanitize text input"""
        if v is None:
            return v
        v = re.sub(r'<[^>]*>', '', v)
        v = re.sub(r'<script.*?</script>', '', v, flags=re.IGNORECASE | re.DOTALL)
        return v.strip()

    @field_validator('materials', 'colors', 'tags')
    @classmethod
    def validate_list_items(cls, v: Optional[List[str]]) -> Optional[List[str]]:
        """Validate and sanitize list items"""
        if v is None:
            return v
        validated = []
        for item in v[:20]:
            cleaned = re.sub(r'<[^>]*>', '', item).strip()
            if cleaned and len(cleaned) <= 50:
                validated.append(cleaned)
        return validated

class ProductResponse(BaseModel):
    """Response model for product data"""
    product_id: str
    user_id: str
    title: str
    description: str
    category: ProductCategory
    materials: List[str]
    colors: List[str]
    tags: List[str]
    story: Optional[str] = None
    images: List[ProductImage]
    pricing: Optional[ProductPricing] = None
    dimensions: Optional[ProductDimensions] = None
    status: ProductStatus
    created_at: datetime
    updated_at: datetime
    views_count: int = 0
    likes_count: int = 0

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class ProductListResponse(BaseModel):
    """Response model for product listing"""
    products: List[ProductResponse]
    total: int
    page: int
    page_size: int
    has_more: bool

class ProductStatsResponse(BaseModel):
    """Response model for product statistics"""
    total_products: int
    by_status: Dict[str, int]
    by_category: Dict[str, int]
    total_views: int
    total_likes: int
