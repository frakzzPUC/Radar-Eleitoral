import { PARTY_COLORS } from '../../types/poll.types';
import type { TrendPoint } from '../../types/poll.types';

interface LineChartTrendProps {
  data: Record<string, TrendPoint[]>;
  candidateNames: Record<string, { name: string; party: string }>;
  height?: number;
}

export function LineChartTrend({
  data,
  candidateNames,
  height = 300,
}: LineChartTrendProps) {
  const allValues = Object.values(data).flatMap((points) => points.map((p) => p.value));
  const allDates = Object.values(data).flatMap((points) => points.map((p) => p.date));

  if (allValues.length === 0) {
    return <p style={{ color: '#64748B' }}>Sem dados de tendência disponíveis.</p>;
  }

  const minVal = Math.max(0, Math.min(...allValues) - 3);
  const maxVal = Math.min(100, Math.max(...allValues) + 3);
  const uniqueDates = [...new Set(allDates)].sort();

  const padding = { top: 20, right: 20, bottom: 40, left: 50 };
  const width = 700;
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  function xPos(dateStr: string): number {
    const idx = uniqueDates.indexOf(dateStr);
    return padding.left + (idx / Math.max(uniqueDates.length - 1, 1)) * chartWidth;
  }

  function yPos(value: number): number {
    return padding.top + (1 - (value - minVal) / (maxVal - minVal)) * chartHeight;
  }

  return (
    <div role="img" aria-label="Gráfico de tendência eleitoral ao longo do tempo">
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', maxWidth: `${width}px`, height: 'auto' }}>
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
          const val = minVal + pct * (maxVal - minVal);
          const y = yPos(val);
          return (
            <g key={pct}>
              <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="rgba(255,255,255,0.08)" strokeDasharray="4" />
              <text x={padding.left - 8} y={y + 4} textAnchor="end" fill="#64748B" fontSize="11">
                {val.toFixed(0)}%
              </text>
            </g>
          );
        })}

        {/* X-axis labels */}
        {uniqueDates.map((dateStr) => (
          <text
            key={dateStr}
            x={xPos(dateStr)}
            y={height - 8}
            textAnchor="middle"
            fill="#64748B"
            fontSize="10"
          >
            {new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
          </text>
        ))}

        {/* Lines */}
        {Object.entries(data).map(([candidateId, points]) => {
          const info = candidateNames[candidateId];
          const color = info ? (PARTY_COLORS[info.party] ?? '#64748B') : '#64748B';
          const sorted = [...points].sort((a, b) => a.date.localeCompare(b.date));
          const pathData = sorted
            .map((p, i) => `${i === 0 ? 'M' : 'L'} ${xPos(p.date)} ${yPos(p.value)}`)
            .join(' ');

          return (
            <g key={candidateId}>
              <path d={pathData} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              {sorted.map((p) => (
                <circle key={`${candidateId}-${p.date}`} cx={xPos(p.date)} cy={yPos(p.value)} r="4" fill={color} stroke="#0A0F1E" strokeWidth="2" />
              ))}
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '8px', justifyContent: 'center' }}>
        {Object.entries(candidateNames).map(([id, info]) => (
          <div key={id} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#e2e8f0' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: PARTY_COLORS[info.party] ?? '#64748B', display: 'inline-block' }} aria-hidden="true" />
            {info.name}
          </div>
        ))}
      </div>
    </div>
  );
}
