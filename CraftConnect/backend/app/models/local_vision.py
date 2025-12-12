"""
Local Vision Analysis using BLIP model
Runs entirely on local machine - no external API calls needed!
Much more reliable than HuggingFace API
"""
import io
import logging
from PIL import Image
from transformers import BlipProcessor, BlipForConditionalGeneration
import torch

logger = logging.getLogger(__name__)

# Global variables for model caching
_processor = None
_model = None

def load_model():
    """Load BLIP model (only once, cached afterwards)"""
    global _processor, _model
    
    if _processor is None or _model is None:
        logger.info("📥 Loading BLIP model (this may take a minute on first run)...")
        try:
            _processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
            _model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")
            
            # Move to GPU if available
            if torch.cuda.is_available():
                _model = _model.to("cuda")
                logger.info("✅ BLIP model loaded on GPU")
            else:
                logger.info("✅ BLIP model loaded on CPU")
                
        except Exception as e:
            logger.error(f"❌ Failed to load BLIP model: {e}")
            raise
    
    return _processor, _model


def analyze_image_locally(image_bytes: bytes) -> dict:
    """
    Analyze image using local BLIP model (no external API!).
    
    Args:
        image_bytes: Image data as bytes
    
    Returns:
        dict: Analysis results with product attributes
    """
    try:
        # Load model (cached after first load)
        processor, model = load_model()
        
        # Open image
        image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        
        # Generate caption
        inputs = processor(image, return_tensors="pt")
        
        if torch.cuda.is_available():
            inputs = {k: v.to("cuda") for k, v in inputs.items()}
        
        out = model.generate(**inputs, max_length=50)
        caption = processor.decode(out[0], skip_special_tokens=True)
        
        logger.info(f"✅ Local BLIP analysis: {caption}")
        
        # Extract attributes from caption
        analysis = extract_attributes_from_caption(caption, image)
        return analysis
        
    except Exception as e:
        logger.error(f"❌ Local vision analysis failed: {e}")
        return get_fallback_analysis()


def extract_attributes_from_caption(caption: str, image: Image.Image) -> dict:
    """Extract product attributes from image caption and image analysis."""
    caption_lower = caption.lower()
    
    # Extract colors from caption and image
    colors = extract_colors(caption_lower, image)
    
    # Extract materials
    materials = []
    material_keywords = {
        "wood": ["wood", "wooden", "timber"],
        "metal": ["metal", "steel", "iron", "aluminum", "brass"],
        "ceramic": ["ceramic", "pottery", "clay", "porcelain"],
        "fabric": ["fabric", "textile", "cloth", "cotton", "silk"],
        "glass": ["glass", "crystal"],
        "leather": ["leather"],
        "plastic": ["plastic"],
        "stone": ["stone", "marble", "granite"],
        "automotive": ["car", "vehicle", "automobile", "bmw", "mercedes", "audi"]
    }
    
    for material, keywords in material_keywords.items():
        if any(keyword in caption_lower for keyword in keywords):
            materials.append(material)
    
    if not materials:
        materials = ["handcrafted"]
    
    # Generate title from caption (capitalize properly)
    words = caption.split()
    suggested_title = ' '.join(words[:8]) if len(words) > 8 else caption
    suggested_title = suggested_title.title()
    
    # Generate SEO tags
    seo_tags = [word.lower().strip(".,!?") for word in caption.split() if len(word) > 3][:8]
    if not seo_tags:
        seo_tags = ["product", "item"]
    
    return {
        "suggested_title": suggested_title,
        "seo_tags": seo_tags,
        "suggested_materials": materials,
        "primary_colors": colors,
        "estimated_dimensions_cm": "N/A",
        "confidence_score": 0.75,  # Higher confidence for local model
        "description": caption
    }


def extract_colors(caption: str, image: Image.Image) -> list:
    """Extract colors from caption and dominant colors from image."""
    colors = []
    
    # Color keywords from caption
    color_map = {
        "white": ["white", "ivory", "cream"],
        "black": ["black", "dark"],
        "red": ["red", "crimson", "scarlet"],
        "blue": ["blue", "navy", "azure"],
        "green": ["green", "emerald", "lime"],
        "yellow": ["yellow", "gold", "golden"],
        "pink": ["pink", "magenta", "rose", "cherry blossom"],
        "purple": ["purple", "violet", "lavender"],
        "orange": ["orange", "amber"],
        "brown": ["brown", "tan", "beige"],
        "gray": ["gray", "grey", "silver"],
        "silver": ["silver", "metallic"]
    }
    
    for color, keywords in color_map.items():
        if any(keyword in caption for keyword in keywords):
            if color not in colors:
                colors.append(color)
    
    # If no colors found in caption, analyze image
    if not colors:
        try:
            # Get dominant colors from image
            img_resized = image.resize((150, 150))
            pixels = list(img_resized.getdata())
            
            # Simple dominant color detection
            r_avg = sum(p[0] for p in pixels) // len(pixels)
            g_avg = sum(p[1] for p in pixels) // len(pixels)
            b_avg = sum(p[2] for p in pixels) // len(pixels)
            
            # Determine dominant color
            if r_avg > 200 and g_avg > 200 and b_avg > 200:
                colors.append("white")
            elif r_avg < 50 and g_avg < 50 and b_avg < 50:
                colors.append("black")
            elif r_avg > g_avg and r_avg > b_avg:
                if r_avg > 150 and g_avg < 100:
                    colors.append("red")
                else:
                    colors.append("pink")
            elif g_avg > r_avg and g_avg > b_avg:
                colors.append("green")
            elif b_avg > r_avg and b_avg > g_avg:
                colors.append("blue")
            else:
                colors.append("natural")
                
        except Exception as e:
            logger.warning(f"⚠️ Color extraction failed: {e}")
            colors = ["natural"]
    
    return colors[:3]


def get_fallback_analysis() -> dict:
    """Fallback when everything fails."""
    return {
        "suggested_title": "Product Listing",
        "seo_tags": ["product", "item", "listing"],
        "suggested_materials": ["various"],
        "primary_colors": ["multi-color"],
        "estimated_dimensions_cm": "N/A",
        "confidence_score": 0.3,
        "description": "Product for sale"
    }
