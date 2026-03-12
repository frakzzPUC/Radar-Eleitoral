import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useAggregate, useTrends } from '../hooks/useAggregate';
import type { AggregateResult, TrendPoint } from '../types/poll.types';

const mockAggregates: AggregateResult[] = [
  {
    candidateId: 'c1',
    candidateName: 'Candidato 1',
    party: 'PT',
    weightedAverage: 30.5,
    pollsIncluded: 5,
    confidenceInterval: [28.5, 32.5],
    trend: 'up',
    trendValue: 1.5,
    lastUpdated: '2026-03-15',
  },
];

const mockTrends: Record<string, TrendPoint[]> = {
  c1: [
    { date: '2026-01-01', value: 28.0 },
    { date: '2026-02-01', value: 29.5 },
    { date: '2026-03-01', value: 30.5 },
  ],
};

vi.mock('../services/api', () => ({
  fetchAggregates: vi.fn(),
  fetchTrends: vi.fn(),
}));

describe('useAggregate', () => {
  beforeEach(async () => {
    const api = await import('../services/api');
    vi.mocked(api.fetchAggregates).mockResolvedValue(mockAggregates);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('inicia com loading true', () => {
    const { result } = renderHook(() => useAggregate());
    expect(result.current.loading).toBe(true);
  });

  it('carrega agregados com sucesso', async () => {
    const { result } = renderHook(() => useAggregate());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.aggregates).toEqual(mockAggregates);
    expect(result.current.error).toBeNull();
  });

  it('captura erros', async () => {
    const api = await import('../services/api');
    vi.mocked(api.fetchAggregates).mockRejectedValue(new Error('Servidor indisponível'));

    const { result } = renderHook(() => useAggregate());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Servidor indisponível');
  });
});

describe('useTrends', () => {
  beforeEach(async () => {
    const api = await import('../services/api');
    vi.mocked(api.fetchTrends).mockResolvedValue(mockTrends);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('carrega tendências com sucesso', async () => {
    const { result } = renderHook(() => useTrends());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.trends).toEqual(mockTrends);
    expect(result.current.error).toBeNull();
  });

  it('captura erros na busca de tendências', async () => {
    const api = await import('../services/api');
    vi.mocked(api.fetchTrends).mockRejectedValue(new Error('Timeout'));

    const { result } = renderHook(() => useTrends());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Timeout');
  });
});
