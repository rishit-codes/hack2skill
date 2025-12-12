from google.cloud.firestore_v1.async_client import AsyncClient
from app.config.settings import settings

import logging                             # for transation glossary   
from google.cloud.firestore_v1 import AsyncClient


db = AsyncClient(project=settings.PROJECT_ID, database=settings.FIRESTORE_DB)

logger = logging.getLogger(__name__)              # for transation glossary

CACHE_COLLECTION = "copilot_cache"

def get_firestore_client():
    """Returns the Firestore AsyncClient instance for synchronous operations."""
    # For sync operations, we'll use the db instance directly
    # Product model will handle async properly
    from google.cloud import firestore
    return firestore.Client(project=settings.PROJECT_ID, database=settings.FIRESTORE_DB)


async def set_cached_analysis(image_hash: str, data: dict):
    """Saves analysis data to Firestore."""
    doc_ref = db.collection(CACHE_COLLECTION).document(image_hash)
    await doc_ref.set(data)

async def get_cached_analysis(image_hash: str) -> dict | None:
    """Retrieves analysis data from Firestore if it exists."""
    doc_ref = db.collection(CACHE_COLLECTION).document(image_hash)
    doc = await doc_ref.get()
    if doc.exists:
        return doc.to_dict()
    return None
                                                 # transation glossary fetch


async def get_artisan_glossary(artisan_id: str, language_code: str) -> dict:
    """
    Fetches the translation glossary for a specific artisan and language.
    """
    try:
        artisan_ref = db.collection('artisans').document(artisan_id)
        doc = await artisan_ref.get()
        if not doc.exists:
            logger.warning(f"No document found for artisan_id: {artisan_id}")
            return {}

        artisan_data = doc.to_dict()
        glossary_field_name = f"glossary_{language_code}"
        return artisan_data.get(glossary_field_name, {})
    except Exception as e:
        logger.error(f"Error fetching glossary for artisan {artisan_id}: {e}", exc_info=True)
        return {}
