from fastapi import APIRouter, HTTPException, status
from datetime import timedelta
import logging

from app.schemas.auth import (
    UserRegisterRequest,
    UserLoginRequest,
    TokenResponse,
    UserResponse
)
from app.models.user_model import user_service
from app.utils.jwt_handler import jwt_handler, ACCESS_TOKEN_EXPIRE_MINUTES

router = APIRouter(prefix="/auth", tags=["Authentication"])
logger = logging.getLogger(__name__)

@router.post(
    "/register",
    response_model=TokenResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register New User",
    description="Create a new user account and return access token"
)
async def register(user_data: UserRegisterRequest) -> TokenResponse:
    """
    Register a new user account.
    
    **Security Features:**
    - Email validation
    - Password strength validation
    - Password hashing with bcrypt
    - Automatic login after registration
    """
    try:
        # Create user
        user = await user_service.create_user(user_data)
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User with this email already exists"
            )

        # Generate access token
        access_token = jwt_handler.create_access_token(
            user_id=user.user_id,
            email=user.email
        )

        return TokenResponse(
            access_token=access_token,
            token_type="bearer",
            expires_in=ACCESS_TOKEN_EXPIRE_MINUTES * 60,  # Convert to seconds
            user=user
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Registration failed: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Registration failed. Please try again."
        )

@router.post(
    "/login",
    response_model=TokenResponse,
    summary="User Login",
    description="Authenticate user and return access token"
)
async def login(login_data: UserLoginRequest) -> TokenResponse:
    """
    Authenticate user with email and password.
    
    **Returns:**
    - JWT access token
    - User information
    """
    try:
        # Authenticate user
        user = await user_service.authenticate_user(
            email=login_data.email,
            password=login_data.password
        )

        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Generate access token
        access_token = jwt_handler.create_access_token(
            user_id=user.user_id,
            email=user.email
        )

        return TokenResponse(
            access_token=access_token,
            token_type="bearer",
            expires_in=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            user=user
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Login failed: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Login failed. Please try again."
        )

@router.get(
    "/me",
    response_model=UserResponse,
    summary="Get Current User",
    description="Get current authenticated user information"
)
async def get_current_user(
    user_id: str = None  # Will be replaced with proper dependency
) -> UserResponse:
    """
    Get current user information from token.
    
    **Note:** This endpoint requires authentication middleware to be implemented.
    """
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )

    user = await user_service.get_user(user_id)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    return user
