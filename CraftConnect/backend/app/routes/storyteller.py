from fastapi import APIRouter, HTTPException, status, Body
import logging

from app.models import simple_story  # Simple fallback (no external dependencies)
from app.schemas.story import StoryRequest, StoryResponse


router = APIRouter()
logger = logging.getLogger(__name__)

@router.post(
    "/generate",
    response_model=StoryResponse,
    summary="Generate a Polished Product Story",
    description="Takes product data and generates a compelling story using templates.",
    tags=["Storyteller"]
)
async def generate_story(
    request: StoryRequest = Body(...)
) -> StoryResponse:
    """
    Generates a product story using template-based generation.
    No external AI API required - works completely offline.
    """
    try:
        # Convert request to dict for simple story generator
        product_data = request.dict() if hasattr(request, 'dict') else request.__dict__
        
        simple_generated_story = await simple_story.generate_simple_story(product_data)
        return StoryResponse(generated_story=simple_generated_story)
        
    except Exception as e:
        logger.error(f"Failed to generate story: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="The story generation service is currently unavailable. Please try again later."
        )