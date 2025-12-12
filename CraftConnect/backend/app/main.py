import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
from app.config.settings import settings
                     # ------  feature import ------ 
from app.routes import storyteller, copilot, pricing, recommender, products, auth, users, sales, dashboard
try:
    from app.routes import static
    HAS_STATIC = True
except ImportError:
    HAS_STATIC = False

# ------------------------------------------------------------------

os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = settings.GOOGLE_APPLICATION_CREDENTIALS




app = FastAPI(
    title="CraftConnect AI API",
    description="The backend service for the CraftConnect marketplace."
)

# Configure CORS for frontend-backend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Next.js development server
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "https://*.vercel.app",  # Vercel deployments
    ],
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Include routers
app.include_router(auth.router)                 # Authentication
app.include_router(users.router)                # User management
app.include_router(copilot.router)              # Image analysis
app.include_router(storyteller.router, prefix="/storyteller", tags=["Storyteller"])
app.include_router(pricing.router, prefix="/pricing")
app.include_router(recommender.router, prefix="/recs", tags=["Recommendations"])
app.include_router(products.router)             # Products CRUD
app.include_router(sales.router)                # Sales tracking
app.include_router(dashboard.router)            # Dashboard analytics
if HAS_STATIC:
    app.include_router(static.router)           # Static file serving

# Mount static files for serving uploaded images
uploads_dir = os.path.join(os.getcwd(), "uploads")
os.makedirs(uploads_dir, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")


@app.get("/")
def read_root():
    return {"message": "CraftConnect API is running"}