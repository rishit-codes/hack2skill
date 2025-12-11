import logging
from typing import List, Optional, Dict, Any
from datetime import datetime
import uuid

from google.cloud import firestore
from app.cloud_services.firestore_db import get_firestore_client
from app.schemas.product import (
    ProductCreateRequest,
    ProductUpdateRequest,
    ProductResponse,
    ProductStatus,
    ProductCategory
)

logger = logging.getLogger(__name__)

class ProductService:
    """Service layer for product management with security controls"""
    
    def __init__(self):
        self.db = get_firestore_client()
        self.collection_name = "products"
        
    def _generate_product_id(self) -> str:
        """Generate unique product ID"""
        return str(uuid.uuid4())
    
    def _sanitize_firestore_data(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Sanitize data for Firestore storage"""
        # Convert datetime objects to timestamps
        sanitized = {}
        for key, value in data.items():
            if isinstance(value, datetime):
                sanitized[key] = value
            elif isinstance(value, list):
                sanitized[key] = [
                    self._sanitize_firestore_data(item) if isinstance(item, dict) else item
                    for item in value
                ]
            elif isinstance(value, dict):
                sanitized[key] = self._sanitize_firestore_data(value)
            else:
                sanitized[key] = value
        return sanitized
    
    async def create_product(
        self, 
        user_id: str, 
        product_data: ProductCreateRequest
    ) -> ProductResponse:
        """
        Create a new product with security validations
        
        Args:
            user_id: Authenticated user ID (must be verified)
            product_data: Validated product data
            
        Returns:
            ProductResponse with created product data
            
        Raises:
            ValueError: If validation fails
            Exception: If database operation fails
        """
        try:
            # Generate unique product ID
            product_id = self._generate_product_id()
            
            # Prepare product document
            now = datetime.utcnow()
            product_doc = {
                "product_id": product_id,
                "user_id": user_id,  # Owner of the product
                "title": product_data.title,
                "description": product_data.description,
                "category": product_data.category.value,
                "materials": product_data.materials,
                "colors": product_data.colors,
                "tags": product_data.tags,
                "story": product_data.story,
                "images": [img.model_dump() for img in product_data.images],
                "pricing": product_data.pricing.model_dump() if product_data.pricing else None,
                "dimensions": product_data.dimensions.model_dump() if product_data.dimensions else None,
                "status": product_data.status.value,
                "created_at": now,
                "updated_at": now,
                "views_count": 0,
                "likes_count": 0,
            }
            
            # Sanitize data for Firestore
            sanitized_doc = self._sanitize_firestore_data(product_doc)
            
            # Store in Firestore
            doc_ref = self.db.collection(self.collection_name).document(product_id)
            doc_ref.set(sanitized_doc)
            
            logger.info(f"Product created successfully: {product_id} by user {user_id}")
            
            return ProductResponse(**product_doc)
            
        except Exception as e:
            logger.error(f"Failed to create product: {e}", exc_info=True)
            raise Exception(f"Product creation failed: {str(e)}")
    
    async def get_product(
        self, 
        product_id: str,
        requesting_user_id: Optional[str] = None
    ) -> Optional[ProductResponse]:
        """
        Get product by ID with authorization check
        
        Args:
            product_id: Product identifier
            requesting_user_id: ID of user requesting the product
            
        Returns:
            ProductResponse if found and authorized, None otherwise
        """
        try:
            doc_ref = self.db.collection(self.collection_name).document(product_id)
            doc = doc_ref.get()
            
            if not doc.exists:
                logger.warning(f"Product not found: {product_id}")
                return None
            
            product_data = doc.to_dict()
            
            # Authorization check: Only owner can view PRIVATE/DRAFT products
            if product_data["status"] in [ProductStatus.PRIVATE.value, ProductStatus.DRAFT.value]:
                if requesting_user_id != product_data["user_id"]:
                    logger.warning(
                        f"Unauthorized access attempt to product {product_id} "
                        f"by user {requesting_user_id}"
                    )
                    return None
            
            # Increment view count (non-blocking)
            if requesting_user_id != product_data["user_id"]:
                doc_ref.update({"views_count": firestore.Increment(1)})
            
            return ProductResponse(**product_data)
            
        except Exception as e:
            logger.error(f"Failed to get product {product_id}: {e}", exc_info=True)
            return None
    
    async def update_product(
        self,
        product_id: str,
        user_id: str,
        update_data: ProductUpdateRequest
    ) -> Optional[ProductResponse]:
        """
        Update product with ownership verification
        
        Args:
            product_id: Product to update
            user_id: User making the update (must be owner)
            update_data: Fields to update
            
        Returns:
            Updated ProductResponse or None if unauthorized
        """
        try:
            doc_ref = self.db.collection(self.collection_name).document(product_id)
            doc = doc_ref.get()
            
            if not doc.exists:
                logger.warning(f"Product not found for update: {product_id}")
                return None
            
            product_data = doc.to_dict()
            
            # Authorization: Only owner can update
            if product_data["user_id"] != user_id:
                logger.warning(
                    f"Unauthorized update attempt on product {product_id} "
                    f"by user {user_id}"
                )
                return None
            
            # Prepare update dict (only non-None fields)
            update_dict = {}
            for field, value in update_data.model_dump(exclude_none=True).items():
                if field == "images" and value is not None:
                    update_dict[field] = [img.model_dump() for img in value]
                elif field == "pricing" and value is not None:
                    update_dict[field] = value.model_dump()
                elif field == "dimensions" and value is not None:
                    update_dict[field] = value.model_dump()
                elif field == "category" and value is not None:
                    update_dict[field] = value.value
                elif field == "status" and value is not None:
                    update_dict[field] = value.value
                else:
                    update_dict[field] = value
            
            # Always update timestamp
            update_dict["updated_at"] = datetime.utcnow()
            
            # Sanitize and update
            sanitized_update = self._sanitize_firestore_data(update_dict)
            doc_ref.update(sanitized_update)
            
            # Fetch updated document
            updated_doc = doc_ref.get().to_dict()
            
            logger.info(f"Product updated successfully: {product_id}")
            return ProductResponse(**updated_doc)
            
        except Exception as e:
            logger.error(f"Failed to update product {product_id}: {e}", exc_info=True)
            return None
    
    async def delete_product(
        self,
        product_id: str,
        user_id: str
    ) -> bool:
        """
        Soft delete product (set to ARCHIVED)
        
        Args:
            product_id: Product to delete
            user_id: User requesting deletion (must be owner)
            
        Returns:
            True if deleted, False otherwise
        """
        try:
            doc_ref = self.db.collection(self.collection_name).document(product_id)
            doc = doc_ref.get()
            
            if not doc.exists:
                return False
            
            product_data = doc.to_dict()
            
            # Authorization: Only owner can delete
            if product_data["user_id"] != user_id:
                logger.warning(
                    f"Unauthorized delete attempt on product {product_id} "
                    f"by user {user_id}"
                )
                return False
            
            # Soft delete: set status to ARCHIVED
            doc_ref.update({
                "status": ProductStatus.ARCHIVED.value,
                "updated_at": datetime.utcnow()
            })
            
            logger.info(f"Product archived successfully: {product_id}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to delete product {product_id}: {e}", exc_info=True)
            return False
    
    async def list_products(
        self,
        user_id: Optional[str] = None,
        status: Optional[ProductStatus] = None,
        category: Optional[ProductCategory] = None,
        page: int = 1,
        page_size: int = 20
    ) -> tuple[List[ProductResponse], int]:
        """
        List products with filtering and pagination
        
        Args:
            user_id: Filter by user (shows all their products)
            status: Filter by status
            category: Filter by category
            page: Page number (1-indexed)
            page_size: Items per page (max 100)
            
        Returns:
            Tuple of (products list, total count)
        """
        try:
            # Security: Limit page size
            page_size = min(page_size, 100)
            offset = (page - 1) * page_size
            
            # Build query
            query = self.db.collection(self.collection_name)
            
            # If user_id provided, show all their products
            if user_id:
                query = query.where("user_id", "==", user_id)
            else:
                # Public listing: only show PUBLIC products
                query = query.where("status", "==", ProductStatus.PUBLIC.value)
            
            if status and not user_id:
                query = query.where("status", "==", status.value)
            
            if category:
                query = query.where("category", "==", category.value)
            
            # Order by creation date (newest first)
            query = query.order_by("created_at", direction=firestore.Query.DESCENDING)
            
            # Get total count
            total = len(query.get())
            
            # Apply pagination
            query = query.limit(page_size).offset(offset)
            
            # Execute query
            docs = query.get()
            products = [ProductResponse(**doc.to_dict()) for doc in docs]
            
            return products, total
            
        except Exception as e:
            logger.error(f"Failed to list products: {e}", exc_info=True)
            return [], 0
    
    async def get_user_stats(self, user_id: str) -> Dict[str, Any]:
        """Get statistics for user's products"""
        try:
            query = self.db.collection(self.collection_name).where("user_id", "==", user_id)
            docs = query.get()
            
            stats = {
                "total_products": 0,
                "by_status": {},
                "by_category": {},
                "total_views": 0,
                "total_likes": 0
            }
            
            for doc in docs:
                data = doc.to_dict()
                stats["total_products"] += 1
                
                # Count by status
                status = data.get("status", "draft")
                stats["by_status"][status] = stats["by_status"].get(status, 0) + 1
                
                # Count by category
                category = data.get("category", "other")
                stats["by_category"][category] = stats["by_category"].get(category, 0) + 1
                
                # Aggregate views and likes
                stats["total_views"] += data.get("views_count", 0)
                stats["total_likes"] += data.get("likes_count", 0)
            
            return stats
            
        except Exception as e:
            logger.error(f"Failed to get user stats: {e}", exc_info=True)
            return {
                "total_products": 0,
                "by_status": {},
                "by_category": {},
                "total_views": 0,
                "total_likes": 0
            }

# Create singleton instance
product_service = ProductService()
