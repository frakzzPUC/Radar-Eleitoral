import { useCallback, useEffect, useState } from 'react';
import { fetchAggregates, fetchTrends } from '../services/api';
import type { AggregateResult, TrendPoint } from '../types/poll.types';

interface UseAggregateReturn {
  aggregates: AggregateResult[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useAggregate(): UseAggregateReturn {
  const [aggregates, setAggregates] = useState<AggregateResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchAggregates()
      .then(setAggregates)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { aggregates, loading, error, refetch };
}

interface UseTrendsReturn {
  trends: Record<string, TrendPoint[]>;
  loading: boolean;
  error: string | null;
}

export function useTrends(): UseTrendsReturn {
  const [trends, setTrends] = useState<Record<string, TrendPoint[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchTrends()
      .then(setTrends)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { trends, loading, error };
}
