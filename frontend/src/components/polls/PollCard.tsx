import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { BarChartPoll } from '../charts/BarChartPoll';
import { formatDate } from '../../utils/weightedAverage';
import { INSTITUTE_LABELS } from '../../types/poll.types';
import type { Poll } from '../../types/poll.types';

interface PollCardProps {
  poll: Poll;
}

export function PollCard({ poll }: PollCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      aria-label={`Pesquisa ${INSTITUTE_LABELS[poll.institute]} de ${formatDate(poll.publishedAt)}`}
    >
      <Card hoverable>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1rem', color: '#e2e8f0' }}>
              {INSTITUTE_LABELS[poll.institute]}
            </h3>
            <time dateTime={poll.publishedAt} style={{ fontSize: '0.75rem', color: '#64748B' }}>
              {formatDate(poll.publishedAt)}
            </time>
          </div>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            <Badge label={`n=${poll.sampleSize.toLocaleString('pt-BR')}`} />
            <Badge label={`±${poll.marginOfError}pp`} variant="neutral" />
          </div>
        </header>

        <BarChartPoll results={poll.results} />

        <footer style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.7rem', color: '#475569' }}>
            Campo: {formatDate(poll.fieldworkStart)} – {formatDate(poll.fieldworkEnd)}
          </span>
          <a
            href={poll.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: '0.7rem', color: '#009C3B' }}
            aria-label={`Ver fonte da pesquisa ${INSTITUTE_LABELS[poll.institute]}`}
          >
            Ver fonte ↗
          </a>
        </footer>
      </Card>
    </motion.article>
  );
}
