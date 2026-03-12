import { motion } from 'framer-motion';
import { Tooltip } from '../ui/Tooltip';
import { formatPercentage } from '../../utils/weightedAverage';
import type { CandidateResult } from '../../types/poll.types';
import { PARTY_COLORS } from '../../types/poll.types';

interface BarChartPollProps {
  results: CandidateResult[];
  maxValue?: number;
}

export function BarChartPoll({ results, maxValue }: BarChartPollProps) {
  const sorted = [...results].sort((a, b) => b.votingIntention - a.votingIntention);
  const max = maxValue ?? Math.max(...sorted.map((r) => r.votingIntention), 1);

  return (
    <div role="img" aria-label="Gráfico de barras com intenções de voto">
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {sorted.map((result, index) => {
          const widthPercent = (result.votingIntention / max) * 100;
          const barColor = PARTY_COLORS[result.party] ?? '#64748B';

          return (
            <li key={result.candidateId} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ minWidth: '140px', fontSize: '0.875rem', color: '#e2e8f0', textAlign: 'right' }}>
                {result.candidateName}
              </span>
              <div style={{ flex: 1, position: 'relative', height: '28px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', overflow: 'hidden' }}>
                <Tooltip content={`${result.candidateName} (${result.party}): ${formatPercentage(result.votingIntention)}`}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${widthPercent}%` }}
                    transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
                    style={{
                      height: '100%',
                      background: barColor,
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      paddingRight: '8px',
                    }}
                  >
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fff' }}>
                      {formatPercentage(result.votingIntention)}
                    </span>
                  </motion.div>
                </Tooltip>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
