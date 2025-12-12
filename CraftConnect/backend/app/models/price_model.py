import logging
from app.schemas.pricing import PriceSuggestionRequest, PriceSuggestionResponse

logger = logging.getLogger(__name__)

class PriceSuggestionService:
    async def suggest_price(self, materials_cost: float, labor_hours: float, category: str) -> PriceSuggestionResponse:
        """Simple price suggestion algorithm"""
        try:
            # Basic pricing formula
            hourly_rate = 25.0  # Base hourly rate
            markup_multiplier = 2.5  # Standard markup
            
            # Category-based adjustments
            category_multipliers = {
                "pottery": 1.2,
                "jewelry": 1.5,
                "textiles": 1.0,
                "woodwork": 1.3,
                "metalwork": 1.4,
                "painting": 1.6,
                "sculpture": 1.8,
                "leather": 1.1,
                "glasswork": 1.7,
                "other": 1.0
            }
            
            category_multiplier = category_multipliers.get(category.lower(), 1.0)
            
            # Calculate suggested price
            labor_cost = labor_hours * hourly_rate
            base_cost = materials_cost + labor_cost
            suggested_price = base_cost * markup_multiplier * category_multiplier
            
            # Price range (±20%)
            min_price = suggested_price * 0.8
            max_price = suggested_price * 1.2
            
            return PriceSuggestionResponse(
                suggested_price=round(suggested_price, 2),
                price_range={
                    "min": round(min_price, 2),
                    "max": round(max_price, 2)
                },
                breakdown={
                    "materials_cost": materials_cost,
                    "labor_cost": round(labor_cost, 2),
                    "markup": round(suggested_price - base_cost, 2)
                },
                confidence_score=0.75
            )
            
        except Exception as e:
            logger.error(f"Price suggestion failed: {e}", exc_info=True)
            return PriceSuggestionResponse(
                suggested_price=materials_cost * 2.0,
                price_range={"min": materials_cost * 1.5, "max": materials_cost * 3.0},
                breakdown={"materials_cost": materials_cost, "labor_cost": 0, "markup": materials_cost},
                confidence_score=0.5
            )

price_suggestion_service = PriceSuggestionService()