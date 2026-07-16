import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SimulatorForm from '../components/SimulatorForm';
import HealthGauge from '../components/HealthGauge';
import { getRiskColor } from '../utils/formatters';
import type { MerchantMetrics, SimulationResponse } from '../types/merchant';

interface SimulatorProps {
  onSimulate: (metrics: MerchantMetrics, name: string) => Promise<SimulationResponse | null>;
  isLoading: boolean;
  simulationResult: SimulationResponse | null;
}

export default function Simulator({ onSimulate, isLoading, simulationResult }: SimulatorProps) {
  const navigate = useNavigate();

  const handleSubmit = async (metrics: MerchantMetrics, name: string) => {
    await onSimulate(metrics, name);
  };

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '1.5rem' }}>
      <SimulatorForm onSubmit={handleSubmit} isLoading={isLoading} />

      {/* Results Preview */}
      {simulationResult && (
        <div className="glass-card animate-fade-in-up" style={{
          '--delay': '200ms', marginTop: 24,
          background: 'var(--bg-surface-elevated)',
          border: `1px solid ${getRiskColor(simulationResult.health.risk_level)}30`,
        } as React.CSSProperties}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 20, color: 'var(--text-primary)' }}>
            Simulation Results — {simulationResult.merchant_name}
          </h3>

          <div style={{
            display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 32, alignItems: 'start',
          }} className="results-grid">
            {/* Gauge */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <HealthGauge score={simulationResult.health.health_score} riskLevel={simulationResult.health.risk_level} size={160} />
              <span style={{
                padding: '4px 16px', borderRadius: 20,
                background: `${getRiskColor(simulationResult.health.risk_level)}18`,
                color: getRiskColor(simulationResult.health.risk_level),
                fontWeight: 700, fontSize: '0.85rem',
              }}>
                {simulationResult.health.risk_level}
              </span>
            </div>

            {/* Details */}
            <div>
              {/* Top metrics */}
              <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Top Metric Scores
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
                {simulationResult.health.breakdown.slice(0, 5).map(b => (
                  <div key={b.metric} style={{
                    padding: '6px 12px', borderRadius: 10, background: 'var(--accent-light)',
                    fontSize: '0.78rem', color: 'var(--text-primary)',
                  }}>
                    <span style={{ fontWeight: 600 }}>{b.label || b.metric}</span>
                    <span style={{ color: 'var(--text-muted)', marginLeft: 6 }}>{b.score.toFixed(0)}</span>
                  </div>
                ))}
              </div>

              {/* AI Summary Preview */}
              {simulationResult.ai_analysis?.summary && (
                <div style={{ marginBottom: 20 }}>
                  <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    AI Summary
                  </p>
                  <p style={{ fontSize: '0.88rem', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
                    {simulationResult.ai_analysis.summary.split('.').slice(0, 2).join('.') + '.'}
                  </p>
                </div>
              )}

              <button className="btn-primary" onClick={() => navigate('/')}>
                View Full Dashboard <ArrowRight size={16} />
              </button>
            </div>
          </div>

          <style>{`
            @media (max-width: 700px) {
              .results-grid { grid-template-columns: 1fr !important; justify-items: center; }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}
