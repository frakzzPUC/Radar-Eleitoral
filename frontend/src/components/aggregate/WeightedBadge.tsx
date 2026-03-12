import { Badge } from '../ui/Badge';
import type { AggregateResult } from '../../types/poll.types';
import { formatPercentage } from '../../utils/weightedAverage';

interface WeightedBadgeProps {
  aggregate: AggregateResult;
}

export function WeightedBadge({ aggregate }: WeightedBadgeProps) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '9999px',
        padding: '4px 12px',
      }}
      aria-label={`${aggregate.candidateName}: média ponderada ${formatPercentage(aggregate.weightedAverage)}, tendência ${aggregate.trend}`}
    >
      <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#e2e8f0' }}>
        {formatPercentage(aggregate.weightedAverage)}
      </span>
      <Badge
        label={`${aggregate.trendValue > 0 ? '+' : ''}${aggregate.trendValue.toFixed(1)}`}
        variant="trend"
        trend={aggregate.trend}
      />
    </div>
  );
}
