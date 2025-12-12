from fastapi import APIRouter, HTTPException, status, Depends, Query, Header
from typing import Optional, List
import logging

from app.schemas.product import (
    ProductCreateRequest,
    ProductUpdateRequest,
    ProductResponse,
    ProductListResponse,
    ProductStatsResponse,
    ProductStatus,
    ProductCategory
)
from app.models.product_model import product_service

router = APIRouter(prefix="/products", tags=["Products"])
logger = logging.getLogger(__name__)

# TODO: Replace with actual authentication middleware
async def get_current_user_id(authorization: Optional[str] = Header(None)) -> Optional[str]:
    """
    Temporary authentication placeholder
    
    In production, this should:
    1. Verify JWT token from Authorization header
    2. Extract and return user_id from token
    3. Raise HTTPException if unauthorized
    
    For now, returns a mock user_id from header or None
    """
    if authorization and authorization.startswith("Bearer "):
        # Extract mock user ID from bearer token
        # In production: verify JWT and extract user_id
        return authorization.replace("Bearer ", "")
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

@router.post(
    "",
    response_model=ProductResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create New Product",
    description="Create a new product listing. Requires authentication."
)
async def create_product(
    product_data: ProductCreateRequest,
    user_id: str = Depends(require_auth)
) -> ProductResponse:
    """
    Create a new product owned by the authenticated user.
    
    **Security Features:**
    - Requires authentication
    - Input validation via Pydantic
    - XSS prevention through text sanitization
    - Auto-assigns owner (user_id) to prevent spoofing
    """
    try:
        product = await product_service.create_product(user_id, product_data)
        return product
    except Exception as e:
        logger.error(f"Product creation failed: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create product"
        )

@router.get(
    "/{product_id}",
    response_model=ProductResponse,
    summary="Get Product Details",
    description="Get detailed information about a specific product"
)
async def get_product(
    product_id: str,
    user_id: Optional[str] = Depends(get_current_user_id)
) -> ProductResponse:
    """
    Retrieve product details with authorization checks.
    
    **Authorization Rules:**
    - PUBLIC products: Anyone can view
    - PRIVATE/DRAFT products: Only owner can view
    - Increments view count (except for owner)
    """
    product = await product_service.get_product(product_id, user_id)
    
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found or access denied"
        )
    
    return product

@router.put(
    "/{product_id}",
    response_model=ProductResponse,
    summary="Update Product",
    description="Update product details. Only owner can update."
)
async def update_product(
    product_id: str,
    update_data: ProductUpdateRequest,
    user_id: str = Depends(require_auth)
) -> ProductResponse:
    """
    Update product with ownership verification.
    
    **Security Features:**
    - Requires authentication
    - Ownership verification
    - Partial updates supported
    - Input sanitization
    """
    product = await product_service.update_product(product_id, user_id, update_data)
    
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found or unauthorized"
        )
    
    return product

@router.delete(
    "/{product_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete Product",
    description="Soft delete (archive) a product. Only owner can delete."
)
async def delete_product(
    product_id: str,
    user_id: str = Depends(require_auth)
):
    """
    Soft delete product by setting status to ARCHIVED.
    
    **Security:**
    - Requires authentication
    - Ownership verification
    - Soft delete (data retained)
    """
    success = await product_service.delete_product(product_id, user_id)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found or unauthorized"
        )
    
    return None

@router.get(
    "",
    response_model=ProductListResponse,
    summary="List Products",
    description="List products with filtering and pagination"
)
async def list_products(
    user_id: Optional[str] = Depends(get_current_user_id),
    owner_id: Optional[str] = Query(None, description="Filter by owner user ID"),
    status: Optional[ProductStatus] = Query(None, description="Filter by status"),
    category: Optional[ProductCategory] = Query(None, description="Filter by category"),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page")
) -> ProductListResponse:
    """
    List products with flexible filtering.
    
    **Filtering Rules:**
    - No owner_id: Returns PUBLIC products only
    - With owner_id: Returns all products owned by that user (if requesting user is owner)
    - Status/Category filters applied as specified
    
    **Pagination:**
    - Max page_size: 100
    - Returns total count for pagination UI
    """
    # If filtering by owner and user is authenticated as that owner,
    # show all their products. Otherwise, public only.
    filter_user_id = None
    if owner_id:
        if user_id == owner_id:
            filter_user_id = owner_id
        else:
            # If requesting someone else's products, only show PUBLIC
            filter_user_id = None
            status = ProductStatus.PUBLIC
    
    products, total = await product_service.list_products(
        user_id=filter_user_id,
        status=status,
        category=category,
        page=page,
        page_size=page_size
    )
    
    has_more = (page * page_size) < total
    
    return ProductListResponse(
        products=products,
        total=total,
        page=page,
        page_size=page_size,
        has_more=has_more
    )

@router.get(
    "/users/{user_id}/stats",
    response_model=ProductStatsResponse,
    summary="Get User Product Statistics",
    description="Get statistics for a user's products"
)
async def get_user_product_stats(
    user_id: str,
    requesting_user_id: str = Depends(require_auth)
) -> ProductStatsResponse:
    """
    Get product statistics for a specific user.
    
    **Authorization:**
    - Users can only view their own stats
    - Returns 403 if trying to view another user's stats
    """
    if requesting_user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Can only view your own statistics"
        )
    
    stats = await product_service.get_user_stats(user_id)
    return ProductStatsResponse(**stats)

@router.post(
    "/{product_id}/like",
    status_code=status.HTTP_200_OK,
    summary="Like/Unlike Product",
    description="Toggle like on a product"
)
async def toggle_product_like(
    product_id: str,
    user_id: str = Depends(require_auth)
):
    """
    Toggle like on a product.
    
    **Returns:**
    - liked: Boolean indicating if product is now liked
    - likes_count: Total likes for the product
    """
    result = await product_service.toggle_like(product_id, user_id)
    
    if result is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    return result

@router.get(
    "/search",
    response_model=ProductListResponse,
    summary="Search Products",
    description="Search products by title, description, or tags"
)
async def search_products(
    q: str = Query(..., min_length=1, description="Search query"),
    category: Optional[ProductCategory] = Query(None, description="Filter by category"),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page")
) -> ProductListResponse:
    """
    Search for products.
    
    **Search includes:**
    - Product title
    - Product description
    - Product tags
    
    **Only PUBLIC products are searchable**
    """
    products, total = await product_service.search_products(
        query=q,
        category=category,
        page=page,
        page_size=page_size
    )
    
    has_more = (page * page_size) < total
    
    return ProductListResponse(
        products=products,
        total=total,
        page=page,
        page_size=page_size,
        has_more=has_more
    )
