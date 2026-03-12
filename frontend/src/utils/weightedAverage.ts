/**
 * Calcula a média ponderada de intenções de voto.
 *
 * Ponderação combina recência (decaimento exponencial) e
 * tamanho da amostra (raiz quadrada) para dar mais peso a
 * pesquisas recentes com amostras maiores.
 *
 * @param polls - Array de objetos com valor, amostra e dias desde publicação
 * @returns Média ponderada ou 0 se não houver dados
 */
export function weightedAverage(
  polls: ReadonlyArray<{
    value: number;
    sampleSize: number;
    daysAgo: number;
  }>,
): number {
  if (polls.length === 0) return 0;

  let weightedSum = 0;
  let totalWeight = 0;

  for (const poll of polls) {
    // Decaimento exponencial: half-life de 14 dias
    const recencyWeight = Math.exp((-0.693 * poll.daysAgo) / 14);
    // Raiz quadrada suaviza impacto de amostras muito grandes
    const sampleWeight = Math.sqrt(poll.sampleSize);
    const weight = recencyWeight * sampleWeight;

    weightedSum += poll.value * weight;
    totalWeight += weight;
  }

  if (totalWeight === 0) return 0;

  return Math.round((weightedSum / totalWeight) * 100) / 100;
}

export function daysBetween(dateStr: string, now: Date = new Date()): number {
  const date = new Date(dateStr);
  const diff = now.getTime() - date.getTime();
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}
