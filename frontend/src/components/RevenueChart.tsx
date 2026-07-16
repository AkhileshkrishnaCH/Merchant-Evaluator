import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { HistoricalDataPoint } from '../types/merchant';

interface RevenueChartProps {
  data: HistoricalDataPoint[];
  isDark: boolean;
}

export default function RevenueChart({ data, isDark }: RevenueChartProps) {
  const strokeColor = isDark ? '#818cf8' : '#6366f1';
  const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)';
  const textColor = isDark ? '#94a3b8' : '#64748b';

  return (
    <div className="glass-card" style={{ padding: '1.25rem' }}>
      <h3 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 16, color: 'var(--text-primary)' }}>
        Revenue Trend
      </h3>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={strokeColor} stopOpacity={0.3} />
              <stop offset="95%" stopColor={strokeColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis dataKey="month" tick={{ fill: textColor, fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: textColor, fontSize: 12 }} axisLine={false} tickLine={false}
            tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
          <Tooltip
            contentStyle={{
              background: isDark ? 'rgba(18,18,40,0.95)' : '#fff',
              border: `1px solid ${isDark ? 'rgba(99,102,241,0.2)' : '#e2e8f0'}`,
              borderRadius: 12, padding: '8px 12px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            }}
            labelStyle={{ color: textColor, fontSize: 12, marginBottom: 4 }}
            formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Revenue']}
          />
          <Area type="monotone" dataKey="value" stroke={strokeColor} strokeWidth={2.5}
            fill="url(#revenueGradient)" animationDuration={1500} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
