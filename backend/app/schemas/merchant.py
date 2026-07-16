"""Pydantic schemas for request/response validation."""

from pydantic import BaseModel, Field
from typing import Optional


class MerchantMetrics(BaseModel):
    """All 12 merchant health metrics."""

    revenue_growth: float = Field(..., ge=-50, le=100, description="Revenue growth percentage")
    transaction_trend: float = Field(..., ge=-50, le=100, description="Transaction trend percentage")
    average_order_value: float = Field(..., ge=0, le=500, description="Average order value in dollars")
    customer_review_trend: float = Field(..., ge=-2, le=5, description="Customer review trend score")
    repeat_purchase_rate: float = Field(..., ge=0, le=100, description="Repeat purchase rate percentage")
    login_frequency: float = Field(..., ge=0, le=30, description="Login frequency per month")
    days_since_last_activity: float = Field(..., ge=0, le=90, description="Days since last activity")
    feature_adoption_score: float = Field(..., ge=0, le=100, description="Feature adoption score percentage")
    support_sentiment: float = Field(..., ge=1, le=10, description="Support sentiment score 1-10")
    renewal_history: float = Field(..., ge=0, le=10, description="Renewal history count")
    refund_rate: float = Field(..., ge=0, le=50, description="Refund rate percentage")
    delivery_failure_rate: float = Field(..., ge=0, le=50, description="Delivery failure rate percentage")


class MetricBreakdown(BaseModel):
    """Single metric contribution to the health score."""

    metric: str
    label: str
    score: float
    weight: float
    weighted_score: float


class HealthScoreResponse(BaseModel):
    """Health score calculation result."""

    health_score: float
    risk_level: str
    metric_scores: dict[str, float]
    breakdown: list[MetricBreakdown]
    critical_alerts: list[str]


class AIAnalysisRequest(BaseModel):
    """Request payload for LLM analysis."""

    health_score: float
    risk_level: str
    metrics: MerchantMetrics
    top_risk_factors: list[str]


class AIAnalysisResponse(BaseModel):
    """LLM analysis output."""

    summary: str
    risk_factors: list[str]
    recommendations: list[str]
    priority: str


class SimulationRequest(BaseModel):
    """Request payload for full simulation."""

    metrics: MerchantMetrics
    merchant_name: Optional[str] = "Custom Merchant"


class SimulationResponse(BaseModel):
    """Full simulation result."""

    health: HealthScoreResponse
    ai_analysis: AIAnalysisResponse
    merchant_name: str


class HistoricalDataPoint(BaseModel):
    """A single data point in historical data."""

    month: str
    value: float


class HistoricalData(BaseModel):
    """Historical data for charts."""

    revenue_history: list[HistoricalDataPoint]
    transaction_history: list[HistoricalDataPoint]
    login_history: list[HistoricalDataPoint]
    review_history: list[HistoricalDataPoint]


class MerchantData(BaseModel):
    """Complete merchant data including metrics and history."""

    id: str
    name: str
    metrics: MerchantMetrics
    historical_data: HistoricalData


class MerchantWithHealth(BaseModel):
    """Merchant data combined with calculated health score."""

    merchant: MerchantData
    health: HealthScoreResponse
