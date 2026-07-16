import { Sparkles } from 'lucide-react';
import { getPriorityColor } from '../utils/formatters';

interface AISummaryCardProps {
  summary: string;
  riskFactors: string[];
  priority: string;
}

export default function AISummaryCard({ summary, riskFactors, priority }: AISummaryCardProps) {
  if (!summary) {
    return (
      <div className="glass-card" style={{ opacity: 0.6, textAlign: 'center', padding: '2rem' }}>
        <Sparkles size={24} style={{ color: 'var(--text-muted)', margin: '0 auto 8px' }} />
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>AI insights will appear after analysis</p>
      </div>
    );
  }

  const priorityColor = getPriorityColor(priority);

  return (
    <div className="glass-card animate-pulse-glow animate-fade-in-up"
      style={{ '--delay': '600ms', position: 'relative' } as React.CSSProperties}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Sparkles size={20} style={{ color: 'var(--accent)' }} />
          <h3 className="gradient-text" style={{ fontSize: '1rem', fontWeight: 700 }}>
            AI Executive Summary
          </h3>
        </div>
        <span style={{
          padding: '3px 10px', borderRadius: 20, fontSize: '0.7rem', fontWeight: 600,
          background: `${priorityColor}18`, color: priorityColor, textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}>
          {priority}
        </span>
      </div>

      {/* Summary */}
      <p style={{
        fontSize: '0.88rem', lineHeight: 1.7, color: 'var(--text-secondary)',
        marginBottom: 16, letterSpacing: '0.01em',
      }}>
        {summary}
      </p>

      {/* Risk Factors */}
      {riskFactors.length > 0 && (
        <div>
          <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Risk Factors
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {riskFactors.map((factor, i) => (
              <span key={i} style={{
                padding: '4px 10px', borderRadius: 8,
                background: 'rgba(239, 68, 68, 0.08)',
                color: '#ef4444', fontSize: '0.73rem', fontWeight: 500,
              }}>
                {factor}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
