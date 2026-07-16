import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { HistoricalDataPoint } from '../types/merchant';

interface TransactionChartProps {
  data: HistoricalDataPoint[];
  isDark: boolean;
}

export default function TransactionChart({ data, isDark }: TransactionChartProps) {
  const barColor = isDark ? '#a78bfa' : '#8b5cf6';
  const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)';
  const textColor = isDark ? '#94a3b8' : '#64748b';

  return (
    <div className="glass-card" style={{ padding: '1.25rem' }}>
      <h3 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 16, color: 'var(--text-primary)' }}>
        Transaction Volume
      </h3>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={barColor} stopOpacity={1} />
              <stop offset="100%" stopColor={barColor} stopOpacity={0.5} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis dataKey="month" tick={{ fill: textColor, fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: textColor, fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{
              background: isDark ? 'rgba(18,18,40,0.95)' : '#fff',
              border: `1px solid ${isDark ? 'rgba(99,102,241,0.2)' : '#e2e8f0'}`,
              borderRadius: 12, padding: '8px 12px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            }}
            labelStyle={{ color: textColor, fontSize: 12, marginBottom: 4 }}
            formatter={(value: number) => [value.toLocaleString(), 'Transactions']}
          />
          <Bar dataKey="value" fill="url(#barGradient)" radius={[6, 6, 0, 0]} animationDuration={1500} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
