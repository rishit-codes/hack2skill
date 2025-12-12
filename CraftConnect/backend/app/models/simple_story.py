"""
Simple story generation without Vertex AI billing
Uses template-based approach with variations
"""
import logging
import random
from typing import Dict

logger = logging.getLogger(__name__)


async def generate_simple_story(product_data: Dict) -> str:
    """
    Generate a simple product story using templates with variations.
    Works without any external AI API.
    """
    title = product_data.get('title', 'Handcrafted Item')
    description = product_data.get('description', '')
    category = product_data.get('category', 'craft')
    materials = product_data.get('materials', [])
    colors = product_data.get('colors', [])
    tags = product_data.get('tags', [])
    
    # Build story from templates with variations
    story_parts = []
    
    # Opening - varied
    openings = [
        f"✨ **{title}** ✨\n",
        f"🎨 **Introducing: {title}** 🎨\n",
        f"💎 **{title}** 💎\n",
        f"⭐ **{title}** - A Unique Creation ⭐\n"
    ]
    story_parts.append(random.choice(openings))
    
    # Craft description with category-specific variations
    if category:
        category_stories = {
            'pottery': [
                "Each piece is carefully hand-thrown and shaped on the potter's wheel, embodying centuries-old ceramic traditions.",
                "Crafted with skilled hands at the pottery wheel, this piece represents timeless artisan techniques.",
                "Hand-formed with precision and care, showcasing the delicate art of traditional pottery."
            ],
            'woodwork': [
                "Carved from sustainably sourced wood, this piece showcases expert craftsmanship and attention to detail.",
                "Meticulously crafted from premium wood, combining traditional techniques with contemporary design.",
                "Hand-carved with passion, highlighting the natural beauty and grain of fine wood."
            ],
            'textiles': [
                "Woven with care using traditional techniques passed down through generations of artisans.",
                "Each thread carefully placed by skilled hands, creating a tapestry of cultural heritage.",
                "Handwoven with expertise, preserving ancient textile traditions in every stitch."
            ],
            'jewelry': [
                "Handcrafted with precious attention to every detail, this unique piece tells a story of artisan excellence.",
                "Designed and crafted with meticulous precision, blending artistry with wearable beauty.",
                "Each element carefully selected and assembled, creating a one-of-a-kind piece of wearable art."
            ],
            'metalwork': [
                "Forged with skill and passion, combining traditional metalworking techniques with contemporary design.",
                "Hammered and shaped by expert hands, showcasing the strength and beauty of crafted metal.",
                "Hand-formed from quality metal, demonstrating mastery of ancient forging techniques."
            ],
            'painting': [
                "Created with vibrant colors and artistic vision, this piece captures the essence of handmade artistry.",
                "Painted with passion and precision, bringing to life a unique artistic vision.",
                "Each brushstroke applied with care, creating a visual story that captivates the eye."
            ],
            'leather': [
                "Crafted from premium leather using time-honored techniques for durability and beauty.",
                "Hand-tooled and stitched with precision, showcasing the versatility of fine leather craft.",
                "Made from quality leather with expert craftsmanship, built to last generations."
            ],
            'glasswork': [
                "Blown and shaped with masterful precision, showcasing the delicate art of glassmaking.",
                "Formed at high temperatures with skilled hands, capturing light and beauty in glass.",
                "Hand-crafted using traditional glass techniques, creating a luminous work of art."
            ],
            'other': [
                "Handcrafted with passion and expertise, this unique creation embodies artisan traditions.",
                "Created with dedication and skill, showcasing traditional craftsmanship at its finest.",
                "Made by hand with attention to detail, representing authentic artisan workmanship."
            ]
        }
        variations = category_stories.get(category, category_stories['other'])
        story_parts.append(random.choice(variations))
    
    # Materials story with variations
    if materials:
        materials_str = ', '.join(materials[:3])
        materials_intros = [
            f"\n\n**Materials**: Made with {materials_str}, carefully selected for quality and authenticity.",
            f"\n\n**Crafted From**: {materials_str}, chosen for their exceptional quality and character.",
            f"\n\n**Premium Materials**: Features {materials_str}, sourced and selected with care."
        ]
        story_parts.append(random.choice(materials_intros))
    
    # Color story with variations
    if colors:
        colors_str = ', '.join(colors[:3])
        color_descriptions = [
            f"\n\n**Colors**: Featuring beautiful {colors_str} tones that bring warmth and character to any space.",
            f"\n\n**Color Palette**: Rich {colors_str} hues that create visual harmony and appeal.",
            f"\n\n**Stunning Tones**: Beautiful {colors_str} shades that enhance its aesthetic appeal."
        ]
        story_parts.append(random.choice(color_descriptions))
    
    # Closing with variations
    closings = [
        "\n\n💝 Every piece is unique and made with love, carrying the soul of the artisan who created it.",
        "\n\n✨ A one-of-a-kind creation, handmade with heart and dedication.",
        "\n\n🌟 Uniquely crafted with passion, this piece tells its own special story.",
        "\n\n💎 Made with care and expertise, a true testament to artisan craftsmanship."
    ]
    story_parts.append(random.choice(closings))
    
    return ''.join(story_parts)
