import sqlite3
import json
import logging
from typing import Optional, Dict, Any, List
from datetime import datetime
from pathlib import Path

logger = logging.getLogger(__name__)

class SQLiteDatabase:
    def __init__(self, db_path: str = "craftconnect.db"):
        self.db_path = db_path
        self._init_database()
    
    def _init_database(self):
        """Initialize SQLite database with required tables"""
        with sqlite3.connect(self.db_path) as conn:
            conn.execute("""
                CREATE TABLE IF NOT EXISTS users (
                    user_id TEXT PRIMARY KEY,
                    email TEXT UNIQUE NOT NULL,
                    password_hash TEXT NOT NULL,
                    name TEXT NOT NULL,
                    phone TEXT,
                    location TEXT,
                    bio TEXT,
                    avatar_url TEXT,
                    created_at TEXT NOT NULL,
                    updated_at TEXT NOT NULL
                )
            """)
            
            conn.execute("""
                CREATE TABLE IF NOT EXISTS products (
                    product_id TEXT PRIMARY KEY,
                    user_id TEXT NOT NULL,
                    title TEXT NOT NULL,
                    description TEXT NOT NULL,
                    category TEXT NOT NULL,
                    materials TEXT,
                    colors TEXT,
                    tags TEXT,
                    story TEXT,
                    images TEXT,
                    pricing TEXT,
                    dimensions TEXT,
                    status TEXT NOT NULL,
                    created_at TEXT NOT NULL,
                    updated_at TEXT NOT NULL,
                    views_count INTEGER DEFAULT 0,
                    likes_count INTEGER DEFAULT 0,
                    FOREIGN KEY (user_id) REFERENCES users (user_id)
                )
            """)
            
            conn.execute("""
                CREATE TABLE IF NOT EXISTS copilot_cache (
                    image_hash TEXT PRIMARY KEY,
                    data TEXT NOT NULL,
                    created_at TEXT NOT NULL
                )
            """)
            
            conn.execute("""
                CREATE TABLE IF NOT EXISTS product_likes (
                    product_id TEXT,
                    user_id TEXT,
                    liked_at TEXT,
                    PRIMARY KEY (product_id, user_id)
                )
            """)
            
            conn.commit()
    
    def get_document(self, collection: str, doc_id: str) -> Optional[Dict[str, Any]]:
        """Get a document by ID"""
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.execute(f"SELECT * FROM {collection} WHERE {collection[:-1]}_id = ?", (doc_id,))
            row = cursor.fetchone()
            if row:
                data = dict(row)
                # Parse JSON fields
                for field in ['materials', 'colors', 'tags', 'images', 'pricing', 'dimensions']:
                    if field in data and data[field]:
                        try:
                            data[field] = json.loads(data[field])
                        except:
                            pass
                return data
            return None
    
    def set_document(self, collection: str, doc_id: str, data: Dict[str, Any]):
        """Set a document"""
        def serialize_value(value):
            """Recursively serialize values, converting datetime to ISO format"""
            if isinstance(value, datetime):
                return value.isoformat()
            elif isinstance(value, dict):
                return {k: serialize_value(v) for k, v in value.items()}
            elif isinstance(value, list):
                return [serialize_value(item) for item in value]
            else:
                return value
        
        # Convert lists/dicts to JSON strings, handling datetime objects
        processed_data = {}
        for key, value in data.items():
            serialized = serialize_value(value)
            if isinstance(serialized, (list, dict)):
                processed_data[key] = json.dumps(serialized)
            else:
                processed_data[key] = serialized
        
        with sqlite3.connect(self.db_path) as conn:
            if collection == "users":
                conn.execute("""
                    INSERT OR REPLACE INTO users 
                    (user_id, email, password_hash, name, phone, location, bio, avatar_url, created_at, updated_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    processed_data.get('user_id'),
                    processed_data.get('email'),
                    processed_data.get('password_hash'),
                    processed_data.get('name'),
                    processed_data.get('phone'),
                    processed_data.get('location'),
                    processed_data.get('bio'),
                    processed_data.get('avatar_url'),
                    processed_data.get('created_at'),
                    processed_data.get('updated_at')
                ))
            elif collection == "products":
                conn.execute("""
                    INSERT OR REPLACE INTO products 
                    (product_id, user_id, title, description, category, materials, colors, tags, 
                     story, images, pricing, dimensions, status, created_at, updated_at, views_count, likes_count)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    processed_data.get('product_id'),
                    processed_data.get('user_id'),
                    processed_data.get('title'),
                    processed_data.get('description'),
                    processed_data.get('category'),
                    processed_data.get('materials'),
                    processed_data.get('colors'),
                    processed_data.get('tags'),
                    processed_data.get('story'),
                    processed_data.get('images'),
                    processed_data.get('pricing'),
                    processed_data.get('dimensions'),
                    processed_data.get('status'),
                    processed_data.get('created_at'),
                    processed_data.get('updated_at'),
                    processed_data.get('views_count', 0),
                    processed_data.get('likes_count', 0)
                ))
            conn.commit()
    
    def update_document(self, collection: str, doc_id: str, updates: Dict[str, Any]):
        """Update a document"""
        if not updates:
            return
        
        def serialize_value(value):
            """Recursively serialize values, converting datetime to ISO format"""
            if isinstance(value, datetime):
                return value.isoformat()
            elif isinstance(value, dict):
                return {k: serialize_value(v) for k, v in value.items()}
            elif isinstance(value, list):
                return [serialize_value(item) for item in value]
            else:
                return value
        
        # Convert lists/dicts to JSON strings
        processed_updates = {}
        for key, value in updates.items():
            serialized = serialize_value(value)
            if isinstance(serialized, (list, dict)):
                processed_updates[key] = json.dumps(serialized)
            else:
                processed_updates[key] = serialized
        
        set_clause = ", ".join([f"{key} = ?" for key in processed_updates.keys()])
        values = list(processed_updates.values()) + [doc_id]
        
        with sqlite3.connect(self.db_path) as conn:
            conn.execute(f"UPDATE {collection} SET {set_clause} WHERE {collection[:-1]}_id = ?", values)
            conn.commit()
    
    def query_collection(self, collection: str, where_clause: str = "", params: tuple = ()) -> List[Dict[str, Any]]:
        """Query a collection"""
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row
            query = f"SELECT * FROM {collection}"
            if where_clause:
                query += f" WHERE {where_clause}"
            
            cursor = conn.execute(query, params)
            results = []
            for row in cursor.fetchall():
                data = dict(row)
                # Parse JSON fields
                for field in ['materials', 'colors', 'tags', 'images', 'pricing', 'dimensions']:
                    if field in data and data[field]:
                        try:
                            data[field] = json.loads(data[field])
                        except:
                            pass
                results.append(data)
            return results

# Global database instance
db = SQLiteDatabase()

def get_database_client():
    """Returns the database client"""
    return db

# Cache functions for compatibility
async def set_cached_analysis(image_hash: str, data: dict):
    """Saves analysis data to database"""
    cache_data = {
        'image_hash': image_hash,
        'data': json.dumps(data),
        'created_at': datetime.utcnow().isoformat()
    }
    with sqlite3.connect(db.db_path) as conn:
        conn.execute("""
            INSERT OR REPLACE INTO copilot_cache (image_hash, data, created_at)
            VALUES (?, ?, ?)
        """, (image_hash, cache_data['data'], cache_data['created_at']))
        conn.commit()

async def get_cached_analysis(image_hash: str) -> Optional[dict]:
    """Retrieves analysis data from database"""
    with sqlite3.connect(db.db_path) as conn:
        cursor = conn.execute("SELECT data FROM copilot_cache WHERE image_hash = ?", (image_hash,))
        row = cursor.fetchone()
        if row:
            return json.loads(row[0])
    return None

async def get_artisan_glossary(artisan_id: str, language_code: str) -> dict:
    """Placeholder for artisan glossary"""
    return {}