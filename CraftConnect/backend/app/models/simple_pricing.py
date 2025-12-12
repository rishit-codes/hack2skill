"""
Simple pricing logic without Vertex AI billing
Uses formula-based approach for demo purposes
"""
import logging
from typing import Optional

logger = logging.getLogger(__name__)


async def generate_simple_price(
    materials_cost: float,
    labor_hours: float,
    category: Optional[str] = None
) -> dict:
    """
    Generate price suggestion using simple markup formula.
    Works without any external AI API.
    """
    # Base calculation: materials cost + labor
    # Labor rate varies by category
    labor_rates = {
        'pottery': 25.0,      # $25/hour
        'woodwork': 30.0,     # $30/hour
        'textiles': 20.0,     # $20/hour
        'jewelry': 40.0,      # $40/hour (higher skill)
        'metalwork': 35.0,    # $35/hour
        'painting': 45.0,     # $45/hour (artistic)
        'sculpture': 50.0,    # $50/hour (complex)
        'leather': 28.0,      # $28/hour
        'glasswork': 38.0,    # $38/hour
        'other': 25.0         # $25/hour default
    }
    
    # Get labor rate for category
    labor_rate = labor_rates.get(category, 25.0)
    
    # Calculate base cost
    labor_cost = labor_hours * labor_rate
    base_cost = materials_cost + labor_cost
    
    # Add markup for profit and overhead (50%)
    markup_percentage = 0.50
    suggested_price = base_cost * (1 + markup_percentage)
    
    # Round to nearest $5
    suggested_price = round(suggested_price / 5) * 5
    
    # Ensure minimum price
    min_price = 15.0
    suggested_price = max(suggested_price, min_price)
    
    # Calculate min/max range
    min_price_calc = suggested_price * 0.85
    max_price_calc = suggested_price * 1.15
    
    logger.info(f"💰 Price suggestion: ${suggested_price:.2f} (Materials: ${materials_cost}, Labor: ${labor_cost:.2f})")
    
    return {
        "suggested_price": round(suggested_price, 2),
        "min_price": round(min_price_calc, 2),
        "max_price": round(max_price_calc, 2),
        "confidence": "Medium",
        "price_breakdown": {
            "materials_cost": materials_cost,
            "labor_cost": round(labor_cost, 2),
            "markup_percentage": markup_percentage * 100,
            "total": round(suggested_price, 2)
        },
        "explanation": f"Based on ${materials_cost} in materials, {labor_hours} hours at ${labor_rate}/hr, plus {markup_percentage*100}% markup for profit and overhead."
    }
