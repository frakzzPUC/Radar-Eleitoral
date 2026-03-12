import { motion } from 'framer-motion';
import { AggregateGauge } from '../charts/AggregateGauge';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { PARTY_COLORS } from '../../types/poll.types';
import type { AggregateResult } from '../../types/poll.types';

interface AverageDisplayProps {
  aggregates: AggregateResult[];
}

export function AverageDisplay({ aggregates }: AverageDisplayProps) {
  if (aggregates.length === 0) {
    return (
      <p style={{ color: '#64748B', textAlign: 'center', padding: '2rem' }}>
        Nenhum dado agregado disponível.
      </p>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: { transition: { staggerChildren: 0.1 } },
      }}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '1rem',
      }}
      role="list"
      aria-label="Médias ponderadas dos candidatos"
    >
      {aggregates.map((agg) => (
        <motion.div
          key={agg.candidateId}
          role="listitem"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <Card hoverable>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <AggregateGauge
                value={agg.weightedAverage}
                label={agg.candidateName}
                color={PARTY_COLORS[agg.party] ?? '#64748B'}
              />
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                  {agg.party}
                </span>
                <div style={{ marginTop: '4px', display: 'flex', gap: '6px', justifyContent: 'center' }}>
                  <Badge
                    label={`${agg.trendValue > 0 ? '+' : ''}${agg.trendValue.toFixed(1)}pp`}
                    variant="trend"
                    trend={agg.trend}
                  />
                  <Badge label={`${agg.pollsIncluded} pesquisas`} />
                </div>
                <p style={{ fontSize: '0.7rem', color: '#475569', margin: '4px 0 0' }}>
                  IC: [{agg.confidenceInterval[0]}%, {agg.confidenceInterval[1]}%]
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}
