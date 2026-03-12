import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useFilters } from '../hooks/useFilters';

describe('useFilters', () => {
  it('inicia com filtros vazios', () => {
    const { result } = renderHook(() => useFilters());
    expect(result.current.filters).toEqual({});
  });

  it('atualiza instituto', () => {
    const { result } = renderHook(() => useFilters());

    act(() => {
      result.current.setInstitute('datafolha' as Parameters<typeof result.current.setInstitute>[0]);
    });

    expect(result.current.filters.institute).toBe('datafolha');
  });

  it('atualiza tipo de eleição', () => {
    const { result } = renderHook(() => useFilters());

    act(() => {
      result.current.setElectionType('presidential' as Parameters<typeof result.current.setElectionType>[0]);
    });

    expect(result.current.filters.electionType).toBe('presidential');
  });

  it('atualiza estado', () => {
    const { result } = renderHook(() => useFilters());

    act(() => {
      result.current.setState('SP');
    });

    expect(result.current.filters.state).toBe('SP');
  });

  it('atualiza intervalo de datas', () => {
    const { result } = renderHook(() => useFilters());

    act(() => {
      result.current.setDateRange('2026-01-01', '2026-03-31');
    });

    expect(result.current.filters.startDate).toBe('2026-01-01');
    expect(result.current.filters.endDate).toBe('2026-03-31');
  });

  it('reseta filtros para estado inicial', () => {
    const { result } = renderHook(() => useFilters());

    act(() => {
      result.current.setInstitute('datafolha' as Parameters<typeof result.current.setInstitute>[0]);
      result.current.setState('SP');
    });

    act(() => {
      result.current.resetFilters();
    });

    expect(result.current.filters).toEqual({});
  });

  it('preserva outros filtros ao atualizar um', () => {
    const { result } = renderHook(() => useFilters());

    act(() => {
      result.current.setInstitute('datafolha' as Parameters<typeof result.current.setInstitute>[0]);
    });

    act(() => {
      result.current.setState('RJ');
    });

    expect(result.current.filters.institute).toBe('datafolha');
    expect(result.current.filters.state).toBe('RJ');
  });
});
