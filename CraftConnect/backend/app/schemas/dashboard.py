from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime

class RecentActivity(BaseModel):
    """Recent activity item"""
    activity_id: str
    activity_type: str = Field(..., description="Type: view, sale, like, comment")
    description: str
    timestamp: datetime
    metadata: Optional[Dict[str, Any]] = None

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class DashboardStatsResponse(BaseModel):
    """Response model for dashboard statistics"""
    # Product stats
    total_products: int
    products_by_status: Dict[str, int]
    products_by_category: Dict[str, int]
    
    # Engagement stats
    total_views: int
    total_likes: int
    views_last_30_days: int
    likes_last_30_days: int
    
    # Sales stats (optional, if user has sales)
    total_sales: int = 0
    total_revenue: float = 0.0
    revenue_currency: str = "USD"
    sales_last_30_days: int = 0
    revenue_last_30_days: float = 0.0
    
    # Top performing products
    top_viewed_products: List[Dict[str, Any]] = []
    top_liked_products: List[Dict[str, Any]] = []
    top_selling_products: List[Dict[str, Any]] = []
    
    # Recent activity
    recent_activities: List[RecentActivity] = []
    
    # Performance metrics
    average_views_per_product: float = 0.0
    average_likes_per_product: float = 0.0
    conversion_rate: float = 0.0  # (sales / views) * 100
