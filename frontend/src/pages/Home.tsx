import { motion } from 'framer-motion';
import { AverageDisplay } from '../components/aggregate/AverageDisplay';
import { LineChartTrend } from '../components/charts/LineChartTrend';
import { PollFilter } from '../components/polls/PollFilter';
import { PollTable } from '../components/polls/PollTable';
import { Card } from '../components/ui/Card';
import { SkeletonCard } from '../components/ui/Skeleton';
import { useAggregate, useTrends } from '../hooks/useAggregate';
import { useFilters } from '../hooks/useFilters';
import { usePolls } from '../hooks/usePolls';

const pageTransition = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
  transition: { duration: 0.3 },
};

export function Home() {
  const { filters, setInstitute, setElectionType, setState, resetFilters } = useFilters();
  const { polls, loading: pollsLoading, error: pollsError } = usePolls(filters);
  const { aggregates, loading: aggLoading, error: aggError } = useAggregate();
  const { trends, loading: trendsLoading } = useTrends();

  const candidateNames: Record<string, { name: string; party: string }> = {};
  for (const agg of aggregates) {
    candidateNames[agg.candidateId] = { name: agg.candidateName, party: agg.party };
  }

  return (
    <motion.main
      {...pageTransition}
      id="maincontent"
      tabIndex={-1}
      style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}
    >
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#e2e8f0', margin: 0 }}>
          <span style={{ color: '#009C3B' }}>Radar</span>{' '}
          <span style={{ color: '#FFDF00' }}>Eleitoral</span>{' '}
          <span>2026</span>
        </h1>
        <p style={{ color: '#64748B', marginTop: '0.5rem', fontSize: '0.9rem' }}>
          Agregador de pesquisas eleitorais brasileiras
        </p>
      </header>

      <section aria-labelledby="section-aggregates" style={{ marginBottom: '2.5rem' }}>
        <h2 id="section-aggregates" style={sectionTitleStyle}>
          Média Ponderada
        </h2>
        {aggLoading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : aggError ? (
          <Card>
            <p role="alert" style={{ color: '#EF4444' }}>Erro ao carregar agregados: {aggError}</p>
          </Card>
        ) : (
          <AverageDisplay aggregates={aggregates} />
        )}
      </section>

      <section aria-labelledby="section-trends" style={{ marginBottom: '2.5rem' }}>
        <h2 id="section-trends" style={sectionTitleStyle}>
          Tendência ao Longo do Tempo
        </h2>
        {trendsLoading ? (
          <SkeletonCard />
        ) : (
          <Card>
            <LineChartTrend data={trends} candidateNames={candidateNames} />
          </Card>
        )}
      </section>

      <section aria-labelledby="section-polls">
        <h2 id="section-polls" style={sectionTitleStyle}>
          Pesquisas Recentes
        </h2>

        <div style={{ marginBottom: '1rem' }}>
          <PollFilter
            filters={filters}
            onInstituteChange={setInstitute}
            onElectionTypeChange={setElectionType}
            onStateChange={setState}
            onReset={resetFilters}
          />
        </div>

        {pollsLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : pollsError ? (
          <Card>
            <p role="alert" style={{ color: '#EF4444' }}>Erro ao carregar pesquisas: {pollsError}</p>
          </Card>
        ) : (
          <Card>
            <PollTable polls={polls} />
          </Card>
        )}
      </section>
    </motion.main>
  );
}

const sectionTitleStyle: React.CSSProperties = {
  fontSize: '1.25rem',
  fontWeight: 700,
  color: '#e2e8f0',
  marginBottom: '1rem',
  borderBottom: '2px solid rgba(0, 156, 59, 0.3)',
  paddingBottom: '0.5rem',
};
