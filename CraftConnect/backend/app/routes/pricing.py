from fastapi import APIRouter, HTTPException, status
from app.schemas.pricing import PriceSuggestionRequest, PriceSuggestionResponse
from app.models.price_model import price_suggestion_service
from app.models import simple_pricing  # Simple fallback
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post(
    "/suggest",
    response_model=PriceSuggestionResponse,
    summary="Suggest a Price for an Artisan's Product",
    description="Uses formula-based pricing as fallback when AI is unavailable",
    tags=["Pricing"]
)
async def suggest_product_price(request: PriceSuggestionRequest):
    # Use simple formula-based pricing (skip Vertex AI due to billing)
    try:
        result = await simple_pricing.generate_simple_price(
            materials_cost=request.materials_cost,
            labor_hours=request.labor_hours,
            category=request.category
        )
        
        return PriceSuggestionResponse(
            suggested_price=result['suggested_price'],
            price_breakdown=result.get('breakdown'),
            explanation=result.get('explanation')
        )
    except Exception as e:
        logger.error(f"Pricing suggestion failed: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred: {e}"
        )