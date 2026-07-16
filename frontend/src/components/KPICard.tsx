import type { ReactNode } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  trend?: 'up' | 'down' | 'flat';
  trendValue?: string;
  icon: ReactNode;
  color?: string;
  delay?: number;
}

export default function KPICard({ title, value, trend, trendValue, icon, color = 'var(--accent)', delay = 0 }: KPICardProps) {
  const trendColor = trend === 'up' ? '#10b981' : trend === 'down' ? '#ef4444' : 'var(--text-muted)';
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;

  return (
    <div
      className="glass-card animate-fade-in-up"
      style={{
        '--delay': `${delay}ms`,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        cursor: 'default',
      } as React.CSSProperties}
    >
      <div style={{
        width: 42, height: 42, borderRadius: 12,
        background: `${color}15`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: color,
      }}>
        {icon}
      </div>

      <div>
        <div style={{ fontSize: '1.75rem', fontWeight: 700, lineHeight: 1.1, color: 'var(--text-primary)' }}>
          {value}
        </div>
        <div style={{
          fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 4,
          fontWeight: 500, letterSpacing: '0.01em',
        }}>
          {title}
        </div>
      </div>

      {trend && trendValue && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 4,
          fontSize: '0.8rem', fontWeight: 600, color: trendColor,
          marginTop: -4,
        }}>
          <TrendIcon size={14} />
          <span>{trendValue}</span>
        </div>
      )}
    </div>
  );
}
