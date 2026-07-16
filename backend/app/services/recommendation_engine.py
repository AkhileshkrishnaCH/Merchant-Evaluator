"""Deterministic recommendation engine — fallback when LLM is unavailable."""

from app.schemas.merchant import MerchantMetrics, AIAnalysisResponse


def identify_risk_factors(metrics: MerchantMetrics, thresholds: dict) -> list[str]:
    """Analyze metrics against thresholds and return human-readable risk factors."""
    critical = thresholds["critical"]
    risk_factors: list[str] = []

    if metrics.revenue_growth < 0:
        risk_factors.append(f"Revenue is declining at {metrics.revenue_growth}%")
    if metrics.transaction_trend < 0:
        risk_factors.append(f"Transaction volume is declining at {metrics.transaction_trend}%")
    if metrics.refund_rate > critical["refund_rate_critical"]:
        risk_factors.append(f"Refund rate of {metrics.refund_rate}% is critically high")
    elif metrics.refund_rate > 10:
        risk_factors.append(f"Refund rate of {metrics.refund_rate}% is elevated")
    if metrics.delivery_failure_rate > critical["delivery_failure_critical"]:
        risk_factors.append(f"Delivery failure rate of {metrics.delivery_failure_rate}% is critically high")
    elif metrics.delivery_failure_rate > 8:
        risk_factors.append(f"Delivery failure rate of {metrics.delivery_failure_rate}% is concerning")
    if metrics.support_sentiment < critical["sentiment_critical"]:
        risk_factors.append(f"Support sentiment score of {metrics.support_sentiment} indicates severe customer dissatisfaction")
    elif metrics.support_sentiment < 5:
        risk_factors.append(f"Support sentiment score of {metrics.support_sentiment} is below average")
    if metrics.days_since_last_activity > critical["inactivity_warning_days"]:
        risk_factors.append(f"Merchant has been inactive for {int(metrics.days_since_last_activity)} days")
    elif metrics.days_since_last_activity > 30:
        risk_factors.append(f"Merchant activity is low — {int(metrics.days_since_last_activity)} days since last login")
    if metrics.repeat_purchase_rate < 20:
        risk_factors.append(f"Repeat purchase rate of {metrics.repeat_purchase_rate}% is very low")
    if metrics.feature_adoption_score < 25:
        risk_factors.append(f"Feature adoption at {metrics.feature_adoption_score}% — merchant underutilizing platform")
    if metrics.customer_review_trend < 0:
        risk_factors.append(f"Customer reviews are trending downward ({metrics.customer_review_trend})")
    if metrics.login_frequency < 5:
        risk_factors.append(f"Login frequency of {int(metrics.login_frequency)}/month is very low")
    if metrics.renewal_history < 2:
        risk_factors.append(f"Low renewal history ({int(metrics.renewal_history)}) suggests churn risk")

    return risk_factors


def generate_fallback_recommendations(
    risk_factors: list[str], risk_level: str
) -> AIAnalysisResponse:
    """Generate rule-based recommendations when LLM is unavailable."""
    recommendations: list[str] = []
    summary_parts: list[str] = []

    # Build summary
    if risk_level == "Critical":
        summary_parts.append("This merchant is in critical condition and requires immediate intervention.")
    elif risk_level == "At Risk":
        summary_parts.append("This merchant shows concerning trends that need proactive attention.")
    elif risk_level == "Stable":
        summary_parts.append("This merchant is performing at a stable level with room for improvement.")
    elif risk_level == "Healthy":
        summary_parts.append("This merchant is performing well across most metrics.")
    else:
        summary_parts.append("This merchant is performing excellently across all key metrics.")

    if risk_factors:
        summary_parts.append(f"Key areas of concern include: {', '.join(risk_factors[:3]).lower()}.")
    else:
        summary_parts.append("No critical risk factors were identified.")

    # Generate recommendations based on risk factors
    for factor in risk_factors:
        factor_lower = factor.lower()
        if "revenue" in factor_lower and "declining" in factor_lower:
            recommendations.append("Launch targeted promotional campaigns to boost revenue. Consider bundle deals or seasonal discounts.")
        elif "refund" in factor_lower:
            recommendations.append("Investigate root causes of refunds. Improve product descriptions and quality checks before shipment.")
        elif "delivery" in factor_lower:
            recommendations.append("Review logistics partners and shipping processes. Consider adding delivery tracking and proactive customer communication.")
        elif "sentiment" in factor_lower or "dissatisfaction" in factor_lower:
            recommendations.append("Prioritize customer support training and response time improvement. Implement a feedback loop to address recurring complaints.")
        elif "inactive" in factor_lower or "activity" in factor_lower:
            recommendations.append("Set up re-engagement campaigns with personalized offers. Schedule a merchant check-in call to understand barriers.")
        elif "repeat purchase" in factor_lower:
            recommendations.append("Implement a loyalty program or repeat-purchase incentives. Improve post-purchase follow-up communications.")
        elif "feature adoption" in factor_lower:
            recommendations.append("Provide guided onboarding tutorials and highlight underused features. Consider assigning a dedicated account manager.")
        elif "review" in factor_lower and "downward" in factor_lower:
            recommendations.append("Analyze recent negative reviews for common themes. Address product quality and customer service gaps.")
        elif "login" in factor_lower:
            recommendations.append("Send platform update notifications and demonstrate new features that could benefit the merchant.")
        elif "renewal" in factor_lower:
            recommendations.append("Offer early renewal incentives and demonstrate ROI to encourage long-term commitment.")
        elif "transaction" in factor_lower:
            recommendations.append("Analyze transaction drop-off points and optimize the checkout experience. Consider expanding payment options.")

    # Add general recommendations if we have too few
    if len(recommendations) < 2:
        if risk_level in ("Critical", "At Risk"):
            recommendations.append("Schedule an urgent business review meeting with the merchant to discuss performance improvement strategies.")
            recommendations.append("Create a 30-day action plan with measurable milestones for recovery.")
        else:
            recommendations.append("Continue monitoring key metrics and maintain current engagement strategies.")
            recommendations.append("Explore opportunities for cross-selling and upselling to maximize merchant growth.")

    # Determine priority
    if risk_level in ("Critical",):
        priority = "urgent"
    elif risk_level in ("At Risk",):
        priority = "high"
    elif risk_level in ("Stable",):
        priority = "medium"
    else:
        priority = "low"

    return AIAnalysisResponse(
        summary=" ".join(summary_parts),
        risk_factors=risk_factors[:5],
        recommendations=recommendations[:5],
        priority=priority,
    )
