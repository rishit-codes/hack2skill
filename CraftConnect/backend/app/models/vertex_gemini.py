import vertexai
import json
from vertexai.generative_models import GenerativeModel, Part
from tenacity import retry, stop_after_attempt, wait_exponential
from app.config.settings import settings
import logging

logger = logging.getLogger(__name__)

# Initialize Vertex AI
vertexai.init(project=settings.PROJECT_ID, location=settings.REGION)
model = GenerativeModel(model_name=settings.GEMINI_MODEL)

@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=4, max=10))
async def analyze_image_with_gemini(gcs_uri: str) -> dict:
    """
    Uses Gemini 1.5 to extract attributes from a product image via GCS URI.
    Includes retry logic for robustness.
    """
    image_part = Part.from_uri(gcs_uri, mime_type="image/jpeg")
    
    prompt = """
    Analyze this image of a handmade artisan product for an e-commerce listing. Based only on the visual information, provide a raw JSON object with the following keys:
    - "suggested_title": A creative and descriptive 6-word title.
    - "seo_tags": A list of 5-8 SEO-friendly, slug-style tags (e.g., "ceramic-mug", "handmade-pottery").
    - "suggested_materials": A list of materials likely used (e.g., ["clay", "glaze"]).
    - "primary_colors": A list of the 3 most dominant color names (e.g., ["off-white", "brown"]).
    - "estimated_dimensions_cm": A string estimating the object's dimensions (e.g., "10cm x 15cm"). Use "N/A" if impossible to determine.
    - "confidence_score": A single float between 0.0 and 1.0 representing your overall confidence in the generated title, tags, and attributes.
    """
    
    response = await model.generate_content_async([image_part, prompt])
    
    # Clean and parse the JSON response from the model
    text_response = response.text.strip().replace("```json", "").replace("```", "")
    try:
        return json.loads(text_response)
    except (json.JSONDecodeError, TypeError) as e:
        logger.error(f"Error: Gemini did not return valid JSON. Response: {response.text}")
        return {"confidence_score": 0.0}


@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=4, max=10))
async def analyze_image_bytes(image_bytes: bytes) -> dict:
    """
    Uses Gemini 1.5 to analyze image from bytes (for local storage).
    This allows analysis even when GCS billing is disabled.
    """
    try:
        image_part = Part.from_data(data=image_bytes, mime_type="image/jpeg")
        
        prompt = """
        Analyze this image of a handmade artisan product for an e-commerce listing. Based only on the visual information, provide a raw JSON object with the following keys:
        - "suggested_title": A creative and descriptive 6-word title.
        - "seo_tags": A list of 5-8 SEO-friendly, slug-style tags (e.g., "ceramic-mug", "handmade-pottery").
        - "suggested_materials": A list of materials likely used (e.g., ["clay", "glaze"]).
        - "primary_colors": A list of the 3 most dominant color names (e.g., ["off-white", "brown"]).
        - "estimated_dimensions_cm": A string estimating the object's dimensions (e.g., "10cm x 15cm"). Use "N/A" if impossible to determine.
        - "confidence_score": A single float between 0.0 and 1.0 representing your overall confidence.
        """
        
        response = await model.generate_content_async([image_part, prompt])
        
        # Clean and parse the JSON response
        text_response = response.text.strip().replace("```json", "").replace("```", "")
        try:
            result = json.loads(text_response)
            logger.info(f"✅ Gemini analysis successful (from bytes)")
            return result
        except (json.JSONDecodeError, TypeError) as e:
            logger.error(f"❌ Gemini returned invalid JSON. Response: {response.text}")
            return {"confidence_score": 0.0}
            
    except Exception as e:
        logger.error(f"❌ Vertex AI analysis failed: {e}")
        return {"confidence_score": 0.0}