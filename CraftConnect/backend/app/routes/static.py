from fastapi import APIRouter
from fastapi.responses import FileResponse
from pathlib import Path
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/uploads", tags=["Static Files"])

UPLOAD_DIR = Path("uploads")

@router.get("/products/{filename}")
async def serve_product_image(filename: str):
    """Serve locally stored product images"""
    file_path = UPLOAD_DIR / "products" / filename
    
    if not file_path.exists():
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Image not found")
    
    return FileResponse(file_path)
