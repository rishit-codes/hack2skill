from fastapi import APIRouter, HTTPException, status, Depends, Header, Query
from typing import Optional
import logging

from app.schemas.sales import (
    SaleRecordRequest,
    SaleResponse,
    SalesAnalyticsResponse
)
from app.models.sales_model import sales_service

router = APIRouter(prefix="/sales", tags=["Sales"])
logger = logging.getLogger(__name__)

# TODO: Replace with actual authentication middleware
async def get_current_user_id(authorization: Optional[str] = Header(None)) -> Optional[str]:
    """Extract user_id from Authorization header"""
    if authorization and authorization.startswith("Bearer "):
        token = authorization.replace("Bearer ", "")
        from app.utils.jwt_handler import jwt_handler
        user_id = jwt_handler.get_user_id_from_token(token)
        return user_id
    return None

async def require_auth(user_id: Optional[str] = Depends(get_current_user_id)) -> str:
    """Require authentication"""
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user_id

@router.post(
    "/record",
    response_model=SaleResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Record Sale",
    description="Record a new product sale"
)
async def record_sale(
    sale_data: SaleRecordRequest,
    seller_id: str = Depends(require_auth)
) -> SaleResponse:
    """
    Record a new sale.
    
    **Security:**
    - Requires authentication
    - Seller ID automatically assigned from auth token
    """
    try:
        sale = await sales_service.record_sale(seller_id, sale_data)
        return sale
    except Exception as e:
        logger.error(f"Failed to record sale: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to record sale"
        )

@router.get(
    "/{sale_id}",
    response_model=SaleResponse,
    summary="Get Sale Details",
    description="Get details of a specific sale"
)
async def get_sale(
    sale_id: str,
    seller_id: str = Depends(require_auth)
) -> SaleResponse:
    """
    Get sale details with ownership verification.
    
    **Authorization:**
    - Only seller can view their own sales
    """
    sale = await sales_service.get_sale(sale_id, seller_id)
    
    if not sale:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sale not found or access denied"
        )
    
    return sale

@router.get(
    "/analytics",
    response_model=SalesAnalyticsResponse,
    summary="Get Sales Analytics",
    description="Get aggregated sales analytics for authenticated seller"
)
async def get_sales_analytics(
    timeframe: str = Query("30d", description="Time period: 7d, 30d, 90d, 1y"),
    seller_id: str = Depends(require_auth)
) -> SalesAnalyticsResponse:
    """
    Get sales analytics including revenue, trends, and top products.
    
    **Metrics Provided:**
    - Total sales and revenue
    - Average order value
    - Sales by status
    - Top products
    - Revenue trend over time
    """
    try:
        analytics = await sales_service.get_sales_analytics(seller_id, timeframe)
        return analytics
    except Exception as e:
        logger.error(f"Failed to get analytics: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve analytics"
        )
