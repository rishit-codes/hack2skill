import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import vertexai
from contextlib import asynccontextmanager
from app.config.settings import settings
                     # ------  feature import ------ 
from app.routes import storyteller, copilot, pricing, recommender, products

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

vertexai.init(project=settings.PROJECT_ID, location=settings.REGION)

app.include_router(copilot.router)      # Include your routers
app.include_router(storyteller.router, prefix="/storyteller", tags=["Storyteller"])    # storyteller router
app.include_router(pricing.router, prefix="/pricing")               # pricing router
app.include_router(recommender.router, prefix="/recs", tags=["Recommendations"])     # recommender router
app.include_router(products.router)     # products router


@app.get("/")
def read_root():
    return {"message": "CraftConnect API is running"}