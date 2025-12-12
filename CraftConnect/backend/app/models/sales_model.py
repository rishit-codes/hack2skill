import logging
from typing import Optional, Dict, Any
from datetime import datetime
import uuid

from app.cloud_services.database import get_database_client
from app.schemas.sales import SaleRecordRequest, SaleResponse, SalesAnalyticsResponse

logger = logging.getLogger(__name__)

class SalesService:
    def __init__(self):
        self.db = get_database_client()
        self.collection_name = "sales"
    
    async def record_sale(self, seller_id: str, sale_data: SaleRecordRequest) -> SaleResponse:
        """Record a new sale"""
        try:
            sale_id = str(uuid.uuid4())
            now = datetime.utcnow()
            
            sale_doc = {
                "sale_id": sale_id,
                "seller_id": seller_id,
                "product_id": sale_data.product_id,
                "buyer_email": sale_data.buyer_email,
                "amount": sale_data.amount,
                "currency": sale_data.currency,
                "status": "completed",
                "created_at": now,
                "updated_at": now
            }
            
            # Create sales table if not exists
            import sqlite3
            with sqlite3.connect(self.db.db_path) as conn:
                conn.execute("""
                    CREATE TABLE IF NOT EXISTS sales (
                        sale_id TEXT PRIMARY KEY,
                        seller_id TEXT NOT NULL,
                        product_id TEXT NOT NULL,
                        buyer_email TEXT NOT NULL,
                        amount REAL NOT NULL,
                        currency TEXT NOT NULL,
                        status TEXT NOT NULL,
                        created_at TEXT NOT NULL,
                        updated_at TEXT NOT NULL
                    )
                """)
                
                conn.execute("""
                    INSERT INTO sales 
                    (sale_id, seller_id, product_id, buyer_email, amount, currency, status, created_at, updated_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    sale_doc["sale_id"], sale_doc["seller_id"], sale_doc["product_id"],
                    sale_doc["buyer_email"], sale_doc["amount"], sale_doc["currency"],
                    sale_doc["status"], sale_doc["created_at"].isoformat(), sale_doc["updated_at"].isoformat()
                ))
                conn.commit()
            
            return SaleResponse(**sale_doc)
            
        except Exception as e:
            logger.error(f"Failed to record sale: {e}", exc_info=True)
            raise
    
    async def get_sale(self, sale_id: str, seller_id: str) -> Optional[SaleResponse]:
        """Get sale by ID with ownership verification"""
        try:
            import sqlite3
            with sqlite3.connect(self.db.db_path) as conn:
                conn.row_factory = sqlite3.Row
                cursor = conn.execute(
                    "SELECT * FROM sales WHERE sale_id = ? AND seller_id = ?",
                    (sale_id, seller_id)
                )
                row = cursor.fetchone()
                if row:
                    return SaleResponse(**dict(row))
            return None
            
        except Exception as e:
            logger.error(f"Failed to get sale: {e}", exc_info=True)
            return None
    
    async def get_sales_analytics(self, seller_id: str, timeframe: str) -> SalesAnalyticsResponse:
        """Get sales analytics for seller"""
        try:
            import sqlite3
            with sqlite3.connect(self.db.db_path) as conn:
                conn.row_factory = sqlite3.Row
                cursor = conn.execute(
                    "SELECT * FROM sales WHERE seller_id = ?",
                    (seller_id,)
                )
                sales = [dict(row) for row in cursor.fetchall()]
            
            total_sales = len(sales)
            total_revenue = sum(sale["amount"] for sale in sales)
            avg_order_value = total_revenue / total_sales if total_sales > 0 else 0
            
            return SalesAnalyticsResponse(
                total_sales=total_sales,
                total_revenue=total_revenue,
                average_order_value=avg_order_value,
                sales_by_status={"completed": total_sales},
                top_products=[],
                revenue_trend=[]
            )
            
        except Exception as e:
            logger.error(f"Failed to get analytics: {e}", exc_info=True)
            return SalesAnalyticsResponse(
                total_sales=0,
                total_revenue=0.0,
                average_order_value=0.0,
                sales_by_status={},
                top_products=[],
                revenue_trend=[]
            )

sales_service = SalesService()