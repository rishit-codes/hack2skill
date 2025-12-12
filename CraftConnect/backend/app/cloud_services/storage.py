from google.cloud import storage as gcs
from app.config.settings import settings
import asyncio
import logging
from pathlib import Path
import aiofiles

logger = logging.getLogger(__name__)

# Setup local storage directory
UPLOAD_DIR = Path("uploads/products") 
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

try:
    storage_client = gcs.Client(project=settings.PROJECT_ID)
    logger.info("✅ GCS client initialized")
except Exception as e:
    logger.warning(f"⚠️ GCS client initialization failed: {e}. Will use local storage only.")
    storage_client = None

async def upload_file_to_local(file_content: bytes, destination_blob_name: str) -> str:
    """Save file locally as fallback"""
    try:
        file_name = destination_blob_name.replace("products/", "")
        file_path = UPLOAD_DIR / file_name
        file_path.parent.mkdir(parents=True, exist_ok=True)
        
        async with aiofiles.open(file_path, 'wb') as f:
            await f.write(file_content)
        
        local_uri = f"/uploads/products/{file_name}"
        logger.info(f"✅ File saved locally: {local_uri}")
        return local_uri
        
    except Exception as e:
        logger.error(f"❌ Error saving file locally: {e}")
        raise

async def upload_file_async(file_content: bytes, destination_blob_name: str) -> str:
    """Uploads a file to GCS bucket, falls back to local storage if GCS fails."""
    
    # Try GCS first if client is available
    if storage_client:
        try:
            bucket = storage_client.bucket(settings.BUCKET_NAME)
            blob = bucket.blob(destination_blob_name)

            # Run blocking upload in thread pool
            loop = asyncio.get_event_loop()
            await loop.run_in_executor(
                None,
                blob.upload_from_string,
                file_content,
                'image/jpeg'
            )

            logger.info(f"✅ Uploaded to GCS: gs://{settings.BUCKET_NAME}/{destination_blob_name}")
            return f"gs://{settings.BUCKET_NAME}/{destination_blob_name}"
        except Exception as e:
            logger.error(f"❌ GCS upload failed: {e}")
            logger.info("📁 Falling back to local storage...")
    
    # Fallback to local storage
    local_uri = await upload_file_to_local(file_content, destination_blob_name)
    return local_uri