import { describe, expect, it } from 'vitest';
import {
  daysBetween,
  formatDate,
  formatPercentage,
  weightedAverage,
} from '../utils/weightedAverage';

describe('weightedAverage', () => {
  it('retorna 0 para array vazio', () => {
    expect(weightedAverage([])).toBe(0);
  });

  it('retorna o valor com uma única pesquisa recente', () => {
    const result = weightedAverage([
      { value: 30, sampleSize: 2000, daysAgo: 0 },
    ]);
    expect(result).toBe(30);
  });

  it('dá mais peso a pesquisas recentes', () => {
    const result = weightedAverage([
      { value: 40, sampleSize: 2000, daysAgo: 0 },
      { value: 20, sampleSize: 2000, daysAgo: 30 },
    ]);
    // Pesquisa recente (40%) deve puxar a média para cima de 30
    expect(result).toBeGreaterThan(30);
  });

  it('dá mais peso a amostras maiores', () => {
    const result = weightedAverage([
      { value: 40, sampleSize: 10000, daysAgo: 0 },
      { value: 20, sampleSize: 100, daysAgo: 0 },
    ]);
    // Amostra maior (40%) deve dominar
    expect(result).toBeGreaterThan(35);
  });

  it('combina recência e amostra corretamente', () => {
    const polls = [
      { value: 50, sampleSize: 5000, daysAgo: 1 },
      { value: 30, sampleSize: 1000, daysAgo: 28 },
      { value: 40, sampleSize: 2000, daysAgo: 7 },
    ];
    const result = weightedAverage(polls);
    // Resultado deve estar entre 30 e 50
    expect(result).toBeGreaterThan(30);
    expect(result).toBeLessThan(50);
  });

  it('arredonda para 2 casas decimais', () => {
    const result = weightedAverage([
      { value: 33.333, sampleSize: 1000, daysAgo: 0 },
    ]);
    const decimals = result.toString().split('.')[1];
    expect(!decimals || decimals.length <= 2).toBe(true);
  });
});

describe('daysBetween', () => {
  it('retorna 0 para a data de hoje', () => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    expect(daysBetween(today, now)).toBe(0);
  });

  it('calcula diferença de dias corretamente', () => {
    const now = new Date('2026-03-15');
    expect(daysBetween('2026-03-10', now)).toBe(5);
  });

  it('retorna 0 para datas no futuro', () => {
    const now = new Date('2026-03-01');
    expect(daysBetween('2026-04-01', now)).toBe(0);
  });
});

describe('formatPercentage', () => {
  it('formata com uma casa decimal e símbolo %', () => {
    expect(formatPercentage(30)).toBe('30.0%');
    expect(formatPercentage(42.567)).toBe('42.6%');
    expect(formatPercentage(0)).toBe('0.0%');
  });
});

describe('formatDate', () => {
  it('formata data no padrão brasileiro', () => {
    const formatted = formatDate('2026-03-15');
    // Deve conter o ano; dia pode variar por fuso horário
    expect(formatted).toContain('2026');
    expect(formatted).toMatch(/\d{2}/);
  });
});
