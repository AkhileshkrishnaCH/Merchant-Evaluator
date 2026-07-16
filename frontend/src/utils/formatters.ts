export function formatPercentage(val: number): string {
  const sign = val > 0 ? '+' : '';
  return `${sign}${val.toFixed(1)}%`;
}

export function formatCurrency(val: number): string {
  return `$${val.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export function formatNumber(val: number): string {
  return val.toLocaleString('en-US');
}

export function getRiskColor(riskLevel: string): string {
  const colors: Record<string, string> = {
    'Excellent': '#10b981',
    'Healthy': '#34d399',
    'Stable': '#fbbf24',
    'At Risk': '#f97316',
    'Critical': '#ef4444',
  };
  return colors[riskLevel] || '#6b7280';
}

export function getRiskBgColor(riskLevel: string): string {
  const colors: Record<string, string> = {
    'Excellent': 'rgba(16, 185, 129, 0.1)',
    'Healthy': 'rgba(52, 211, 153, 0.1)',
    'Stable': 'rgba(251, 191, 36, 0.1)',
    'At Risk': 'rgba(249, 115, 22, 0.1)',
    'Critical': 'rgba(239, 68, 68, 0.1)',
  };
  return colors[riskLevel] || 'rgba(107, 114, 128, 0.1)';
}

export function getMetricLabel(key: string): string {
  const labels: Record<string, string> = {
    revenue_growth: 'Revenue Growth',
    transaction_trend: 'Transaction Trend',
    average_order_value: 'Avg. Order Value',
    customer_review_trend: 'Review Trend',
    repeat_purchase_rate: 'Repeat Purchases',
    login_frequency: 'Login Frequency',
    days_since_last_activity: 'Days Inactive',
    feature_adoption_score: 'Feature Adoption',
    support_sentiment: 'Support Sentiment',
    renewal_history: 'Renewal History',
    refund_rate: 'Refund Rate',
    delivery_failure_rate: 'Delivery Failures',
  };
  return labels[key] || key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

export function getTrendDirection(val: number): 'up' | 'down' | 'flat' {
  if (val > 0.5) return 'up';
  if (val < -0.5) return 'down';
  return 'flat';
}

export function getPriorityColor(priority: string): string {
  const colors: Record<string, string> = {
    urgent: '#ef4444',
    high: '#f97316',
    medium: '#fbbf24',
    low: '#10b981',
  };
  return colors[priority] || '#6b7280';
}
