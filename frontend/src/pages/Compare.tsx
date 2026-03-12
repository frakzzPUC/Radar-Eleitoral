import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { SkeletonCard } from '../components/ui/Skeleton';
import { Badge } from '../components/ui/Badge';
import { BarChartPoll } from '../components/charts/BarChartPoll';
import { formatPercentage } from '../utils/weightedAverage';
import { fetchAggregates } from '../services/api';
import { PARTY_COLORS } from '../types/poll.types';
import type { AggregateResult, CandidateResult } from '../types/poll.types';

const pageTransition = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
  transition: { duration: 0.3 },
};

export function Compare() {
  const [aggregates, setAggregates] = useState<AggregateResult[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAggregates()
      .then((data) => {
        setAggregates(data);
        setSelectedIds(new Set(data.slice(0, 4).map((a) => a.candidateId)));
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  function toggleCandidate(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  const selected = aggregates.filter((a) => selectedIds.has(a.candidateId));

  const chartResults: CandidateResult[] = selected.map((a) => ({
    candidateId: a.candidateId,
    candidateName: a.candidateName,
    party: a.party,
    votingIntention: a.weightedAverage,
    validVotes: 0,
  }));

  if (loading) {
    return (
      <main id="maincontent" tabIndex={-1} style={containerStyle}>
        <SkeletonCard />
        <SkeletonCard />
      </main>
    );
  }

  if (error) {
    return (
      <main id="maincontent" tabIndex={-1} style={containerStyle}>
        <Card>
          <p role="alert" style={{ color: '#EF4444' }}>Erro: {error}</p>
        </Card>
      </main>
    );
  }

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
          Comparar Candidatos
        </h1>
        <p style={{ color: '#64748B', marginTop: '0.5rem', fontSize: '0.9rem' }}>
          Selecione os candidatos para comparação lado a lado
        </p>
      </header>

      <section aria-labelledby="select-candidates" style={{ marginBottom: '2rem' }}>
        <h2 id="select-candidates" style={sectionTitleStyle}>Selecionar Candidatos</h2>
        <div
          role="group"
          aria-label="Seleção de candidatos para comparação"
          style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}
        >
          {aggregates.map((agg) => {
            const isSelected = selectedIds.has(agg.candidateId);
            const color = PARTY_COLORS[agg.party] ?? '#64748B';
            return (
              <button
                key={agg.candidateId}
                type="button"
                onClick={() => toggleCandidate(agg.candidateId)}
                aria-pressed={isSelected}
                style={{
                  background: isSelected ? `${color}20` : 'rgba(255,255,255,0.05)',
                  border: `2px solid ${isSelected ? color : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: '8px',
                  padding: '8px 16px',
                  color: isSelected ? color : '#94a3b8',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {agg.candidateName} ({agg.party})
              </button>
            );
          })}
        </div>
      </section>

      {selected.length > 0 && (
        <>
          <section aria-labelledby="comparison-chart" style={{ marginBottom: '2rem' }}>
            <h2 id="comparison-chart" style={sectionTitleStyle}>Comparação Visual</h2>
            <Card>
              <BarChartPoll results={chartResults} />
            </Card>
          </section>

          <section aria-labelledby="comparison-table">
            <h2 id="comparison-table" style={sectionTitleStyle}>Detalhamento</h2>
            <Card>
              <div style={{ overflowX: 'auto' }}>
                <table
                  style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', color: '#e2e8f0' }}
                  aria-label="Tabela comparativa de candidatos"
                >
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                      <th scope="col" style={thStyle}>Candidato</th>
                      <th scope="col" style={thStyle}>Partido</th>
                      <th scope="col" style={{ ...thStyle, textAlign: 'right' }}>Média</th>
                      <th scope="col" style={{ ...thStyle, textAlign: 'right' }}>IC</th>
                      <th scope="col" style={{ ...thStyle, textAlign: 'center' }}>Tendência</th>
                      <th scope="col" style={{ ...thStyle, textAlign: 'right' }}>Pesquisas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selected.map((agg) => (
                      <tr key={agg.candidateId} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={tdStyle}>
                          <Link
                            to={`/candidate/${agg.candidateId}`}
                            style={{ color: PARTY_COLORS[agg.party] ?? '#e2e8f0', textDecoration: 'none', fontWeight: 600 }}
                          >
                            {agg.candidateName}
                          </Link>
                        </td>
                        <td style={tdStyle}>{agg.party}</td>
                        <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 700 }}>
                          {formatPercentage(agg.weightedAverage)}
                        </td>
                        <td style={{ ...tdStyle, textAlign: 'right', fontSize: '0.8rem', color: '#94a3b8' }}>
                          {agg.confidenceInterval[0]}% – {agg.confidenceInterval[1]}%
                        </td>
                        <td style={{ ...tdStyle, textAlign: 'center' }}>
                          <Badge
                            label={`${agg.trendValue > 0 ? '+' : ''}${agg.trendValue.toFixed(1)}pp`}
                            variant="trend"
                            trend={agg.trend}
                          />
                        </td>
                        <td style={{ ...tdStyle, textAlign: 'right' }}>{agg.pollsIncluded}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </section>
        </>
      )}

      {selected.length === 0 && (
        <Card>
          <p style={{ color: '#64748B', textAlign: 'center' }}>
            Selecione ao menos um candidato para comparar.
          </p>
        </Card>
      )}
    </motion.main>
  );
}

const containerStyle: React.CSSProperties = {
  maxWidth: '1000px',
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

const thStyle: React.CSSProperties = {
  padding: '10px 12px',
  textAlign: 'left',
  fontWeight: 600,
  fontSize: '0.75rem',
  textTransform: 'uppercase',
  color: '#64748B',
  letterSpacing: '0.05em',
};

const tdStyle: React.CSSProperties = {
  padding: '10px 12px',
};
