import { useCallback, useEffect, useState } from 'react';
import { fetchPolls, fetchPollById } from '../services/api';
import type { Poll, PollFilters, PollSummary } from '../types/poll.types';

interface UsePollsReturn {
  polls: PollSummary[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function usePolls(filters: PollFilters = {}): UsePollsReturn {
  const [polls, setPolls] = useState<PollSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const filterKey = JSON.stringify(filters);

  const refetch = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchPolls(filters)
      .then(setPolls)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [filterKey]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { polls, loading, error, refetch };
}

interface UsePollDetailReturn {
  poll: Poll | null;
  loading: boolean;
  error: string | null;
}

export function usePollDetail(pollId: string | null): UsePollDetailReturn {
  const [poll, setPoll] = useState<Poll | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!pollId) return;
    setLoading(true);
    setError(null);
    fetchPollById(pollId)
      .then(setPoll)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [pollId]);

  return { poll, loading, error };
}
