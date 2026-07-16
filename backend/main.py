"""AI Merchant Health Dashboard — FastAPI Application."""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import router
from app.models.merchant import create_tables

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan — startup and shutdown events."""
    logger.info("Starting AI Merchant Health Dashboard API...")
    await create_tables()
    logger.info("Database tables created.")
    yield
    logger.info("Shutting down...")


app = FastAPI(
    title="AI Merchant Health Dashboard API",
    description="Evaluates merchant health using deterministic rules and AI-powered insights.",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS — allow all origins in development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API routes
app.include_router(router, prefix="/api")


@app.get("/")
async def root():
    """Root health check endpoint."""
    return {"status": "running", "app": "AI Merchant Health Dashboard API", "version": "1.0.0"}
