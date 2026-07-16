"""Prompt builder for LLM analysis."""

from app.schemas.merchant import MerchantMetrics


def build_analysis_prompt(
    health_score: float,
    risk_level: str,
    metrics: MerchantMetrics,
    risk_factors: list[str],
) -> str:
    """Build a structured prompt for the LLM to generate merchant analysis.

    The prompt instructs the LLM to return ONLY valid JSON.
    """
    metrics_dict = metrics.model_dump()

    metrics_text = "\n".join(
        f"  - {key.replace('_', ' ').title()}: {value}"
        for key, value in metrics_dict.items()
    )

    risk_factors_text = "\n".join(f"  - {rf}" for rf in risk_factors) if risk_factors else "  - None identified"

    prompt = f"""You are an AI business analyst specializing in merchant health evaluation for e-commerce platforms.

Analyze the following merchant health data and provide actionable insights.

## Merchant Health Data
- Health Score: {health_score}/100
- Risk Level: {risk_level}

## Current Metrics
{metrics_text}

## Identified Risk Factors
{risk_factors_text}

## Your Task
Provide a comprehensive analysis as a JSON object with EXACTLY these keys:
1. "summary" — A 2-3 sentence executive summary of the merchant's health status, key strengths, and primary concerns. Write in a professional but accessible tone.
2. "risk_factors" — An array of 3-5 specific risk factors, ordered by severity. Each should be a clear, actionable statement.
3. "recommendations" — An array of 3-5 prioritized, specific, actionable recommendations. Each recommendation should be concrete (not vague) and include what to do and why.
4. "priority" — One of: "urgent", "high", "medium", "low" based on the overall risk assessment.

IMPORTANT: Return ONLY the JSON object. No markdown formatting, no code blocks, no extra text. Just the raw JSON."""

    return prompt
