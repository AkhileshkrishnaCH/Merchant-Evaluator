"""Utility helper functions."""


def clamp(value: float, min_val: float, max_val: float) -> float:
    """Clamp a value between min and max."""
    return max(min_val, min(max_val, value))


def format_percentage(value: float) -> str:
    """Format a number as percentage string."""
    sign = "+" if value > 0 else ""
    return f"{sign}{value:.1f}%"


def format_currency(value: float) -> str:
    """Format a number as currency string."""
    return f"${value:,.2f}"


def get_risk_color(risk_level: str) -> str:
    """Return hex color for a given risk level."""
    colors = {
        "Excellent": "#10b981",
        "Healthy": "#34d399",
        "Stable": "#fbbf24",
        "At Risk": "#f97316",
        "Critical": "#ef4444",
    }
    return colors.get(risk_level, "#6b7280")


METRIC_LABELS = {
    "revenue_growth": "Revenue Growth",
    "transaction_trend": "Transaction Trend",
    "average_order_value": "Average Order Value",
    "customer_review_trend": "Customer Review Trend",
    "repeat_purchase_rate": "Repeat Purchase Rate",
    "login_frequency": "Login Frequency",
    "days_since_last_activity": "Days Since Last Activity",
    "feature_adoption_score": "Feature Adoption Score",
    "support_sentiment": "Support Sentiment",
    "renewal_history": "Renewal History",
    "refund_rate": "Refund Rate",
    "delivery_failure_rate": "Delivery Failure Rate",
}


def get_metric_label(key: str) -> str:
    """Convert a metric key to a human-readable label."""
    return METRIC_LABELS.get(key, key.replace("_", " ").title())
