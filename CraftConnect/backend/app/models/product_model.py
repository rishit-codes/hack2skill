import logging
from typing import List, Optional, Dict, Any
from datetime import datetime
import uuid

# Database operations handled by custom SQLite client
from app.cloud_services.database import get_database_client
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
        self.db = get_database_client()
        self.collection_name = "products"
        
    def _generate_product_id(self) -> str:
        """Generate unique product ID"""
        return str(uuid.uuid4())
    

    
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
            
            # Store in database
            self.db.set_document(self.collection_name, product_id, product_doc)
            
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
            product_data = self.db.get_document(self.collection_name, product_id)
            
            if not product_data:
                logger.warning(f"Product not found: {product_id}")
                return None
            
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
                current_views = product_data.get("views_count", 0)
                self.db.update_document(self.collection_name, product_id, {"views_count": current_views + 1})
            
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
            product_data = self.db.get_document(self.collection_name, product_id)
            
            if not product_data:
                logger.warning(f"Product not found for update: {product_id}")
                return None
            
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
                    # Handle both Pydantic models and dicts
                    update_dict[field] = value.model_dump() if hasattr(value, 'model_dump') else value
                elif field == "dimensions" and value is not None:
                    # Handle both Pydantic models and dicts
                    update_dict[field] = value.model_dump() if hasattr(value, 'model_dump') else value
                elif field == "category" and value is not None:
                    update_dict[field] = value.value
                elif field == "status" and value is not None:
                    update_dict[field] = value.value
                else:
                    update_dict[field] = value
            
            # Always update timestamp
            update_dict["updated_at"] = datetime.utcnow()
            
            # Update in database
            self.db.update_document(self.collection_name, product_id, update_dict)
            
            # Fetch updated document
            updated_doc = self.db.get_document(self.collection_name, product_id)
            
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
            product_data = self.db.get_document(self.collection_name, product_id)
            
            if not product_data:
                return False
            
            # Authorization: Only owner can delete
            if product_data["user_id"] != user_id:
                logger.warning(
                    f"Unauthorized delete attempt on product {product_id} "
                    f"by user {user_id}"
                )
                return False
            
            # Soft delete: set status to ARCHIVED
            self.db.update_document(self.collection_name, product_id, {
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
            
            # Build query conditions
            where_conditions = []
            params = []
            
            # If user_id provided, show all their products
            if user_id:
                where_conditions.append("user_id = ?")
                params.append(user_id)
            else:
                # Public listing: only show PUBLIC products
                where_conditions.append("status = ?")
                params.append(ProductStatus.PUBLIC.value)
            
            if status and not user_id:
                where_conditions.append("status = ?")
                params.append(status.value)
            
            if category:
                where_conditions.append("category = ?")
                params.append(category.value)
            
            where_clause = " AND ".join(where_conditions) if where_conditions else ""
            
            # Get all matching products
            all_products = self.db.query_collection(self.collection_name, where_clause, tuple(params))
            
            # Sort by creation date (newest first)
            all_products.sort(key=lambda x: x.get("created_at", ""), reverse=True)
            
            total = len(all_products)
            
            # Apply pagination
            paginated_data = all_products[offset:offset + page_size]
            products = [ProductResponse(**data) for data in paginated_data]
            
            return products, total
            
        except Exception as e:
            logger.error(f"Failed to list products: {e}", exc_info=True)
            return [], 0
    
    async def toggle_like(
        self,
        product_id: str,
        user_id: str
    ) -> Optional[Dict[str, Any]]:
        """
        Toggle like on a product by a user
        
        Args:
            product_id: Product to like/unlike
            user_id: User performing the action
            
        Returns:
            Dict with {'liked': bool, 'likes_count': int} or None if product not found
        """
        try:
            # Get product data
            product_data = self.db.get_document(self.collection_name, product_id)
            if not product_data:
                return None
            
            # Simple like tracking using a likes table
            import sqlite3
            with sqlite3.connect(self.db.db_path) as conn:
                # Check if already liked
                cursor = conn.execute(
                    "SELECT 1 FROM product_likes WHERE product_id = ? AND user_id = ?",
                    (product_id, user_id)
                )
                already_liked = cursor.fetchone() is not None
                
                if already_liked:
                    # Unlike: remove like and decrement count
                    conn.execute(
                        "DELETE FROM product_likes WHERE product_id = ? AND user_id = ?",
                        (product_id, user_id)
                    )
                    current_likes = product_data.get("likes_count", 0)
                    new_likes = max(0, current_likes - 1)
                    liked = False
                    logger.info(f"User {user_id} unliked product {product_id}")
                else:
                    # Like: add like and increment count
                    conn.execute(
                        "INSERT OR IGNORE INTO product_likes (product_id, user_id, liked_at) VALUES (?, ?, ?)",
                        (product_id, user_id, datetime.utcnow().isoformat())
                    )
                    current_likes = product_data.get("likes_count", 0)
                    new_likes = current_likes + 1
                    liked = True
                    logger.info(f"User {user_id} liked product {product_id}")
                
                # Update likes count
                self.db.update_document(self.collection_name, product_id, {"likes_count": new_likes})
                conn.commit()
                
            likes_count = new_likes
            
            return {
                "liked": liked,
                "likes_count": likes_count
            }
            
        except Exception as e:
            logger.error(f"Failed to toggle like: {e}", exc_info=True)
            return None
    
    async def search_products(
        self,
        query: str,
        category: Optional[ProductCategory] = None,
        page: int = 1,
        page_size: int = 20
    ) -> tuple[List[ProductResponse], int]:
        """
        Search products by title or description
        
        Args:
            query: Search query string
            category: Optional category filter
            page: Page number
            page_size: Items per page
            
        Returns:
            Tuple of (products list, total count)
        """
        try:
            # Security: Limit page size
            page_size = min(page_size, 100)
            
            # Build query conditions
            where_conditions = ["status = ?"]
            params = [ProductStatus.PUBLIC.value]
            
            if category:
                where_conditions.append("category = ?")
                params.append(category.value)
            
            where_clause = " AND ".join(where_conditions)
            
            # Get all matching documents
            all_products = self.db.query_collection(self.collection_name, where_clause, tuple(params))
            
            # Filter by search query (case-insensitive)
            query_lower = query.lower()
            matching_products = []
            
            for data in all_products:
                title = data.get("title", "").lower()
                description = data.get("description", "").lower()
                tags = [tag.lower() for tag in data.get("tags", [])] if data.get("tags") else []
                
                # Check if query matches title, description, or tags
                if (query_lower in title or 
                    query_lower in description or 
                    any(query_lower in tag for tag in tags)):
                    matching_products.append(ProductResponse(**data))
            
            total = len(matching_products)
            
            # Apply pagination
            offset = (page - 1) * page_size
            paginated_products = matching_products[offset:offset + page_size]
            
            return paginated_products, total
            
        except Exception as e:
            logger.error(f"Failed to search products: {e}", exc_info=True)
            return [], 0
    
    async def get_user_stats(self, user_id: str) -> Dict[str, Any]:
        """Get statistics for user's products"""
        try:
            products = self.db.query_collection(self.collection_name, "user_id = ?", (user_id,))
            
            stats = {
                "total_products": 0,
                "by_status": {},
                "by_category": {},
                "total_views": 0,
                "total_likes": 0
            }
            
            for data in products:
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
