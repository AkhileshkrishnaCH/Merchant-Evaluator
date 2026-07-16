export interface MerchantMetrics {
  revenue_growth: number;
  transaction_trend: number;
  average_order_value: number;
  customer_review_trend: number;
  repeat_purchase_rate: number;
  login_frequency: number;
  days_since_last_activity: number;
  feature_adoption_score: number;
  support_sentiment: number;
  renewal_history: number;
  refund_rate: number;
  delivery_failure_rate: number;
}

export interface MetricBreakdown {
  metric: string;
  label: string;
  score: number;
  weight: number;
  weighted_score: number;
}

export interface HealthScoreResponse {
  health_score: number;
  risk_level: string;
  metric_scores: Record<string, number>;
  breakdown: MetricBreakdown[];
  critical_alerts: string[];
}

export interface AIAnalysisResponse {
  summary: string;
  risk_factors: string[];
  recommendations: string[];
  priority: string;
}

export interface SimulationResponse {
  health: HealthScoreResponse;
  ai_analysis: AIAnalysisResponse;
  merchant_name: string;
}

export interface HistoricalDataPoint {
  month: string;
  value: number;
}

export interface HistoricalData {
  revenue_history: HistoricalDataPoint[];
  transaction_history: HistoricalDataPoint[];
  login_history: HistoricalDataPoint[];
  review_history: HistoricalDataPoint[];
}

export interface MerchantData {
  id: string;
  name: string;
  metrics: MerchantMetrics;
  historical_data: HistoricalData;
}

export interface MerchantWithHealth {
  merchant: MerchantData;
  health: HealthScoreResponse;
}
