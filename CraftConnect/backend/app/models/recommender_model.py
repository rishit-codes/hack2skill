import logging
from typing import List, Dict, Any
from app.cloud_services.database import get_database_client

logger = logging.getLogger(__name__)

class RecommenderService:
    def __init__(self):
        self.db = get_database_client()
    
    async def get_recommendations(self, product_id: str, fairness_boost: bool = False) -> List[Dict[str, Any]]:
        """Get product recommendations based on category and tags"""
        try:
            # Get the source product
            source_product = self.db.get_document("products", product_id)
            if not source_product:
                return []
            
            # Find similar products by category
            similar_products = self.db.query_collection(
                "products", 
                "category = ? AND product_id != ? AND status = ?",
                (source_product["category"], product_id, "public")
            )
            
            # Simple scoring based on shared tags
            recommendations = []
            source_tags = set(source_product.get("tags", []))
            
            for product in similar_products[:10]:  # Limit to 10
                shared_tags = len(set(product.get("tags", [])) & source_tags)
                score = 0.5 + (shared_tags * 0.1)  # Base score + tag similarity
                
                recommendations.append({
                    "product_id": product["product_id"],
                    "title": product["title"],
                    "category": product["category"],
                    "score": min(score, 1.0),
                    "reason": f"Similar {product['category']} with {shared_tags} shared tags"
                })
            
            # Sort by score
            recommendations.sort(key=lambda x: x["score"], reverse=True)
            
            return recommendations[:5]  # Return top 5
            
        except Exception as e:
            logger.error(f"Recommendation failed: {e}", exc_info=True)
            return []

recommender_service = RecommenderService()