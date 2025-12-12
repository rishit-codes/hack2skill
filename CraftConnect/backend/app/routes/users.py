from fastapi import APIRouter, HTTPException, status, Depends, Header
from typing import Optional
import logging

from app.schemas.auth import UserResponse, UserUpdateRequest
from app.models.user_model import user_service

router = APIRouter(prefix="/users", tags=["Users"])
logger = logging.getLogger(__name__)

# TODO: Replace with actual authentication middleware
async def get_current_user_id(authorization: Optional[str] = Header(None)) -> Optional[str]:
    """
    Temporary authentication placeholder
    Extract user_id from Authorization header
    """
    if authorization and authorization.startswith("Bearer "):
        token = authorization.replace("Bearer ", "")
        # In production: verify JWT and extract user_id
        from app.utils.jwt_handler import jwt_handler
        user_id = jwt_handler.get_user_id_from_token(token)
        return user_id
    return None

async def require_auth(user_id: Optional[str] = Depends(get_current_user_id)) -> str:
    """Require authentication - raises 401 if not authenticated"""
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user_id

@router.get(
    "/{user_id}",
    response_model=UserResponse,
    summary="Get User Profile",
    description="Get user profile information"
)
async def get_user_profile(
    user_id: str,
    requesting_user_id: Optional[str] = Depends(get_current_user_id)
) -> UserResponse:
    """
    Get user profile by ID.
    
    **Public Access:**
    - Anyone can view basic user profiles
    - Full details visible only to profile owner
    """
    user = await user_service.get_user(user_id)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # If not the owner, hide sensitive information
    if requesting_user_id != user_id:
        # Hide phone and other sensitive data for non-owners
        user.phone = None
    
    return user

@router.put(
    "/{user_id}",
    response_model=UserResponse,
    summary="Update User Profile",
    description="Update user profile information. Only owner can update."
)
async def update_user_profile(
    user_id: str,
    update_data: UserUpdateRequest,
    requesting_user_id: str = Depends(require_auth)
) -> UserResponse:
    """
    Update user profile with ownership verification.
    
    **Security:**
    - Requires authentication
    - Users can only update their own profile
    """
    # Verify ownership
    if requesting_user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Can only update your own profile"
        )
    
    user = await user_service.update_user(user_id, update_data)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return user
