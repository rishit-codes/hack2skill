# Local storage service as fallback for GCS
import os
import aiofiles
from pathlib import Path
from typing import Optional
import logging

logger = logging.getLogger(__name__)

# Create uploads directory
UPLOAD_DIR = Path("uploads/products")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

async def upload_file_to_local(contents: bytes, blob_name: str) -> Optional[str]:
    """
    Save file locally as a fallback when GCS billing is disabled.
    Returns a local file path that can be served.
    """
    try:
        file_path = UPLOAD_DIR / blob_name.replace("products/", "")
        file_path.parent.mkdir(parents=True, exist_ok=True)
        
        async with aiofiles.open(file_path, 'wb') as f:
            await f.write(contents)
        
        # Return a path that can be accessed via the API
        local_uri = f"/uploads/{blob_name}"
        logger.info(f"✅ File saved locally: {local_uri}")
        return local_uri
        
    except Exception as e:
        logger.error(f"❌ Error saving file locally: {e}")
        return None


def get_local_file_path(uri: str) -> Path:
    """Convert a local URI to actual file path"""
    # Remove /uploads/ prefix
    relative_path = uri.replace("/uploads/", "")
    return UPLOAD_DIR.parent / relative_path
