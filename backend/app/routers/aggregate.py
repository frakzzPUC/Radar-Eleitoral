"""Router para endpoints de agregação de pesquisas."""

from fastapi import APIRouter

from app.schemas.poll_schema import AggregateResultSchema, TrendEnum
from app.services.aggregator import (
    aggregate_all_candidates,
    calculate_weighted_average,
    group_polls_by_candidate,
)
from app.services.seed_data import SEED_POLLS

router = APIRouter(prefix="/aggregate", tags=["Agregação"])


@router.get("/", response_model=list[AggregateResultSchema])
async def get_aggregates() -> list[AggregateResultSchema]:
    """Retorna agregados de todos os candidatos ordenados por média ponderada."""
    results = aggregate_all_candidates(SEED_POLLS)
    return [
        AggregateResultSchema(
            candidate_id=r.candidate_id,
            candidate_name=r.candidate_name,
            party=r.party,
            weighted_average=r.weighted_average,
            confidence_interval=r.confidence_interval,
            polls_included=r.polls_included,
            last_updated=r.last_updated,
            trend=TrendEnum(r.trend.value),
            trend_value=r.trend_value,
        )
        for r in results
    ]


@router.get("/{candidate_id}", response_model=AggregateResultSchema | None)
async def get_candidate_aggregate(
    candidate_id: str,
) -> AggregateResultSchema | None:
    """Retorna o agregado de um candidato específico."""
    result = calculate_weighted_average(SEED_POLLS, candidate_id)
    if result is None:
        return None

    return AggregateResultSchema(
        candidate_id=result.candidate_id,
        candidate_name=result.candidate_name,
        party=result.party,
        weighted_average=result.weighted_average,
        confidence_interval=result.confidence_interval,
        polls_included=result.polls_included,
        last_updated=result.last_updated,
        trend=TrendEnum(result.trend.value),
        trend_value=result.trend_value,
    )


@router.get("/trends/all")
async def get_trends() -> dict[str, list[dict]]:
    """Retorna séries temporais de intenção de voto por candidato.

    Útil para gráficos de tendência.
    """
    groups = group_polls_by_candidate(SEED_POLLS)
    return {
        candidate_id: [
            {"date": d.isoformat(), "value": v} for d, v in points
        ]
        for candidate_id, points in groups.items()
    }
