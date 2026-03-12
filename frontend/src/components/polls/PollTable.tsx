import { formatDate, formatPercentage } from '../../utils/weightedAverage';
import { INSTITUTE_LABELS } from '../../types/poll.types';
import type { PollSummary } from '../../types/poll.types';

interface PollTableProps {
  polls: PollSummary[];
  onSelectPoll?: (pollId: string) => void;
}

export function PollTable({ polls, onSelectPoll }: PollTableProps) {
  if (polls.length === 0) {
    return (
      <p style={{ color: '#64748B', textAlign: 'center', padding: '2rem' }}>
        Nenhuma pesquisa encontrada com os filtros selecionados.
      </p>
    );
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '0.875rem',
          color: '#e2e8f0',
        }}
        aria-label="Tabela de pesquisas eleitorais"
      >
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <th scope="col" style={thStyle}>Instituto</th>
            <th scope="col" style={thStyle}>Data</th>
            <th scope="col" style={{ ...thStyle, textAlign: 'right' }}>Amostra</th>
            <th scope="col" style={{ ...thStyle, textAlign: 'right' }}>Margem</th>
            <th scope="col" style={thStyle}>Líder</th>
            <th scope="col" style={{ ...thStyle, textAlign: 'right' }}>%</th>
          </tr>
        </thead>
        <tbody>
          {polls.map((poll) => (
            <tr
              key={poll.id}
              onClick={() => onSelectPoll?.(poll.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectPoll?.(poll.id);
                }
              }}
              tabIndex={onSelectPoll ? 0 : undefined}
              role={onSelectPoll ? 'button' : undefined}
              aria-label={onSelectPoll ? `Ver detalhes da pesquisa ${INSTITUTE_LABELS[poll.institute]}` : undefined}
              style={{
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                cursor: onSelectPoll ? 'pointer' : 'default',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'transparent';
              }}
            >
              <td style={tdStyle}>{INSTITUTE_LABELS[poll.institute]}</td>
              <td style={tdStyle}>
                <time dateTime={poll.publishedAt}>{formatDate(poll.publishedAt)}</time>
              </td>
              <td style={{ ...tdStyle, textAlign: 'right' }}>{poll.sampleSize.toLocaleString('pt-BR')}</td>
              <td style={{ ...tdStyle, textAlign: 'right' }}>±{poll.marginOfError}pp</td>
              <td style={tdStyle}>{poll.topCandidate}</td>
              <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 700, color: '#009C3B' }}>
                {formatPercentage(poll.topPercentage)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

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
