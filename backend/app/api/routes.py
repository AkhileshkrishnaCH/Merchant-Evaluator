"""API route handlers for the Merchant Health Dashboard."""

import logging
from fastapi import APIRouter, HTTPException

from app.config.settings import get_settings
from app.schemas.merchant import (
    MerchantMetrics,
    HealthScoreResponse,
    AIAnalysisRequest,
    AIAnalysisResponse,
    SimulationRequest,
    SimulationResponse,
    MerchantData,
    MerchantWithHealth,
    HistoricalData,
    HistoricalDataPoint,
)
from app.services.health_score import calculate_health_score
from app.services.recommendation_engine import identify_risk_factors
from app.services.llm_service import LLMService

logger = logging.getLogger(__name__)
router = APIRouter()

# Initialize services
settings = get_settings()
llm_service = LLMService(api_key=settings.GEMINI_API_KEY, thresholds=settings.thresholds)


def _parse_merchant_data(raw: dict) -> MerchantData:
    """Parse raw merchant dict into MerchantData model."""
    hist = raw["historical_data"]
    return MerchantData(
        id=raw["id"],
        name=raw["name"],
        metrics=MerchantMetrics(**raw["metrics"]),
        historical_data=HistoricalData(
            revenue_history=[HistoricalDataPoint(**p) for p in hist["revenue_history"]],
            transaction_history=[HistoricalDataPoint(**p) for p in hist["transaction_history"]],
            login_history=[HistoricalDataPoint(**p) for p in hist["login_history"]],
            review_history=[HistoricalDataPoint(**p) for p in hist["review_history"]],
        ),
    )


@router.get("/merchants", response_model=list[MerchantData])
async def get_merchants():
    """Return all sample merchants."""
    try:
        raw_merchants = settings.sample_merchants
        return [_parse_merchant_data(m) for m in raw_merchants]
    except Exception as e:
        logger.error(f"Error loading merchants: {e}")
        raise HTTPException(status_code=500, detail="Failed to load merchant data")


@router.get("/merchant/{merchant_id}", response_model=MerchantWithHealth)
async def get_merchant(merchant_id: str):
    """Return a specific merchant with calculated health score."""
    try:
        raw_merchants = settings.sample_merchants
        merchant_raw = next((m for m in raw_merchants if m["id"] == merchant_id), None)

        if not merchant_raw:
            raise HTTPException(status_code=404, detail=f"Merchant '{merchant_id}' not found")

        merchant = _parse_merchant_data(merchant_raw)
        health = calculate_health_score(merchant.metrics, settings.weights, settings.thresholds)

        return MerchantWithHealth(merchant=merchant, health=health)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching merchant {merchant_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch merchant data")


@router.post("/simulate", response_model=SimulationResponse)
async def simulate(request: SimulationRequest):
    """Full simulation: calculate health score + AI analysis."""
    try:
        # Calculate health score
        health = calculate_health_score(request.metrics, settings.weights, settings.thresholds)

        # Identify risk factors
        risk_factors = identify_risk_factors(request.metrics, settings.thresholds)

        # Get AI analysis
        ai_analysis = await llm_service.analyze(
            health_score=health.health_score,
            risk_level=health.risk_level,
            metrics=request.metrics,
            risk_factors=risk_factors,
        )

        return SimulationResponse(
            health=health,
            ai_analysis=ai_analysis,
            merchant_name=request.merchant_name or "Custom Merchant",
        )
    except Exception as e:
        logger.error(f"Simulation error: {e}")
        raise HTTPException(status_code=500, detail=f"Simulation failed: {str(e)}")


@router.post("/calculate-health", response_model=HealthScoreResponse)
async def calculate_health(metrics: MerchantMetrics):
    """Calculate health score only (no LLM)."""
    try:
        return calculate_health_score(metrics, settings.weights, settings.thresholds)
    except Exception as e:
        logger.error(f"Health calculation error: {e}")
        raise HTTPException(status_code=500, detail=f"Calculation failed: {str(e)}")


@router.post("/ai-analysis", response_model=AIAnalysisResponse)
async def ai_analysis(request: AIAnalysisRequest):
    """Get AI analysis from pre-computed health data."""
    try:
        return await llm_service.analyze(
            health_score=request.health_score,
            risk_level=request.risk_level,
            metrics=request.metrics,
            risk_factors=request.top_risk_factors,
        )
    except Exception as e:
        logger.error(f"AI analysis error: {e}")
        raise HTTPException(status_code=500, detail=f"AI analysis failed: {str(e)}")
