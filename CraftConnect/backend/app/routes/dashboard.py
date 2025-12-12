from fastapi import APIRouter, HTTPException, status, Depends, Header
from typing import Optional
import logging

from app.schemas.dashboard import DashboardStatsResponse
from app.models.dashboard_model import dashboard_service

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])
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

@router.get(
    "/{user_id}",
    response_model=DashboardStatsResponse,
    summary="Get Dashboard Data",
    description="Get aggregated dashboard statistics for a user"
)
async def get_dashboard_data(
    user_id: str,
    requesting_user_id: str = Depends(require_auth)
) -> DashboardStatsResponse:
    """
    Get comprehensive dashboard data including:
    - Product statistics
    - Engagement metrics (views, likes)
    - Sales analytics
    - Top performing products
    - Recent activity
    
    **Authorization:**
    - Users can only view their own dashboard
    """
    # Verify ownership
    if requesting_user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Can only view your own dashboard"
        )

    try:
        dashboard_data = await dashboard_service.get_dashboard_data(user_id)
        return dashboard_data
    except Exception as e:
        logger.error(f"Failed to get dashboard data: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve dashboard data"
        )
