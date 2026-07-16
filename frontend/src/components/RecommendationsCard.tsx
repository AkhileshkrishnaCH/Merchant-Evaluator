import { Lightbulb } from 'lucide-react';

interface RecommendationsCardProps {
  recommendations: string[];
}

export default function RecommendationsCard({ recommendations }: RecommendationsCardProps) {
  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="glass-card" style={{ opacity: 0.6, textAlign: 'center', padding: '2rem' }}>
        <Lightbulb size={24} style={{ color: 'var(--text-muted)', margin: '0 auto 8px' }} />
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Recommendations will appear after analysis</p>
      </div>
    );
  }

  return (
    <div className="glass-card animate-fade-in-up" style={{ '--delay': '700ms' } as React.CSSProperties}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <Lightbulb size={20} style={{ color: '#fbbf24' }} />
        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
          Recommendations
        </h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {recommendations.map((rec, i) => (
          <div
            key={i}
            className="animate-fade-in-up"
            style={{
              '--delay': `${800 + i * 100}ms`,
              display: 'flex', gap: 12, padding: '10px 12px',
              borderRadius: 12, transition: 'all 0.2s ease',
              cursor: 'default',
              background: 'var(--accent-light)',
            } as React.CSSProperties}
          >
            <div style={{
              width: 28, height: 28, borderRadius: 8, flexShrink: 0,
              background: 'var(--accent)', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.75rem', fontWeight: 700,
            }}>
              {i + 1}
            </div>
            <p style={{ fontSize: '0.83rem', lineHeight: 1.6, color: 'var(--text-secondary)', margin: 0 }}>
              {rec}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
