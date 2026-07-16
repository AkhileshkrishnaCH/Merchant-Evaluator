import { BarChart3 } from 'lucide-react';
import type { MetricBreakdown } from '../types/merchant';
import { getMetricLabel } from '../utils/formatters';

interface HealthBreakdownProps {
  breakdown: MetricBreakdown[];
}

export default function HealthBreakdown({ breakdown }: HealthBreakdownProps) {
  const sorted = [...breakdown].sort((a, b) => b.weighted_score - a.weighted_score);
  const maxScore = Math.max(...sorted.map(b => b.score), 1);

  const getBarColor = (score: number) => {
    if (score >= 70) return '#10b981';
    if (score >= 40) return '#fbbf24';
    return '#ef4444';
  };

  return (
    <div className="glass-card animate-fade-in-up" style={{ '--delay': '500ms' } as React.CSSProperties}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
        <BarChart3 size={20} style={{ color: 'var(--accent)' }} />
        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
          Health Score Breakdown
        </h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {sorted.map((item, i) => (
          <div key={item.metric} style={{
            display: 'grid', gridTemplateColumns: '140px 1fr 50px', alignItems: 'center', gap: 12,
            opacity: 0, animation: `fadeInUp 0.4s ease forwards ${300 + i * 60}ms`,
          }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {item.label || getMetricLabel(item.metric)}
            </span>
            <div style={{
              height: 8, borderRadius: 4, background: 'var(--border-color)', overflow: 'hidden',
            }}>
              <div style={{
                height: '100%', borderRadius: 4,
                background: getBarColor(item.score),
                width: `${(item.score / maxScore) * 100}%`,
                transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)',
              }} />
            </div>
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)', textAlign: 'right' }}>
              {item.score.toFixed(0)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
