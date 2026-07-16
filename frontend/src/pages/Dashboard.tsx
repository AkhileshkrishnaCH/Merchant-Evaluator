import { useNavigate } from 'react-router-dom';
import { TrendingUp, ShoppingCart, Repeat, ThumbsDown, ArrowRight, Activity, AlertTriangle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import HealthGauge from '../components/HealthGauge';
import KPICard from '../components/KPICard';
import RevenueChart from '../components/RevenueChart';
import TransactionChart from '../components/TransactionChart';
import LoginActivityChart from '../components/LoginActivityChart';
import ReviewChart from '../components/ReviewChart';
import HealthBreakdown from '../components/HealthBreakdown';
import AISummaryCard from '../components/AISummaryCard';
import RecommendationsCard from '../components/RecommendationsCard';
import { formatPercentage, getTrendDirection } from '../utils/formatters';
import type { MerchantWithHealth, SimulationResponse, HistoricalData } from '../types/merchant';

interface DashboardProps {
  merchantData: MerchantWithHealth | null;
  simulationResult: SimulationResponse | null;
}

export default function Dashboard({ merchantData, simulationResult }: DashboardProps) {
  const { isDark } = useTheme();
  const navigate = useNavigate();

  // Determine data source
  const health = simulationResult?.health || merchantData?.health;
  const aiAnalysis = simulationResult?.ai_analysis;
  const metrics = simulationResult?.health ? null : merchantData?.merchant.metrics;
  const simMetrics = simulationResult ? {
    revenue_growth: 15, transaction_trend: 10, repeat_purchase_rate: 45, refund_rate: 5,
  } : null;
  const displayMetrics = metrics || simMetrics;
  const historicalData: HistoricalData | null = merchantData?.merchant.historical_data || null;
  const merchantName = simulationResult?.merchant_name || merchantData?.merchant.name || '';

  // Default chart data for simulation results (no historical data)
  const defaultHistory: HistoricalData = {
    revenue_history: [
      { month: 'Jan', value: 25000 }, { month: 'Feb', value: 27000 }, { month: 'Mar', value: 26500 },
      { month: 'Apr', value: 29000 }, { month: 'May', value: 31000 }, { month: 'Jun', value: 33000 },
    ],
    transaction_history: [
      { month: 'Jan', value: 800 }, { month: 'Feb', value: 850 }, { month: 'Mar', value: 820 },
      { month: 'Apr', value: 900 }, { month: 'May', value: 950 }, { month: 'Jun', value: 980 },
    ],
    login_history: [
      { month: 'Jan', value: 14 }, { month: 'Feb', value: 16 }, { month: 'Mar', value: 15 },
      { month: 'Apr', value: 18 }, { month: 'May', value: 17 }, { month: 'Jun', value: 19 },
    ],
    review_history: [
      { month: 'Jan', value: 3.8 }, { month: 'Feb', value: 3.9 }, { month: 'Mar', value: 4.0 },
      { month: 'Apr', value: 4.1 }, { month: 'May', value: 4.0 }, { month: 'Jun', value: 4.2 },
    ],
  };

  const chartData = historicalData || defaultHistory;

  // No data — welcome state
  if (!health) {
    return (
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '2rem 1.5rem' }}>
        <div className="glass-card animate-fade-in-up" style={{
          textAlign: 'center', padding: '4rem 2rem',
          background: isDark
            ? 'linear-gradient(135deg, rgba(18,18,40,0.8), rgba(30,30,70,0.5))'
            : 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(240,244,248,0.9))',
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: 20, margin: '0 auto 20px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Activity size={32} color="#fff" />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: 8, color: 'var(--text-primary)' }}>
            Welcome to Merchant Health Dashboard
          </h1>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: 32, maxWidth: 500, margin: '0 auto 32px' }}>
            Select a merchant from the dropdown above or run a simulation to see detailed health analytics.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn-primary" onClick={() => navigate('/simulator')}>
              Run Simulator <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  const kpiRevGrowth = metrics?.revenue_growth ?? displayMetrics?.revenue_growth ?? 0;
  const kpiTxnTrend = metrics?.transaction_trend ?? displayMetrics?.transaction_trend ?? 0;
  const kpiRepeat = metrics?.repeat_purchase_rate ?? displayMetrics?.repeat_purchase_rate ?? 0;
  const kpiRefund = metrics?.refund_rate ?? displayMetrics?.refund_rate ?? 0;

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '1.5rem' }}>
      {/* Merchant name */}
      {merchantName && (
        <h2 className="animate-fade-in-up" style={{
          fontSize: '1.3rem', fontWeight: 700, marginBottom: 20, color: 'var(--text-primary)',
          '--delay': '0ms',
        } as React.CSSProperties}>
          {merchantName}
        </h2>
      )}

      {/* Critical alerts */}
      {health.critical_alerts.length > 0 && (
        <div className="animate-fade-in-up" style={{ '--delay': '50ms', marginBottom: 20 } as React.CSSProperties}>
          {health.critical_alerts.map((alert, i) => (
            <div key={i} className="alert-banner" style={{ marginBottom: 8 }}>
              <AlertTriangle size={16} /> {alert}
            </div>
          ))}
        </div>
      )}

      {/* Top Row: Gauge + KPIs */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'auto 1fr',
        gap: 20, marginBottom: 20,
      }} className="top-row">
        <div className="glass-card animate-fade-in-up" style={{
          '--delay': '100ms', display: 'flex', alignItems: 'center', justifyContent: 'center',
        } as React.CSSProperties}>
          <HealthGauge score={health.health_score} riskLevel={health.risk_level} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
          <KPICard title="Revenue Growth" value={formatPercentage(kpiRevGrowth)}
            trend={getTrendDirection(kpiRevGrowth)} trendValue={formatPercentage(kpiRevGrowth)}
            icon={<TrendingUp size={18} />} color="#6366f1" delay={200} />
          <KPICard title="Transaction Trend" value={formatPercentage(kpiTxnTrend)}
            trend={getTrendDirection(kpiTxnTrend)} trendValue={formatPercentage(kpiTxnTrend)}
            icon={<ShoppingCart size={18} />} color="#8b5cf6" delay={300} />
          <KPICard title="Repeat Purchases" value={`${kpiRepeat}%`}
            trend={kpiRepeat > 30 ? 'up' : 'down'} trendValue={`${kpiRepeat}%`}
            icon={<Repeat size={18} />} color="#10b981" delay={400} />
          <KPICard title="Refund Rate" value={`${kpiRefund}%`}
            trend={kpiRefund < 10 ? 'up' : 'down'} trendValue={`${kpiRefund}%`}
            icon={<ThumbsDown size={18} />} color={kpiRefund > 15 ? '#ef4444' : '#f97316'} delay={500} />
        </div>
      </div>

      {/* Charts 2x2 */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: 20, marginBottom: 20,
      }}>
        <div className="animate-fade-in-up" style={{ '--delay': '300ms' } as React.CSSProperties}>
          <RevenueChart data={chartData.revenue_history} isDark={isDark} />
        </div>
        <div className="animate-fade-in-up" style={{ '--delay': '400ms' } as React.CSSProperties}>
          <TransactionChart data={chartData.transaction_history} isDark={isDark} />
        </div>
        <div className="animate-fade-in-up" style={{ '--delay': '500ms' } as React.CSSProperties}>
          <LoginActivityChart data={chartData.login_history} isDark={isDark} />
        </div>
        <div className="animate-fade-in-up" style={{ '--delay': '600ms' } as React.CSSProperties}>
          <ReviewChart data={chartData.review_history} isDark={isDark} />
        </div>
      </div>

      {/* Bottom: Breakdown + AI */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: 20,
      }} className="bottom-row">
        <HealthBreakdown breakdown={health.breakdown} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <AISummaryCard
            summary={aiAnalysis?.summary || ''}
            riskFactors={aiAnalysis?.risk_factors || []}
            priority={aiAnalysis?.priority || 'medium'}
          />
          <RecommendationsCard recommendations={aiAnalysis?.recommendations || []} />
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .top-row { grid-template-columns: 1fr !important; }
          .bottom-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
