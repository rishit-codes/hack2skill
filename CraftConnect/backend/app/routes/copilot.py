import hashlib
from fastapi import APIRouter, UploadFile, File, HTTPException, status
from pydantic import BaseModel, Field
from typing import List, Dict, Optional

from app.cloud_services import storage, firestore_db
from app.models import local_vision  # Using LOCAL BLIP model - no external API!
from app.config.settings import settings

#from app.models import vertex_imagen     #vertex_imagen.py       ------- image enhancement ****
'''    import asyncio
    from google import genai
    from google.genai import types, errors
    from app.config.settings import settings
    import vertexai
    from vertexai.vision_models import Image, ImageGenerationModel
    from fastapi import Body
    from utils.image_utils import enhance_image_from_gcs '''
# ------------------------------------------------------------------------- ****

router = APIRouter(prefix="/copilot", tags=["Artisan Co-pilot"])

# --- Updated Pydantic Response Model ---
class ImageAnalysisResponse(BaseModel):
    gcs_uri: str
    status: str = Field(..., description="e.g., 'auto_accepted', 'needs_confirmation', 'rejected'")
    suggested_title: Optional[str] = None
    seo_tags: Optional[List[str]] = None
    suggested_materials: Optional[List[str]] = None
    primary_colors: Optional[List[str]] = None
    estimated_dimensions_cm: Optional[str] = None
    confidence_score: float

@router.post("/analyze", response_model=ImageAnalysisResponse)
async def analyze_image(image_file: UploadFile = File(...)):
    """Analyze image using LOCAL BLIP model (runs on your machine!)."""
    contents = await image_file.read()
    image_hash = hashlib.sha256(contents).hexdigest()

    file_extension = image_file.filename.split('.')[-1]
    blob_name = f"products/{image_hash}.{file_extension}"
    gcs_uri = await storage.upload_file_async(contents, blob_name)
    if not gcs_uri:
        raise HTTPException(status_code=500, detail="Failed to upload image.")

    # Analyze image using LOCAL model (no external API!)
    try:
        analysis_data = local_vision.analyze_image_locally(contents)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image analysis failed: {e}")

    # Implement Confidence Threshold Logic
    score = analysis_data.get("confidence_score", 0.0)
    status = "rejected"  # Default to rejected
    if score >= 0.70:
        status = "auto_accepted"
    elif 0.40 <= score < 0.70:
        status = "needs_confirmation"
    
    # If rejected, we don't return the AI suggestions
    if status == "rejected":
        return ImageAnalysisResponse(
            gcs_uri=gcs_uri,
            status=status,
            confidence_score=score
        )
        
    return ImageAnalysisResponse(
        gcs_uri=gcs_uri,
        status=status,
        suggested_title=analysis_data.get("suggested_title"),
        seo_tags=analysis_data.get("seo_tags"),
        suggested_materials=analysis_data.get("suggested_materials"),
        primary_colors=analysis_data.get("primary_colors"),
        estimated_dimensions_cm=analysis_data.get("estimated_dimensions_cm"),
        confidence_score=score,
    )


#image enhancement endpoint
#class ImageEnhanceRequest(BaseModel):
    gcs_uri: str

#class ImageEnhanceResponse(BaseModel):
    enhanced_gcs_uri: str

#@router.post("/enhance", response_model=ImageEnhanceResponse)
#def enhance(req: ImageEnhanceRequest = Body(...)):
    """
    Enhance a product image from GCS using Vertex AI Imagen 3.0.
    """
    enhanced_uri = enhance_image_from_gcs(req.gcs_uri)
    return ImageEnhanceResponse(enhanced_gcs_uri=enhanced_uri)
