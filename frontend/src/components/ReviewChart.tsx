import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import type { HistoricalDataPoint } from '../types/merchant';

interface ReviewChartProps {
  data: HistoricalDataPoint[];
  isDark: boolean;
}

export default function ReviewChart({ data, isDark }: ReviewChartProps) {
  const lineColor = isDark ? '#fbbf24' : '#d97706';
  const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)';
  const textColor = isDark ? '#94a3b8' : '#64748b';

  return (
    <div className="glass-card" style={{ padding: '1.25rem' }}>
      <h3 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 16, color: 'var(--text-primary)' }}>
        Customer Reviews
      </h3>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis dataKey="month" tick={{ fill: textColor, fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis domain={[0, 5]} tick={{ fill: textColor, fontSize: 12 }} axisLine={false} tickLine={false} />
          <ReferenceLine y={4} stroke={isDark ? '#34d399' : '#10b981'} strokeDasharray="6 4"
            label={{ value: 'Good', fill: isDark ? '#34d399' : '#10b981', fontSize: 11, position: 'right' }} />
          <Tooltip
            contentStyle={{
              background: isDark ? 'rgba(18,18,40,0.95)' : '#fff',
              border: `1px solid ${isDark ? 'rgba(99,102,241,0.2)' : '#e2e8f0'}`,
              borderRadius: 12, padding: '8px 12px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            }}
            labelStyle={{ color: textColor, fontSize: 12, marginBottom: 4 }}
            formatter={(value: number) => [value.toFixed(1), 'Rating']}
          />
          <Line type="monotone" dataKey="value" stroke={lineColor} strokeWidth={2.5}
            dot={{ fill: lineColor, stroke: isDark ? '#0a0a1a' : '#fff', strokeWidth: 2, r: 4 }}
            animationDuration={1500} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
