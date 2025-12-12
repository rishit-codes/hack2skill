import logging
from typing import Dict, Any
from app.cloud_services.database import get_database_client
from app.schemas.dashboard import DashboardStatsResponse

logger = logging.getLogger(__name__)

class DashboardService:
    def __init__(self):
        self.db = get_database_client()
    
    async def get_dashboard_data(self, user_id: str) -> DashboardStatsResponse:
        """Get dashboard statistics for user"""
        try:
            # Get product stats
            products = self.db.query_collection("products", "user_id = ?", (user_id,))
            
            product_stats = {
                "total_products": len(products),
                "total_views": sum(p.get("views_count", 0) for p in products),
                "total_likes": sum(p.get("likes_count", 0) for p in products)
            }
            
            # Get sales stats
            import sqlite3
            sales_stats = {"total_sales": 0, "total_revenue": 0.0}
            try:
                with sqlite3.connect(self.db.db_path) as conn:
                    cursor = conn.execute("SELECT COUNT(*), SUM(amount) FROM sales WHERE seller_id = ?", (user_id,))
                    row = cursor.fetchone()
                    if row:
                        sales_stats["total_sales"] = row[0] or 0
                        sales_stats["total_revenue"] = row[1] or 0.0
            except:
                pass
            
            return DashboardStatsResponse(
                product_count=product_stats["total_products"],
                total_views=product_stats["total_views"],
                total_likes=product_stats["total_likes"],
                total_sales=sales_stats["total_sales"],
                total_revenue=sales_stats["total_revenue"],
                recent_activity=[],
                top_products=products[:5] if products else []
            )
            
        except Exception as e:
            logger.error(f"Failed to get dashboard data: {e}", exc_info=True)
            return DashboardStatsResponse(
                product_count=0,
                total_views=0,
                total_likes=0,
                total_sales=0,
                total_revenue=0.0,
                recent_activity=[],
                top_products=[]
            )

dashboard_service = DashboardService()