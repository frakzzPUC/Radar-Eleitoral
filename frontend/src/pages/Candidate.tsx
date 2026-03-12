import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { SkeletonCard } from '../components/ui/Skeleton';
import { WeightedBadge } from '../components/aggregate/WeightedBadge';
import { formatDate, formatPercentage } from '../utils/weightedAverage';
import { INSTITUTE_LABELS, PARTY_COLORS } from '../types/poll.types';
import {
  fetchCandidateById,
  fetchCandidateAggregate,
  fetchCandidatePolls,
} from '../services/api';
import type {
  Candidate as CandidateType,
  AggregateResult,
  CandidatePollHistory,
} from '../types/poll.types';

const pageTransition = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
  transition: { duration: 0.3 },
};

export function Candidate() {
  const { id } = useParams<{ id: string }>();
  const [candidate, setCandidate] = useState<CandidateType | null>(null);
  const [aggregate, setAggregate] = useState<AggregateResult | null>(null);
  const [history, setHistory] = useState<CandidatePollHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);

    Promise.all([
      fetchCandidateById(id),
      fetchCandidateAggregate(id),
      fetchCandidatePolls(id),
    ])
      .then(([cand, agg, hist]) => {
        setCandidate(cand);
        setAggregate(agg);
        setHistory(hist);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <main id="maincontent" tabIndex={-1} style={containerStyle}>
        <SkeletonCard />
        <SkeletonCard />
      </main>
    );
  }

  if (error || !candidate) {
    return (
      <main id="maincontent" tabIndex={-1} style={containerStyle}>
        <Card>
          <p role="alert" style={{ color: '#EF4444' }}>
            {error ?? 'Candidato não encontrado.'}
          </p>
          <Link to="/" style={linkStyle}>← Voltar ao início</Link>
        </Card>
      </main>
    );
  }

  const partyColor = PARTY_COLORS[candidate.party] ?? '#64748B';

  return (
    <motion.main
      {...pageTransition}
      id="maincontent"
      tabIndex={-1}
      style={containerStyle}
    >
      <nav aria-label="Navegação de páginas" style={{ marginBottom: '1rem' }}>
        <Link to="/" style={linkStyle}>← Voltar ao início</Link>
      </nav>

      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#e2e8f0', margin: 0 }}>
          {candidate.name}
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '0.5rem' }}>
          <Badge label={candidate.party} variant="default" />
          {aggregate && <WeightedBadge aggregate={aggregate} />}
        </div>
      </header>

      {aggregate && (
        <section aria-labelledby="candidate-aggregate" style={{ marginBottom: '2rem' }}>
          <h2 id="candidate-aggregate" style={sectionTitleStyle}>Resumo Agregado</h2>
          <Card>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', textAlign: 'center' }}>
              <div>
                <p style={metricLabelStyle}>Média Ponderada</p>
                <p style={{ ...metricValueStyle, color: partyColor }}>
                  {formatPercentage(aggregate.weightedAverage)}
                </p>
              </div>
              <div>
                <p style={metricLabelStyle}>Intervalo de Confiança</p>
                <p style={metricValueStyle}>
                  {aggregate.confidenceInterval[0]}% – {aggregate.confidenceInterval[1]}%
                </p>
              </div>
              <div>
                <p style={metricLabelStyle}>Pesquisas Incluídas</p>
                <p style={metricValueStyle}>{aggregate.pollsIncluded}</p>
              </div>
              <div>
                <p style={metricLabelStyle}>Tendência</p>
                <Badge
                  label={`${aggregate.trendValue > 0 ? '+' : ''}${aggregate.trendValue.toFixed(1)}pp`}
                  variant="trend"
                  trend={aggregate.trend}
                />
              </div>
            </div>
          </Card>
        </section>
      )}

      <section aria-labelledby="candidate-history">
        <h2 id="candidate-history" style={sectionTitleStyle}>Histórico de Pesquisas</h2>
        {history.length === 0 ? (
          <p style={{ color: '#64748B' }}>Nenhuma pesquisa encontrada para este candidato.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {history.map((h) => (
              <Card key={h.pollId}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <span style={{ fontWeight: 600, color: '#e2e8f0' }}>
                      {INSTITUTE_LABELS[h.institute]}
                    </span>
                    <time
                      dateTime={h.publishedAt}
                      style={{ display: 'block', fontSize: '0.75rem', color: '#64748B' }}
                    >
                      {formatDate(h.publishedAt)}
                    </time>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '1.5rem', fontWeight: 800, color: partyColor }}>
                      {formatPercentage(h.votingIntention)}
                    </span>
                    <span style={{ display: 'block', fontSize: '0.7rem', color: '#64748B' }}>
                      n={h.sampleSize.toLocaleString('pt-BR')} | ±{h.marginOfError}pp
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </motion.main>
  );
}

const containerStyle: React.CSSProperties = {
  maxWidth: '900px',
  margin: '0 auto',
  padding: '2rem 1rem',
};

const linkStyle: React.CSSProperties = {
  color: '#009C3B',
  textDecoration: 'none',
  fontSize: '0.875rem',
  fontWeight: 500,
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: '1.25rem',
  fontWeight: 700,
  color: '#e2e8f0',
  marginBottom: '1rem',
  borderBottom: '2px solid rgba(0, 156, 59, 0.3)',
  paddingBottom: '0.5rem',
};

const metricLabelStyle: React.CSSProperties = {
  fontSize: '0.7rem',
  color: '#64748B',
  textTransform: 'uppercase',
  margin: '0 0 4px',
  letterSpacing: '0.05em',
};

const metricValueStyle: React.CSSProperties = {
  fontSize: '1.5rem',
  fontWeight: 800,
  color: '#e2e8f0',
  margin: 0,
};
