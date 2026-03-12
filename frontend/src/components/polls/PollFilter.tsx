import type { ElectionType, Institute, PollFilters } from '../../types/poll.types';
import { INSTITUTE_LABELS } from '../../types/poll.types';

interface PollFilterProps {
  filters: PollFilters;
  onInstituteChange: (institute: Institute | undefined) => void;
  onElectionTypeChange: (type: ElectionType | undefined) => void;
  onStateChange: (state: string | undefined) => void;
  onReset: () => void;
}

const ELECTION_TYPE_LABELS: Record<ElectionType, string> = {
  presidential: 'Presidente',
  governor: 'Governador',
  senator: 'Senador',
};

const selectStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.15)',
  borderRadius: '8px',
  padding: '8px 12px',
  color: '#e2e8f0',
  fontSize: '0.875rem',
  minWidth: '150px',
};

export function PollFilter({
  filters,
  onInstituteChange,
  onElectionTypeChange,
  onStateChange,
  onReset,
}: PollFilterProps) {
  return (
    <fieldset
      style={{
        border: 'none',
        padding: 0,
        margin: 0,
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px',
        alignItems: 'flex-end',
      }}
    >
      <legend className="sr-only">Filtros de pesquisas</legend>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <label htmlFor="filter-institute" style={labelStyle}>
          Instituto
        </label>
        <select
          id="filter-institute"
          value={filters.institute ?? ''}
          onChange={(e) =>
            onInstituteChange((e.target.value || undefined) as Institute | undefined)
          }
          style={selectStyle}
        >
          <option value="">Todos</option>
          {(Object.entries(INSTITUTE_LABELS) as [Institute, string][]).map(
            ([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ),
          )}
        </select>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <label htmlFor="filter-election-type" style={labelStyle}>
          Tipo de Eleição
        </label>
        <select
          id="filter-election-type"
          value={filters.electionType ?? ''}
          onChange={(e) =>
            onElectionTypeChange(
              (e.target.value || undefined) as ElectionType | undefined,
            )
          }
          style={selectStyle}
        >
          <option value="">Todas</option>
          {(
            Object.entries(ELECTION_TYPE_LABELS) as [ElectionType, string][]
          ).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <label htmlFor="filter-state" style={labelStyle}>
          Estado
        </label>
        <select
          id="filter-state"
          value={filters.state ?? ''}
          onChange={(e) => onStateChange(e.target.value || undefined)}
          style={selectStyle}
        >
          <option value="">Nacional</option>
          <option value="SP">São Paulo</option>
          <option value="RJ">Rio de Janeiro</option>
          <option value="MG">Minas Gerais</option>
          <option value="BA">Bahia</option>
          <option value="RS">Rio Grande do Sul</option>
        </select>
      </div>

      <button
        type="button"
        onClick={onReset}
        aria-label="Limpar todos os filtros"
        style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '8px',
          padding: '8px 16px',
          color: '#EF4444',
          fontSize: '0.875rem',
          cursor: 'pointer',
          marginTop: 'auto',
        }}
      >
        Limpar filtros
      </button>
    </fieldset>
  );
}

const labelStyle: React.CSSProperties = {
  fontSize: '0.75rem',
  fontWeight: 600,
  color: '#94a3b8',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};
