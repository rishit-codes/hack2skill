import logging
from typing import Optional
from datetime import datetime
import hashlib
import bcrypt

from app.cloud_services.database import get_database_client
from app.schemas.auth import UserRegisterRequest, UserUpdateRequest, UserResponse

logger = logging.getLogger(__name__)

class UserService:
    """Service layer for user management"""
    
    def __init__(self):
        self.db = get_database_client()
        self.collection_name = "users"

    def _generate_user_id(self, email: str) -> str:
        """Generate unique user ID from email"""
        return hashlib.sha256(email.encode()).hexdigest()[:16]

    def _hash_password(self, password: str) -> str:
        """Hash password using bcrypt"""
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
        return hashed.decode('utf-8')

    def _verify_password(self, password: str, hashed_password: str) -> bool:
        """Verify password against hash"""
        return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))

    async def create_user(self, user_data: UserRegisterRequest) -> Optional[UserResponse]:
        """
        Create a new user account
        
        Args:
            user_data: Validated user registration data
            
        Returns:
            UserResponse if successful, None if user already exists
            
        Raises:
            Exception: If database operation fails
        """
        try:
            user_id = self._generate_user_id(user_data.email)
            
            # Check if user already exists
            existing_user = self.db.get_document(self.collection_name, user_id)
            if existing_user:
                logger.warning(f"User with email {user_data.email} already exists")
                return None

            # Hash password
            hashed_password = self._hash_password(user_data.password)

            # Prepare user document
            now = datetime.utcnow()
            user_doc = {
                "user_id": user_id,
                "email": user_data.email,
                "password_hash": hashed_password,
                "name": user_data.name,
                "phone": user_data.phone,
                "location": user_data.location,
                "bio": user_data.bio,
                "avatar_url": None,
                "created_at": now,
                "updated_at": now,
            }

            # Save to database
            self.db.set_document(self.collection_name, user_id, user_doc)
            
            logger.info(f"Created user: {user_id}")
            
            # Return user response (without password hash)
            return UserResponse(
                user_id=user_id,
                email=user_data.email,
                name=user_data.name,
                phone=user_data.phone,
                location=user_data.location,
                bio=user_data.bio,
                avatar_url=None,
                created_at=now,
                updated_at=now
            )

        except Exception as e:
            logger.error(f"Failed to create user: {e}", exc_info=True)
            raise

    async def authenticate_user(self, email: str, password: str) -> Optional[UserResponse]:
        """
        Authenticate user with email and password
        
        Args:
            email: User email
            password: Plain text password
            
        Returns:
            UserResponse if authentication successful, None otherwise
        """
        try:
            user_id = self._generate_user_id(email)
            user_data = self.db.get_document(self.collection_name, user_id)
            
            if not user_data:
                logger.warning(f"User not found: {email}")
                return None
            
            # Verify password
            if not self._verify_password(password, user_data["password_hash"]):
                logger.warning(f"Invalid password for user: {email}")
                return None

            # Return user response
            return UserResponse(
                user_id=user_data["user_id"],
                email=user_data["email"],
                name=user_data["name"],
                phone=user_data.get("phone"),
                location=user_data.get("location"),
                bio=user_data.get("bio"),
                avatar_url=user_data.get("avatar_url"),
                created_at=user_data["created_at"],
                updated_at=user_data["updated_at"]
            )

        except Exception as e:
            logger.error(f"Authentication failed: {e}", exc_info=True)
            return None

    async def get_user(self, user_id: str) -> Optional[UserResponse]:
        """
        Get user by ID
        
        Args:
            user_id: User identifier
            
        Returns:
            UserResponse if found, None otherwise
        """
        try:
            user_data = self.db.get_document(self.collection_name, user_id)
            
            if not user_data:
                return None
            
            return UserResponse(
                user_id=user_data["user_id"],
                email=user_data["email"],
                name=user_data["name"],
                phone=user_data.get("phone"),
                location=user_data.get("location"),
                bio=user_data.get("bio"),
                avatar_url=user_data.get("avatar_url"),
                created_at=user_data["created_at"],
                updated_at=user_data["updated_at"]
            )

        except Exception as e:
            logger.error(f"Failed to get user: {e}", exc_info=True)
            return None

    async def update_user(self, user_id: str, update_data: UserUpdateRequest) -> Optional[UserResponse]:
        """
        Update user profile
        
        Args:
            user_id: User to update
            update_data: Fields to update
            
        Returns:
            Updated UserResponse or None if not found
        """
        try:
            user_data = self.db.get_document(self.collection_name, user_id)
            
            if not user_data:
                logger.warning(f"User not found: {user_id}")
                return None

            # Prepare update data
            update_dict = update_data.model_dump(exclude_unset=True, exclude_none=True)
            update_dict["updated_at"] = datetime.utcnow()

            # Update in database
            self.db.update_document(self.collection_name, user_id, update_dict)

            # Get updated user
            user_data = self.db.get_document(self.collection_name, user_id)

            return UserResponse(
                user_id=user_data["user_id"],
                email=user_data["email"],
                name=user_data["name"],
                phone=user_data.get("phone"),
                location=user_data.get("location"),
                bio=user_data.get("bio"),
                avatar_url=user_data.get("avatar_url"),
                created_at=user_data["created_at"],
                updated_at=user_data["updated_at"]
            )

        except Exception as e:
            logger.error(f"Failed to update user: {e}", exc_info=True)
            return None

# Create singleton instance
user_service = UserService()
