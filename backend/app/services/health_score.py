"""Deterministic health score calculation engine."""

from app.schemas.merchant import MerchantMetrics, HealthScoreResponse, MetricBreakdown
from app.utils.helpers import clamp, get_metric_label


def normalize_metric(value: float, min_val: float, max_val: float, inverted: bool = False) -> float:
    """Normalize a raw metric value to a 0-100 score.

    For inverted metrics (like refund_rate), lower raw values produce higher scores.
    """
    if max_val == min_val:
        return 50.0

    clamped = clamp(value, min_val, max_val)
    normalized = ((clamped - min_val) / (max_val - min_val)) * 100

    if inverted:
        normalized = 100 - normalized

    return round(clamp(normalized, 0, 100), 2)


def classify_risk(score: float) -> str:
    """Classify a health score into a risk level."""
    if score >= 90:
        return "Excellent"
    elif score >= 75:
        return "Healthy"
    elif score >= 60:
        return "Stable"
    elif score >= 40:
        return "At Risk"
    else:
        return "Critical"


def calculate_health_score(
    metrics: MerchantMetrics,
    weights: dict[str, float],
    thresholds: dict,
) -> HealthScoreResponse:
    """Calculate the merchant health score using weighted scoring + critical rules.

    1. Normalize every metric to 0-100.
    2. Compute weighted sum.
    3. Apply critical rule penalties.
    4. Clamp to [0, 100] and classify risk.
    """
    normalization = thresholds["normalization"]
    critical = thresholds["critical"]

    metrics_dict = metrics.model_dump()
    metric_scores: dict[str, float] = {}
    breakdown: list[MetricBreakdown] = []

    # Step 1 & 2: Normalize and build breakdown
    weighted_sum = 0.0
    for metric_key, raw_value in metrics_dict.items():
        norm_cfg = normalization[metric_key]
        score = normalize_metric(
            value=raw_value,
            min_val=norm_cfg["min"],
            max_val=norm_cfg["max"],
            inverted=norm_cfg.get("inverted", False),
        )
        metric_scores[metric_key] = score

        weight = weights.get(metric_key, 0.0)
        weighted_score = score * weight
        weighted_sum += weighted_score

        breakdown.append(
            MetricBreakdown(
                metric=metric_key,
                label=get_metric_label(metric_key),
                score=round(score, 2),
                weight=weight,
                weighted_score=round(weighted_score, 2),
            )
        )

    # Step 3: Apply critical rules
    penalties = 0.0
    critical_alerts: list[str] = []
    force_critical = False

    # Refund rate critical
    if metrics.refund_rate > critical["refund_rate_critical"]:
        penalties -= 15
        critical_alerts.append(
            f"High refund rate ({metrics.refund_rate}%) exceeds critical threshold of {critical['refund_rate_critical']}%"
        )

    # Delivery failure critical
    if metrics.delivery_failure_rate > critical["delivery_failure_critical"]:
        penalties -= 15
        critical_alerts.append(
            f"High delivery failure rate ({metrics.delivery_failure_rate}%) exceeds critical threshold of {critical['delivery_failure_critical']}%"
        )

    # Support sentiment critical
    if metrics.support_sentiment < critical["sentiment_critical"]:
        penalties -= 20
        force_critical = True
        critical_alerts.append(
            f"Support sentiment ({metrics.support_sentiment}) is critically low (below {critical['sentiment_critical']})"
        )

    # Inactivity warning
    if metrics.days_since_last_activity > critical["inactivity_warning_days"]:
        penalties -= 10
        critical_alerts.append(
            f"Merchant inactive for {metrics.days_since_last_activity} days (threshold: {critical['inactivity_warning_days']} days)"
        )

    # Revenue decline
    if metrics.revenue_growth < critical["revenue_decline_threshold"]:
        penalties -= 10
        critical_alerts.append(
            f"Revenue declining at {metrics.revenue_growth}% (below {critical['revenue_decline_threshold']}% threshold)"
        )

    # Step 4: Final score
    final_score = clamp(weighted_sum + penalties, 0, 100)
    risk_level = "Critical" if force_critical else classify_risk(final_score)

    # Sort breakdown by weighted_score descending
    breakdown.sort(key=lambda x: x.weighted_score, reverse=True)

    return HealthScoreResponse(
        health_score=round(final_score, 1),
        risk_level=risk_level,
        metric_scores=metric_scores,
        breakdown=breakdown,
        critical_alerts=critical_alerts,
    )
