export type Institute = 'datafolha' | 'quaest' | 'parana' | 'atlas' | 'ibope';

export type ElectionType = 'presidential' | 'governor' | 'senator';

export type Trend = 'up' | 'down' | 'stable';

export interface CandidateResult {
  candidateId: string;
  candidateName: string;
  party: string;
  votingIntention: number;
  validVotes: number;
  spontaneous?: number;
  rejection?: number;
}

export interface Poll {
  id: string;
  institute: Institute;
  publishedAt: string;
  fieldworkStart: string;
  fieldworkEnd: string;
  sampleSize: number;
  marginOfError: number;
  confidenceLevel: number;
  electionType: ElectionType;
  state?: string;
  results: CandidateResult[];
  sourceUrl: string;
}

export interface PollSummary {
  id: string;
  institute: Institute;
  publishedAt: string;
  sampleSize: number;
  marginOfError: number;
  electionType: ElectionType;
  state?: string;
  topCandidate: string;
  topPercentage: number;
}

export interface AggregateResult {
  candidateId: string;
  candidateName: string;
  party: string;
  weightedAverage: number;
  confidenceInterval: [number, number];
  pollsIncluded: number;
  lastUpdated: string;
  trend: Trend;
  trendValue: number;
}

export interface Candidate {
  id: string;
  name: string;
  party: string;
  photoUrl: string;
  state?: string;
}

export interface CandidatePollHistory {
  pollId: string;
  institute: Institute;
  publishedAt: string;
  votingIntention: number;
  validVotes: number;
  sampleSize: number;
  marginOfError: number;
}

export interface TrendPoint {
  date: string;
  value: number;
}

export interface PollFilters {
  institute?: Institute;
  electionType?: ElectionType;
  state?: string;
  startDate?: string;
  endDate?: string;
  candidateId?: string;
}

export const INSTITUTE_LABELS: Record<Institute, string> = {
  datafolha: 'Datafolha',
  quaest: 'Genial/Quaest',
  parana: 'Paraná Pesquisas',
  atlas: 'AtlasIntel',
  ibope: 'Ibope/Ipec',
};

export const PARTY_COLORS: Record<string, string> = {
  PT: '#E31010',
  PL: '#002776',
  NOVO: '#FF4F00',
  'União Brasil': '#2E3192',
  PSD: '#2196F3',
  Republicanos: '#1E90FF',
  MDB: '#FFA500',
  PDT: '#008C45',
  REDE: '#00A86B',
};
