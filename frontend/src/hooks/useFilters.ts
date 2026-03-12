import { useCallback, useState } from 'react';
import type { ElectionType, Institute, PollFilters } from '../types/poll.types';

interface UseFiltersReturn {
  filters: PollFilters;
  setInstitute: (institute: Institute | undefined) => void;
  setElectionType: (type: ElectionType | undefined) => void;
  setState: (state: string | undefined) => void;
  setDateRange: (start: string | undefined, end: string | undefined) => void;
  resetFilters: () => void;
}

const INITIAL_FILTERS: PollFilters = {};

export function useFilters(): UseFiltersReturn {
  const [filters, setFilters] = useState<PollFilters>(INITIAL_FILTERS);

  const setInstitute = useCallback((institute: Institute | undefined) => {
    setFilters((prev) => ({ ...prev, institute }));
  }, []);

  const setElectionType = useCallback((electionType: ElectionType | undefined) => {
    setFilters((prev) => ({ ...prev, electionType }));
  }, []);

  const setState = useCallback((state: string | undefined) => {
    setFilters((prev) => ({ ...prev, state }));
  }, []);

  const setDateRange = useCallback(
    (startDate: string | undefined, endDate: string | undefined) => {
      setFilters((prev) => ({ ...prev, startDate, endDate }));
    },
    [],
  );

  const resetFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS);
  }, []);

  return {
    filters,
    setInstitute,
    setElectionType,
    setState,
    setDateRange,
    resetFilters,
  };
}
