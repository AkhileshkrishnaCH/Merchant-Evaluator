import { useEffect, useState } from 'react';
import { getRiskColor } from '../utils/formatters';

interface HealthGaugeProps {
  score: number;
  riskLevel: string;
  size?: number;
}

export default function HealthGauge({ score, riskLevel, size = 220 }: HealthGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;
  const color = getRiskColor(riskLevel);

  useEffect(() => {
    let start = 0;
    const end = Math.min(score, 100);
    const duration = 1200;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      start = eased * end;
      setAnimatedScore(Math.round(start));
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [score]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <filter id="gauge-glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* Background track */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="var(--border-color)" strokeWidth={strokeWidth}
          opacity={0.4}
        />
        {/* Foreground arc */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.5s ease' }}
          filter="url(#gauge-glow)"
        />
        {/* Score text */}
        <text
          x={size / 2} y={size / 2 - 6}
          textAnchor="middle" dominantBaseline="middle"
          style={{
            fontSize: size * 0.2, fontWeight: 800,
            fill: 'var(--text-primary)',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        >
          {animatedScore}
        </text>
        {/* Label */}
        <text
          x={size / 2} y={size / 2 + size * 0.1}
          textAnchor="middle" dominantBaseline="middle"
          style={{
            fontSize: size * 0.065, fontWeight: 600,
            fill: color,
            fontFamily: 'Inter, system-ui, sans-serif',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          {riskLevel}
        </text>
      </svg>
    </div>
  );
}
