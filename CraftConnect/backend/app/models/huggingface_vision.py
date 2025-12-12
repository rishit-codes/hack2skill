"""
Hugging Face Vision Analysis Module
Free alternative to Vertex AI for image analysis
"""
import base64
import json
from io import BytesIO
from PIL import Image
import requests
import logging

logger = logging.getLogger(__name__)

# Hugging Face API endpoint for Vision-Language models
HF_API_URL = "https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-large"

async def analyze_image_with_huggingface(image_bytes: bytes, hf_token: str = None) -> dict:
    """
    Analyze image using Hugging Face Vision models (FREE).
    Uses BLIP model for image captioning and analysis.
    
    Args:
        image_bytes: Image data as bytes
        hf_token: Hugging Face API token (optional, but recommended for better rate limits)
    
    Returns:
        dict: Analysis results with product attributes
    """
    try:
        # Prepare the image
        headers = {"Content-Type": "application/octet-stream"}
        if hf_token:
            headers["Authorization"] = f"Bearer {hf_token}"
        
        # Call Hugging Face API
        response = requests.post(
            HF_API_URL,
            headers=headers,
            data=image_bytes,
            timeout=30
        )
        
        # Check if response is HTML (error page)
        content_type = response.headers.get('Content-Type', '')
        if 'text/html' in content_type:
            logger.warning(f"⚠️ HuggingFace returned HTML (model loading or error), using fallback")
            return get_fallback_analysis()
        
        if response.status_code == 200:
            try:
                result = response.json()
                caption = result[0]["generated_text"] if isinstance(result, list) else result.get("generated_text", "")
                
                if not caption:
                    logger.warning("⚠️ Empty caption from HuggingFace, using fallback")
                    return get_fallback_analysis()
                
                # Extract attributes from caption using simple heuristics
                analysis = extract_attributes_from_caption(caption)
                
                logger.info(f"✅ Hugging Face analysis successful: {caption}")
                return analysis
            except (ValueError, KeyError, json.JSONDecodeError) as e:
                logger.warning(f"⚠️ Failed to parse HuggingFace response: {e}, using fallback")
                return get_fallback_analysis()
            
        elif response.status_code == 503:
            # Model is loading, return basic data
            logger.warning("⚠️ HuggingFace model loading (503), using fallback")
            return get_fallback_analysis()
            
        else:
            logger.error(f"❌ HuggingFace API error: {response.status_code}")
            return get_fallback_analysis()
            
    except Exception as e:
        logger.error(f"❌ Hugging Face analysis failed: {e}")
        return get_fallback_analysis()


def extract_attributes_from_caption(caption: str) -> dict:
    """
    Extract product attributes from image caption.
    This is a simple implementation - can be enhanced with more sophisticated NLP.
    """
    caption_lower = caption.lower()
    
    # Extract colors (simple keyword matching)
    colors = []
    color_keywords = ["white", "black", "red", "blue", "green", "yellow", "pink", "purple", "orange", "brown", "gray", "golden", "silver"]
    for color in color_keywords:
        if color in caption_lower:
            colors.append(color)
    
    if not colors:
        colors = ["natural", "neutral"]
    
    # Extract materials (simple keyword matching)
    materials = []
    material_keywords = ["wood", "metal", "ceramic", "clay", "fabric", "textile", "glass", "leather", "plastic", "stone"]
    for material in material_keywords:
        if material in caption_lower:
            materials.append(material)
    
    if not materials:
        materials = ["handcrafted", "artisan"]
    
    # Generate title from caption
    suggested_title = caption[:60] if len(caption) > 60 else caption
    
    # Generate SEO tags
    words = caption_lower.split()
    seo_tags = [word.strip(".,!?") for word in words if len(word) > 4][:6]
    if not seo_tags:
        seo_tags = ["handmade", "artisan", "craft"]
    
    return {
        "suggested_title": suggested_title.title(),
        "seo_tags": seo_tags,
        "suggested_materials": materials,
        "primary_colors": colors[:3],
        "estimated_dimensions_cm": "N/A",
        "confidence_score": 0.6,  # Medium confidence for HuggingFace analysis
        "description": caption
    }


def get_fallback_analysis() -> dict:
    """
    Fallback analysis when HuggingFace is unavailable.
    """
    return {
        "suggested_title": "Handcrafted Artisan Product",
        "seo_tags": ["handmade", "artisan", "craft", "unique"],
        "suggested_materials": ["artisan", "handcrafted"],
        "primary_colors": ["natural"],
        "estimated_dimensions_cm": "N/A",
        "confidence_score": 0.4,
        "description": "A beautiful handcrafted item"
    }
