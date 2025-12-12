import logging
import openai
from typing import Optional
from app.config.settings import settings

logger = logging.getLogger(__name__)

class TextGenerator:
    """
    Text generation service with fallback options
    """
    
    def __init__(self):
        self.openai_client = None
        if settings.OPENAI_API_KEY:
            openai.api_key = settings.OPENAI_API_KEY
            self.openai_client = openai
    
    async def generate_story_from_prompts(self, artisan_heritage: str, piece_story: str) -> str:
        """Generate story using available AI service"""
        
        # Try OpenAI first if available
        if self.openai_client:
            try:
                return await self._generate_with_openai(artisan_heritage, piece_story)
            except Exception as e:
                logger.warning(f"OpenAI failed: {e}, using fallback")
        
        # Fallback to simple template
        return self._generate_fallback_story(artisan_heritage, piece_story)
    
    async def _generate_with_openai(self, artisan_heritage: str, piece_story: str) -> str:
        """Generate story using OpenAI"""
        prompt = f"""
        Create a compelling product story by combining these two elements:
        
        Artisan Heritage: {artisan_heritage}
        
        Piece Story: {piece_story}
        
        Write a cohesive, engaging narrative that flows naturally from the artisan's background to this specific piece.
        """
        
        response = await self.openai_client.ChatCompletion.acreate(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=500,
            temperature=0.7
        )
        
        return response.choices[0].message.content.strip()
    
    def _generate_fallback_story(self, artisan_heritage: str, piece_story: str) -> str:
        """Simple template-based story generation"""
        return f"""
        {artisan_heritage}
        
        This particular piece represents a unique chapter in our artisan's journey. {piece_story}
        
        Each creation carries the essence of traditional craftsmanship, blended with personal inspiration and years of dedicated practice. This piece is not just an object, but a story waiting to become part of your own narrative.
        """.strip()

# Singleton instance
text_generator = TextGenerator()

# For backward compatibility
vertex_text_client = text_generator