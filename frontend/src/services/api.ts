import type {
  AggregateResult,
  Candidate,
  CandidatePollHistory,
  Poll,
  PollFilters,
  PollSummary,
  TrendPoint,
} from '../types/poll.types';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api/v1';

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
  }
  return response.json() as Promise<T>;
}

function buildQueryString(filters: PollFilters): string {
  const params = new URLSearchParams();
  if (filters.institute) params.set('institute', filters.institute);
  if (filters.electionType) params.set('election_type', filters.electionType);
  if (filters.state) params.set('state', filters.state);
  if (filters.startDate) params.set('start_date', filters.startDate);
  if (filters.endDate) params.set('end_date', filters.endDate);
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export function fetchPolls(filters: PollFilters = {}): Promise<PollSummary[]> {
  return fetchJson<PollSummary[]>(`${API_BASE}/polls/${buildQueryString(filters)}`);
}

export function fetchPollById(id: string): Promise<Poll> {
  return fetchJson<Poll>(`${API_BASE}/polls/${encodeURIComponent(id)}`);
}

export function fetchCandidates(): Promise<Candidate[]> {
  return fetchJson<Candidate[]>(`${API_BASE}/candidates/`);
}

export function fetchCandidateById(id: string): Promise<Candidate> {
  return fetchJson<Candidate>(`${API_BASE}/candidates/${encodeURIComponent(id)}`);
}

export function fetchCandidatePolls(id: string): Promise<CandidatePollHistory[]> {
  return fetchJson<CandidatePollHistory[]>(
    `${API_BASE}/candidates/${encodeURIComponent(id)}/polls`,
  );
}

export function fetchAggregates(): Promise<AggregateResult[]> {
  return fetchJson<AggregateResult[]>(`${API_BASE}/aggregate/`);
}

export function fetchCandidateAggregate(id: string): Promise<AggregateResult | null> {
  return fetchJson<AggregateResult | null>(
    `${API_BASE}/aggregate/${encodeURIComponent(id)}`,
  );
}

export function fetchTrends(): Promise<Record<string, TrendPoint[]>> {
  return fetchJson<Record<string, TrendPoint[]>>(`${API_BASE}/aggregate/trends/all`);
}
