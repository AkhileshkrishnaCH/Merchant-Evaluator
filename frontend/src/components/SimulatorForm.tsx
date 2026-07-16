import { useState } from 'react';
import { Loader2, AlertTriangle, DollarSign, TrendingUp, ShoppingCart, Star, LogIn, Clock, Zap, Shield, Repeat, Package, ThumbsDown } from 'lucide-react';
import type { MerchantMetrics } from '../types/merchant';
import { getMetricLabel } from '../utils/formatters';

interface SimulatorFormProps {
  onSubmit: (metrics: MerchantMetrics, name: string) => void;
  isLoading: boolean;
  initialMetrics?: MerchantMetrics;
}

interface MetricConfig {
  key: keyof MerchantMetrics;
  min: number;
  max: number;
  step: number;
  icon: React.ReactNode;
  description: string;
  dangerThreshold?: { value: number; direction: 'above' | 'below' };
  unit?: string;
}

const METRIC_CONFIGS: MetricConfig[] = [
  { key: 'revenue_growth', min: -50, max: 100, step: 1, icon: <DollarSign size={16} />, description: 'Monthly revenue change', unit: '%' },
  { key: 'transaction_trend', min: -50, max: 100, step: 1, icon: <TrendingUp size={16} />, description: 'Transaction volume trend', unit: '%' },
  { key: 'average_order_value', min: 0, max: 500, step: 5, icon: <ShoppingCart size={16} />, description: 'Average order amount', unit: '$' },
  { key: 'customer_review_trend', min: -2, max: 5, step: 0.1, icon: <Star size={16} />, description: 'Review score trend' },
  { key: 'repeat_purchase_rate', min: 0, max: 100, step: 1, icon: <Repeat size={16} />, description: 'Returning customers', unit: '%' },
  { key: 'login_frequency', min: 0, max: 30, step: 1, icon: <LogIn size={16} />, description: 'Logins per month' },
  { key: 'days_since_last_activity', min: 0, max: 90, step: 1, icon: <Clock size={16} />, description: 'Inactivity period', dangerThreshold: { value: 45, direction: 'above' } },
  { key: 'feature_adoption_score', min: 0, max: 100, step: 1, icon: <Zap size={16} />, description: 'Platform feature usage', unit: '%' },
  { key: 'support_sentiment', min: 1, max: 10, step: 1, icon: <Shield size={16} />, description: 'Customer satisfaction', dangerThreshold: { value: 3, direction: 'below' } },
  { key: 'renewal_history', min: 0, max: 10, step: 1, icon: <Repeat size={16} />, description: 'Subscription renewals' },
  { key: 'refund_rate', min: 0, max: 50, step: 0.5, icon: <ThumbsDown size={16} />, description: 'Refund percentage', dangerThreshold: { value: 20, direction: 'above' }, unit: '%' },
  { key: 'delivery_failure_rate', min: 0, max: 50, step: 0.5, icon: <Package size={16} />, description: 'Failed deliveries', dangerThreshold: { value: 15, direction: 'above' }, unit: '%' },
];

const DEFAULT_METRICS: MerchantMetrics = {
  revenue_growth: 15, transaction_trend: 10, average_order_value: 120,
  customer_review_trend: 0.5, repeat_purchase_rate: 45, login_frequency: 12,
  days_since_last_activity: 5, feature_adoption_score: 60, support_sentiment: 7,
  renewal_history: 5, refund_rate: 5, delivery_failure_rate: 3,
};

export default function SimulatorForm({ onSubmit, isLoading, initialMetrics }: SimulatorFormProps) {
  const [name, setName] = useState('Custom Merchant');
  const [metrics, setMetrics] = useState<MerchantMetrics>(initialMetrics || DEFAULT_METRICS);

  const updateMetric = (key: keyof MerchantMetrics, value: number) => {
    setMetrics(prev => ({ ...prev, [key]: value }));
  };

  const isDangerous = (config: MetricConfig) => {
    if (!config.dangerThreshold) return false;
    const val = metrics[config.key];
    return config.dangerThreshold.direction === 'above'
      ? val > config.dangerThreshold.value
      : val < config.dangerThreshold.value;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(metrics, name);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="glass-card animate-fade-in-up" style={{ '--delay': '100ms' } as React.CSSProperties}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 20, color: 'var(--text-primary)' }}>
          Merchant Simulator
        </h2>

        {/* Merchant Name */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
            Merchant Name
          </label>
          <input
            type="text" value={name}
            onChange={e => setName(e.target.value)}
            style={{
              width: '100%', padding: '0.6rem 0.9rem', borderRadius: 10,
              border: '1px solid var(--border-color)', background: 'var(--bg-surface-elevated)',
              color: 'var(--text-primary)', fontSize: '0.9rem', outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--accent)'}
            onBlur={e => e.target.style.borderColor = 'var(--border-color)'}
          />
        </div>

        {/* Metric Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 16,
          marginBottom: 24,
        }}>
          {METRIC_CONFIGS.map(config => {
            const dangerous = isDangerous(config);
            return (
              <div key={config.key} style={{
                padding: 14, borderRadius: 14,
                border: `1px solid ${dangerous ? 'rgba(239,68,68,0.3)' : 'var(--border-color)'}`,
                background: dangerous ? 'rgba(239,68,68,0.03)' : 'var(--accent-light)',
                transition: 'all 0.2s ease',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ color: dangerous ? '#ef4444' : 'var(--accent)' }}>{config.icon}</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {getMetricLabel(config.key)}
                    </span>
                  </div>
                  {dangerous && <AlertTriangle size={14} color="#ef4444" />}
                </div>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: 10 }}>
                  {config.description}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <input
                    type="range"
                    min={config.min} max={config.max} step={config.step}
                    value={metrics[config.key]}
                    onChange={e => updateMetric(config.key, parseFloat(e.target.value))}
                    style={{ flex: 1 }}
                  />
                  <input
                    type="number"
                    min={config.min} max={config.max} step={config.step}
                    value={metrics[config.key]}
                    onChange={e => updateMetric(config.key, parseFloat(e.target.value) || 0)}
                    style={{
                      width: 64, padding: '4px 6px', borderRadius: 8,
                      border: '1px solid var(--border-color)', background: 'var(--bg-surface)',
                      color: 'var(--text-primary)', fontSize: '0.8rem', textAlign: 'center',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Submit */}
        <button type="submit" className="btn-primary" disabled={isLoading}
          style={{ width: '100%', padding: '0.85rem', fontSize: '1rem' }}>
          {isLoading ? (
            <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Generating Report...</>
          ) : (
            'Generate Report'
          )}
        </button>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </form>
  );
}
