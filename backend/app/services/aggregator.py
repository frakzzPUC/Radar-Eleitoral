"""Serviço de agregação de pesquisas eleitorais.

Calcula médias ponderadas e tendências a partir
dos dados coletados de múltiplos institutos.
"""

import math
from collections import defaultdict
from datetime import date, datetime, timezone

from app.models.poll import AggregateResult, Poll, Trend


def _days_since(poll_date: date) -> int:
    """Retorna quantos dias se passaram desde a data da pesquisa."""
    delta = date.today() - poll_date
    return max(delta.days, 0)


def _recency_weight(days: int, half_life: int = 14) -> float:
    """Calcula peso por recência usando decaimento exponencial.

    Pesquisas mais recentes recebem peso maior.
    O half_life controla a velocidade do decaimento:
    após half_life dias, o peso cai pela metade.
    """
    return math.exp(-0.693 * days / half_life)


def _sample_weight(sample_size: int) -> float:
    """Calcula peso baseado no tamanho da amostra.

    Usa raiz quadrada para evitar que amostras muito grandes
    dominem completamente o cálculo.
    """
    return math.sqrt(sample_size)


def calculate_weighted_average(
    polls: list[Poll],
    candidate_id: str,
) -> AggregateResult | None:
    """Calcula a média ponderada de intenção de voto para um candidato.

    Ponderação combina dois fatores:
    1. Recência da pesquisa (decaimento exponencial com half-life de 14 dias)
    2. Tamanho da amostra (raiz quadrada para suavização)

    O intervalo de confiança é estimado com base na margem de erro
    ponderada das pesquisas incluídas.

    Parameters:
        polls: Lista de pesquisas a agregar.
        candidate_id: ID do candidato para calcular.

    Returns:
        Resultado agregado ou None se não houver dados.
    """
    weighted_sum = 0.0
    total_weight = 0.0
    weighted_margin_sum = 0.0
    candidate_name = ""
    party = ""
    values_for_trend: list[tuple[date, float]] = []

    for poll in polls:
        for result in poll.results:
            if result.candidate_id != candidate_id:
                continue

            days = _days_since(poll.published_at)
            weight = _recency_weight(days) * _sample_weight(poll.sample_size)

            weighted_sum += result.voting_intention * weight
            weighted_margin_sum += poll.margin_of_error * weight
            total_weight += weight

            candidate_name = result.candidate_name
            party = result.party
            values_for_trend.append(
                (poll.published_at, result.voting_intention)
            )

    if total_weight == 0:
        return None

    avg = weighted_sum / total_weight
    weighted_margin = weighted_margin_sum / total_weight

    confidence_interval = (
        max(0.0, round(avg - weighted_margin, 2)),
        min(100.0, round(avg + weighted_margin, 2)),
    )

    trend, trend_value = _calculate_trend(values_for_trend)

    return AggregateResult(
        candidate_id=candidate_id,
        candidate_name=candidate_name,
        party=party,
        weighted_average=round(avg, 2),
        confidence_interval=confidence_interval,
        polls_included=len(values_for_trend),
        last_updated=datetime.now(tz=timezone.utc),
        trend=trend,
        trend_value=round(trend_value, 2),
    )


def _calculate_trend(
    values: list[tuple[date, float]],
) -> tuple[Trend, float]:
    """Determina a tendência comparando a média das pesquisas recentes com as anteriores.

    Divide as pesquisas em duas metades cronológicas e compara
    as médias. Variação menor que 1 ponto percentual é considerada estável.
    """
    if len(values) < 2:
        return Trend.STABLE, 0.0

    sorted_values = sorted(values, key=lambda v: v[0])
    mid = len(sorted_values) // 2
    older = [v[1] for v in sorted_values[:mid]]
    newer = [v[1] for v in sorted_values[mid:]]

    older_avg = sum(older) / len(older)
    newer_avg = sum(newer) / len(newer)
    diff = newer_avg - older_avg

    if diff > 1.0:
        return Trend.UP, diff
    if diff < -1.0:
        return Trend.DOWN, diff
    return Trend.STABLE, diff


def aggregate_all_candidates(
    polls: list[Poll],
) -> list[AggregateResult]:
    """Calcula agregados para todos os candidatos presentes nas pesquisas.

    Parameters:
        polls: Lista de pesquisas a agregar.

    Returns:
        Lista de resultados agregados ordenada por média ponderada (desc).
    """
    candidate_ids: set[str] = set()
    for poll in polls:
        for result in poll.results:
            candidate_ids.add(result.candidate_id)

    aggregates: list[AggregateResult] = []
    for cid in candidate_ids:
        agg = calculate_weighted_average(polls, cid)
        if agg is not None:
            aggregates.append(agg)

    return sorted(aggregates, key=lambda a: a.weighted_average, reverse=True)


def group_polls_by_candidate(
    polls: list[Poll],
) -> dict[str, list[tuple[date, float]]]:
    """Agrupa intenções de voto por candidato, ordenadas por data.

    Útil para gerar gráficos de tendência temporal.

    Parameters:
        polls: Lista de pesquisas.

    Returns:
        Dicionário com candidate_id -> lista de (data, intenção de voto).
    """
    groups: dict[str, list[tuple[date, float]]] = defaultdict(list)
    for poll in polls:
        for result in poll.results:
            groups[result.candidate_id].append(
                (poll.published_at, result.voting_intention)
            )

    for candidate_id in groups:
        groups[candidate_id].sort(key=lambda v: v[0])

    return dict(groups)
