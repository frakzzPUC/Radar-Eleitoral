import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { usePolls, usePollDetail } from '../hooks/usePolls';
import type { PollSummary, Poll } from '../types/poll.types';

const mockPolls: PollSummary[] = [
  {
    id: 'p1',
    institute: 'datafolha',
    publishedAt: '2026-03-01',
    sampleSize: 2000,
    marginOfError: 2.0,
    electionType: 'presidential',
    topCandidate: 'Candidato 1',
    topPercentage: 30,
  },
];

const mockPollDetail: Poll = {
  id: 'p1',
  institute: 'datafolha',
  publishedAt: '2026-03-01',
  fieldworkStart: '2026-02-25',
  fieldworkEnd: '2026-02-28',
  sampleSize: 2000,
  marginOfError: 2.0,
  confidenceLevel: 95,
  electionType: 'presidential',
  results: [
    { candidateId: 'c1', candidateName: 'Candidato 1', party: 'PT', votingIntention: 30, validVotes: 35 },
  ],
  sourceUrl: 'https://example.com',
};

vi.mock('../services/api', () => ({
  fetchPolls: vi.fn(),
  fetchPollById: vi.fn(),
}));

describe('usePolls', () => {
  beforeEach(async () => {
    const api = await import('../services/api');
    vi.mocked(api.fetchPolls).mockResolvedValue(mockPolls);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('inicia com loading true', () => {
    const { result } = renderHook(() => usePolls());
    expect(result.current.loading).toBe(true);
  });

  it('carrega pesquisas com sucesso', async () => {
    const { result } = renderHook(() => usePolls());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.polls).toEqual(mockPolls);
    expect(result.current.error).toBeNull();
  });

  it('captura erros da API', async () => {
    const api = await import('../services/api');
    vi.mocked(api.fetchPolls).mockRejectedValue(new Error('Falha na rede'));

    const { result } = renderHook(() => usePolls());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Falha na rede');
    expect(result.current.polls).toEqual([]);
  });
});

describe('usePollDetail', () => {
  beforeEach(async () => {
    const api = await import('../services/api');
    vi.mocked(api.fetchPollById).mockResolvedValue(mockPollDetail);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('não busca se pollId é null', async () => {
    const api = await import('../services/api');
    const { result } = renderHook(() => usePollDetail(null));

    expect(result.current.loading).toBe(false);
    expect(result.current.poll).toBeNull();
    expect(api.fetchPollById).not.toHaveBeenCalled();
  });

  it('carrega detalhes da pesquisa', async () => {
    const { result } = renderHook(() => usePollDetail('p1'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.poll).toEqual(mockPollDetail);
    expect(result.current.error).toBeNull();
  });
});
